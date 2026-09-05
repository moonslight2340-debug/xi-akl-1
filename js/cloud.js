/* XI AKL 1 — koneksi website ke Cloudflare Worker + GitHub */
(function(){
  const API=(window.AKL_API_URL||"").replace(/\/$/,"");
  if(!API || API.includes("GANTI-DENGAN-URL-WORKER-ANDA")) return;
  const STORE="akl1_site_data", SESSION="akl1_admin_session";
  const j=(v)=>JSON.stringify(v);
  async function api(path, options={}){
    const r=await fetch(API+path,{credentials:"include",...options,headers:{"content-type":"application/json",...(options.headers||{})}});
    let body={}; try{body=await r.json()}catch{}
    if(!r.ok) throw new Error(body.message||`HTTP ${r.status}`);
    return body;
  }
  function mergeStudentData(data){
    const students=data.students||{};
    Object.entries(students).forEach(([key,s])=>{
      localStorage.setItem(`akl1_student_profile_${key}`,j({birth:s.birth||"",motto:s.motto||""}));
      if(s.photo){localStorage.setItem(`akl1_student_photo_${key}`,new URL(s.photo,document.baseURI).href)}
      else localStorage.removeItem(`akl1_student_photo_${key}`);
    });
    const photos=data.galleryPhotos||{};
    Object.entries(photos).forEach(([slot,path])=>{if(path)localStorage.setItem(`akl1_gallery_${slot}`,new URL(path,document.baseURI).href);else localStorage.removeItem(`akl1_gallery_${slot}`)});
  }
  async function pull(){
    try{
      const r=await api("/api/data");
      localStorage.setItem(STORE,j(r.data));
      mergeStudentData(r.data);
      if(r.data.aspirations) localStorage.setItem("akl1_aspirations",j(r.data.aspirations));
      if(typeof window.applySiteData==="function") window.applySiteData();
      if(typeof window.renderSchedule==="function") window.renderSchedule();
      if(typeof window.renderTasks==="function") window.renderTasks();
      if(typeof window.renderPiket==="function") window.renderPiket();
      if(typeof window.renderGalleryAdminAware==="function") window.renderGalleryAdminAware();
      if(typeof window.renderStudentPhotos==="function") window.renderStudentPhotos();
      if(typeof window.loadAspirations==="function") window.loadAspirations();
    }catch(e){console.warn("Cloud data belum tersedia:",e.message)}
  }
  async function pushData(data,message){
    try{await api("/api/data",{method:"POST",body:j({data,message})});return true}
    catch(e){console.error(e);if(typeof window.toast==="function")window.toast("Gagal menyimpan ke GitHub: "+e.message);return false}
  }
  // Simpan data umum ke GitHub setelah tetap memperbarui tampilan lokal.
  if(typeof window.saveSiteData==="function"){
    const localSave=window.saveSiteData;
    window.saveSiteData=function(data){
      localSave(data);
      if(sessionStorage.getItem(SESSION)==="1") pushData(data,"Update konten website XI AKL 1");
    };
  }
  // Login online: event capture menghentikan login demo lokal.
  const form=document.getElementById("loginForm");
  form?.addEventListener("submit",async e=>{
    e.preventDefault();e.stopImmediatePropagation();
    const username=document.getElementById("username")?.value.trim()||"";
    const password=document.getElementById("password")?.value||"";
    try{
      await api("/api/login",{method:"POST",body:j({username,password})});
      sessionStorage.setItem(SESSION,"1");
      if(typeof window.closeModal==="function") window.closeModal(document.getElementById("loginModal"));
      if(typeof window.buildAdminDashboard==="function") window.buildAdminDashboard();
      if(typeof window.renderGalleryAdminAware==="function") window.renderGalleryAdminAware();
      if(typeof window.openModal==="function") window.openModal(document.getElementById("adminModal"));
      if(typeof window.toast==="function") window.toast("Login admin berhasil 👋");
    }catch(err){if(typeof window.toast==="function")window.toast(err.message||"Login gagal")}
  },true);
  // Logout juga menghapus cookie server.
  document.addEventListener("click",e=>{
    if(e.target.closest?.("#logoutBtn")){
      api("/api/logout",{method:"POST"}).catch(()=>{});
      sessionStorage.removeItem(SESSION);
      if(typeof window.renderGalleryAdminAware==="function") window.renderGalleryAdminAware();
    }
  },true);
  // Profil siswa.
  if(typeof window.saveStudentProfile==="function"){
    const localProfile=window.saveStudentProfile;
    window.saveStudentProfile=function(key,birth,motto){
      localProfile(key,birth,motto);
      setTimeout(()=>{
        const data=JSON.parse(localStorage.getItem(STORE)||"{}");
        data.students=data.students||{};data.students[key]=data.students[key]||{};
        data.students[key].name=data.studentNames?.[key]||key;
        data.students[key].birth=birth.trim();data.students[key].motto=motto.trim();
        pushData(data,"Update profil siswa "+key);
      },0);
    };
  }
  // Foto siswa: tunggu handler asli selesai, lalu upload data URL ke Worker.
  document.addEventListener("change",e=>{
    const input=e.target.closest?.(".student-photo-input,#admStudentPhoto"); if(!input)return;
    setTimeout(()=>{
      const card=input.closest?.(".student-card");
      const key=card?.dataset.student || document.getElementById("admStudentSelect")?.value;
      if(!key)return;
      const dataUrl=localStorage.getItem(`akl1_student_photo_${key}`);
      if(dataUrl && dataUrl.startsWith("data:image/")) api("/api/student-photo",{method:"POST",body:j({key,dataUrl})}).then(p=>{const d=JSON.parse(localStorage.getItem(STORE)||"{}");d.students=d.students||{};d.students[key]=d.students[key]||{};d.students[key].photo=p.path;localStorage.setItem(STORE,j(d));}).catch(err=>window.toast?.("Foto belum tersimpan ke GitHub: "+err.message));
    },700);
  },true);
  document.addEventListener("click",e=>{
    const btn=e.target.closest?.(".photo-remove,#admStudentRemovePhoto"); if(!btn)return;
    setTimeout(()=>{
      const card=btn.closest?.(".student-card");const key=card?.dataset.student || document.getElementById("admStudentSelect")?.value;if(!key)return;
      api("/api/student-photo",{method:"POST",body:j({key,action:"delete"})}).catch(err=>window.toast?.("Foto belum terhapus dari GitHub: "+err.message));
    },300);
  },true);
  // Galeri.
  document.addEventListener("change",e=>{
    const input=e.target.closest?.(".gallery-upload input");if(!input)return;
    setTimeout(()=>{const item=input.closest(".gallery-item"),slot=Number(item?.dataset.slot);const dataUrl=localStorage.getItem(`akl1_gallery_${slot}`);if(!slot||!dataUrl)return;api("/api/gallery-photo",{method:"POST",body:j({slot,dataUrl})}).catch(err=>window.toast?.("Galeri belum tersimpan ke GitHub: "+err.message));},700);
  },true);
  document.addEventListener("click",e=>{
    const btn=e.target.closest?.(".gallery-delete");if(!btn)return;const slot=Number(btn.closest(".gallery-item")?.dataset.slot);if(!slot)return;setTimeout(()=>api("/api/gallery-photo",{method:"POST",body:j({slot,action:"delete"})}).catch(err=>window.toast?.("Galeri belum terhapus dari GitHub: "+err.message)),300);
  },true);
  // Aspirasi publik juga disimpan ke GitHub.
  const aspirationForm=document.getElementById("aspirationForm");
  aspirationForm?.addEventListener("submit",e=>{
    const payload={name:document.getElementById("aspName")?.value||"",category:document.getElementById("aspCategory")?.value||"",message:document.getElementById("aspMessage")?.value||""};
    setTimeout(()=>api("/api/aspirations",{method:"POST",body:j(payload)}).catch(err=>window.toast?.("Aspirasi belum tersimpan online: "+err.message)),250);
  },true);
  // Pulihkan sesi server setelah reload.
  api("/api/me").then(r=>{if(r.ok)sessionStorage.setItem(SESSION,"1")}).catch(()=>{});
  pull();
})();
