const jsonHeaders = {
  "content-type": "application/json; charset=UTF-8",
  "cache-control": "no-store"
};

function corsHeaders(origin, env) {
  const allowed = env.PUBLIC_ORIGIN || "*";
  return {
    "access-control-allow-origin": allowed === "*" ? "*" : (origin === allowed ? origin : allowed),
    "access-control-allow-credentials": "true",
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "GET,POST,OPTIONS"
  };
}

function response(data, status, request, env) {
  const h = new Headers(jsonHeaders);
  for (const [k,v] of Object.entries(corsHeaders(request.headers.get("Origin"), env))) h.set(k,v);
  return new Response(JSON.stringify(data), { status, headers: h });
}

function b64encode(bytes) {
  let s = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) s += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return btoa(s);
}
function b64decode(s) {
  const bin = atob(s.replace(/\s/g, ""));
  const out = new Uint8Array(bin.length);
  for (let i=0;i<bin.length;i++) out[i] = bin.charCodeAt(i);
  return out;
}
function utf8b64(text) { return b64encode(new TextEncoder().encode(text)); }
function b64utf8(text) { return new TextDecoder().decode(b64decode(text)); }

async function hmac(secret, value) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), {name:"HMAC", hash:"SHA-256"}, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return b64encode(new Uint8Array(sig)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
}
async function makeSession(env) {
  const exp = Math.floor(Date.now()/1000) + 8*60*60;
  const payload = `admin.${exp}`;
  const sig = await hmac(env.SESSION_SECRET, payload);
  return `${payload}.${sig}`;
}
async function validSession(request, env) {
  const cookie = request.headers.get("Cookie") || "";
  const m = cookie.match(/(?:^|;\s*)akl_admin=([^;]+)/);
  if (!m) return false;
  const parts = m[1].split(".");
  if (parts.length !== 3 || parts[0] !== "admin") return false;
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now()/1000)) return false;
  const expected = await hmac(env.SESSION_SECRET, `${parts[0]}.${parts[1]}`);
  return parts[2] === expected;
}

function ghBase(env) { return `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents`; }
function ghHeaders(env) {
  return {"accept":"application/vnd.github+json","authorization":`Bearer ${env.GITHUB_TOKEN}`,"x-github-api-version":"2022-11-28","user-agent":"xi-akl-1-api"};
}
async function githubGet(path, env) {
  const r = await fetch(`${ghBase(env)}/${path}?ref=${encodeURIComponent(env.GITHUB_BRANCH)}`, {headers: ghHeaders(env)});
  if (!r.ok) throw new Error(`GitHub GET ${path} failed: ${r.status}`);
  return r.json();
}
async function githubPut(path, contentBase64, message, env) {
  let sha;
  try { sha = (await githubGet(path, env)).sha; } catch (e) { if (!String(e.message).includes("404")) throw e; }
  const body = {message,content:contentBase64,branch:env.GITHUB_BRANCH,committer:{name:env.COMMITTER_NAME,email:env.COMMITTER_EMAIL}};
  if (sha) body.sha = sha;
  const r = await fetch(`${ghBase(env)}/${path}`, {method:"PUT",headers:{...ghHeaders(env),"content-type":"application/json"},body:JSON.stringify(body)});
  if (!r.ok) throw new Error(`GitHub PUT ${path} failed: ${r.status} ${await r.text()}`);
  return r.json();
}
async function githubDelete(path, message, env) {
  const file = await githubGet(path, env);
  const body = {message,sha:file.sha,branch:env.GITHUB_BRANCH,committer:{name:env.COMMITTER_NAME,email:env.COMMITTER_EMAIL}};
  const r = await fetch(`${ghBase(env)}/${path}`, {method:"DELETE",headers:{...ghHeaders(env),"content-type":"application/json"},body:JSON.stringify(body)});
  if (!r.ok) throw new Error(`GitHub DELETE ${path} failed: ${r.status} ${await r.text()}`);
  return r.json();
}
async function readSiteData(env) {
  const file = await githubGet(env.DATA_PATH, env);
  return JSON.parse(b64utf8(file.content));
}
async function writeSiteData(data, message, env) {
  return githubPut(env.DATA_PATH, utf8b64(JSON.stringify(data, null, 2) + "\n"), message, env);
}
function cleanPath(value) {
  return String(value || "").replace(/^\/+/, "").replace(/\.\.+/g, "").replace(/[^a-zA-Z0-9._\/-]/g, "-");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null,{status:204,headers:corsHeaders(request.headers.get("Origin"),env)});
    try {
      if (url.pathname === "/api/health" && request.method === "GET") return response({ok:true,service:"XI AKL 1 API"},200,request,env);

      if (url.pathname === "/api/data" && request.method === "GET") {
        const data = await readSiteData(env);
        return response({ok:true,data},200,request,env);
      }

      if (url.pathname === "/api/login" && request.method === "POST") {
        const body = await request.json();
        if (body.username !== env.ADMIN_USERNAME || body.password !== env.ADMIN_PASSWORD) return response({ok:false,message:"Username atau password salah"},401,request,env);
        const token = await makeSession(env);
        const h = new Headers(jsonHeaders);
        for (const [k,v] of Object.entries(corsHeaders(request.headers.get("Origin"),env))) h.set(k,v);
        h.set("set-cookie", `akl_admin=${token}; Path=/; Max-Age=28800; HttpOnly; Secure; SameSite=None`);
        return new Response(JSON.stringify({ok:true}),{status:200,headers:h});
      }

      if (url.pathname === "/api/logout" && request.method === "POST") {
        const h = new Headers(jsonHeaders);
        for (const [k,v] of Object.entries(corsHeaders(request.headers.get("Origin"),env))) h.set(k,v);
        h.set("set-cookie", "akl_admin=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=None");
        return new Response(JSON.stringify({ok:true}),{status:200,headers:h});
      }

      if (url.pathname === "/api/me" && request.method === "GET") return response({ok:await validSession(request,env)},200,request,env);

      if (!(await validSession(request,env))) return response({ok:false,message:"Unauthorized"},401,request,env);

      if (url.pathname === "/api/data" && request.method === "POST") {
        const body = await request.json();
        await writeSiteData(body.data, body.message || "Update data website XI AKL 1", env);
        return response({ok:true,message:"Data tersimpan ke GitHub"},200,request,env);
      }

      if (url.pathname === "/api/student-photo" && request.method === "POST") {
        const body = await request.json();
        const key = cleanPath(body.key).replace(/\//g,"-");
        const path = `assets/img/students/${key}.jpg`;
        if (body.action === "delete") {
          try { await githubDelete(path, `Hapus foto siswa ${key}`, env); } catch(e) { if (!String(e.message).includes("404")) throw e; }
          const data = await readSiteData(env); data.students ||= {}; data.students[key] ||= {}; data.students[key].photo = "";
          await writeSiteData(data, `Update data foto siswa ${key}`, env);
          return response({ok:true,path:""},200,request,env);
        }
        if (!body.dataUrl?.startsWith("data:image/")) return response({ok:false,message:"Format foto tidak valid"},400,request,env);
        const base64 = body.dataUrl.split(",",2)[1];
        await githubPut(path, base64, `Update foto siswa ${key}`, env);
        const data = await readSiteData(env); data.students ||= {}; data.students[key] ||= {}; data.students[key].photo = path;
        await writeSiteData(data, `Update data foto siswa ${key}`, env);
        return response({ok:true,path},200,request,env);
      }

      if (url.pathname === "/api/gallery-photo" && request.method === "POST") {
        const body = await request.json();
        const slot = Number(body.slot);
        if (!Number.isInteger(slot) || slot < 1 || slot > 50) return response({ok:false,message:"Slot galeri tidak valid"},400,request,env);
        const path = `assets/img/gallery/slot-${slot}.jpg`;
        if (body.action === "delete") {
          try { await githubDelete(path, `Hapus foto galeri slot ${slot}`, env); } catch(e) { if (!String(e.message).includes("404")) throw e; }
          const data = await readSiteData(env); data.galleryPhotos ||= {}; delete data.galleryPhotos[String(slot)]; await writeSiteData(data, `Update galeri slot ${slot}`, env);
          return response({ok:true,path:""},200,request,env);
        }
        if (!body.dataUrl?.startsWith("data:image/")) return response({ok:false,message:"Format foto tidak valid"},400,request,env);
        await githubPut(path, body.dataUrl.split(",",2)[1], `Update galeri slot ${slot}`, env);
        const data = await readSiteData(env); data.galleryPhotos ||= {}; data.galleryPhotos[String(slot)] = path; await writeSiteData(data, `Update galeri slot ${slot}`, env);
        return response({ok:true,path},200,request,env);
      }

      if (url.pathname === "/api/aspirations" && request.method === "POST") {
        const body = await request.json();
        const data = await readSiteData(env); data.aspirations ||= [];
        data.aspirations.push({name:String(body.name||"").slice(0,80),category:String(body.category||"").slice(0,50),message:String(body.message||"").slice(0,1000),createdAt:new Date().toISOString()});
        await writeSiteData(data,"Tambah aspirasi XI AKL 1",env);
        return response({ok:true},200,request,env);
      }

      return response({ok:false,message:"Not found"},404,request,env);
    } catch (e) {
      return response({ok:false,message:e.message || "Server error"},500,request,env);
    }
  }
};
