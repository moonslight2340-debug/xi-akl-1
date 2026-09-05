// =====================================================
// ADMIN EDITOR V14 — semua perubahan lewat login admin
// Penyimpanan: localStorage (cocok untuk demo/static site)
// =====================================================
const ADMIN_USER = "XI - AKL 1";
const ADMIN_PASS = "AKL 1 JUARA 1";
const ADMIN_SESSION = "akl1_admin_session";
const STORE = "akl1_site_data";

const defaultSiteData = {
  home:{title:"XI - AKL 1",motto:"AKL 1 JUARA 1",description:"Satu kelas, satu cerita, satu semangat untuk terus tumbuh, belajar, dan jadi juara."},
  profile:{wali:"Rina Agustina S.Pd",school:"SMKN 22 Jakarta",chairman:"Isi nama di sini",vice:"Isi nama di sini",secretary:"Isi nama di sini",treasurer:"Isi nama di sini"},
  schedule:{...schedule},
  tasks:[...tasks],
  piket:{...piket},
  cash:{income:540000,expense:75000},
  galleryLabels:[...galleryLabels]
};
function readSiteData(){try{return {...defaultSiteData,...JSON.parse(localStorage.getItem(STORE)||"{}")}}catch(e){return {...defaultSiteData}}}
function saveSiteData(data){localStorage.setItem(STORE,JSON.stringify(data));applySiteData();toast("Perubahan admin berhasil disimpan 💙")}
function isAdmin(){return sessionStorage.getItem(ADMIN_SESSION)==="1"}
function requireAdmin(){if(!isAdmin()){openModal(loginModal);toast("Silakan login sebagai admin terlebih dahulu 🔐");return false}return true}

function applySiteData(){
  const d=readSiteData();
  // Beranda
  const heroTitle=document.querySelector(".hero h1"); if(heroTitle)heroTitle.textContent=d.home.title;
  const motto=document.querySelector(".hero-motto"); if(motto)motto.innerHTML=(d.home.motto||"").replace(/JUARA 1/i,"<span>JUARA 1</span>");
  const heroCopy=document.querySelector(".hero-copy"); if(heroCopy)heroCopy.textContent=d.home.description;
  // Profil
  const profileSection=document.getElementById("profil");
  if(profileSection){const info=profileSection.querySelectorAll(".info-card p"); if(info[0])info[0].textContent=d.profile.wali; if(info[1])info[1].textContent="36 siswa"; if(info[2])info[2].textContent=d.profile.school;
    const roles=profileSection.querySelectorAll(".structure-grid div span"); [d.profile.chairman,d.profile.vice,d.profile.secretary,d.profile.treasurer].forEach((v,i)=>{if(roles[i])roles[i].textContent=v});
  }
  // Jadwal/piket/tasks dari data admin
  window.currentSchedule=d.schedule||schedule; window.currentTasks=d.tasks||tasks; window.currentPiket=d.piket||piket;
  renderSchedule();renderTasks();renderPiket();renderCash();
}

// Override renderers so admin changes survive page refresh/navigation
const originalRenderSchedule = renderSchedule;
renderSchedule=function(){
  const el=document.getElementById("scheduleBoard"); if(!el)return;
  const d=readSiteData().schedule||schedule,days=["Senin","Selasa","Rabu","Kamis","Jumat"];
  el.innerHTML=Array.from({length:5},(_,i)=>`<div class="schedule-row"><div class="time-box"><strong>${i+1}</strong><small>Mapel ${i+1}</small></div>${days.map(day=>`<div class="subject-box">${d[day]?.[i]||"—"}</div>`).join("")}</div>`).join("");
};
renderTasks=function(){
  const el=document.getElementById("taskGrid");if(!el)return;const arr=readSiteData().tasks||tasks;
  el.innerHTML=arr.map(x=>`<article class="task-card reveal visible"><span class="tag">${x.type||"TUGAS"}</span><h3>${x.title||""}</h3><p>${x.desc||""}</p><div class="deadline">${x.deadline||""}</div></article>`).join("");
};
renderPiket=function(){
  const el=document.getElementById("piketGrid");if(!el)return;const d=readSiteData().piket||piket;
  el.innerHTML=Object.entries(d).map(([day,members])=>`<article class="piket-card reveal visible"><span class="eyebrow">${day}</span><h3>Petugas Piket</h3><ul>${members.map(m=>`<li>${m}</li>`).join("")}</ul></article>`).join("");
};

// Ganti foto siswa hanya untuk admin
const originalPhotoInputHandler = document.querySelectorAll;
function guardStudentEditing(){
 document.querySelectorAll(".student-photo-input").forEach(input=>input.dataset.adminOnly="1");
 document.querySelectorAll(".photo-upload-btn").forEach(label=>label.title=isAdmin()?"Tambah/ganti foto siswa":"Login admin untuk mengubah foto");
 document.querySelectorAll(".photo-remove").forEach(btn=>btn.disabled=!isAdmin());
}
document.addEventListener("click",e=>{
 const upload=e.target.closest(".photo-upload-btn");
 if(upload&&!isAdmin()){e.preventDefault();e.stopPropagation();requireAdmin();return}
 const remove=e.target.closest(".photo-remove");
 if(remove&&!isAdmin()){e.preventDefault();e.stopPropagation();requireAdmin();}
});

// Profil pribadi siswa: hanya admin yang boleh menyimpan
profileEditForm?.addEventListener("submit",e=>{if(!requireAdmin())e.preventDefault()});

// Admin dashboard lengkap
function buildAdminDashboard(){
 const box=document.querySelector("#adminModal .admin-box"); if(!box)return;
 const d=readSiteData();
 box.innerHTML=`<button class="modal-close" id="adminClose">×</button>
 <div class="admin-head"><div><span class="eyebrow">DASHBOARD ADMIN</span><h2>Kelola Website XI - AKL 1</h2><p class="admin-sub">Semua perubahan dilakukan langsung dari sini</p></div><button class="btn small ghost" id="logoutBtn">Keluar</button></div>
 <div class="admin-editor-grid">
  <section class="admin-edit-card"><h3>🏠 Beranda</h3><label>Judul<input id="admHomeTitle" value="${escapeAttr(d.home.title)}"></label><label>Motto<input id="admHomeMotto" value="${escapeAttr(d.home.motto)}"></label><label>Deskripsi<textarea id="admHomeDesc">${escapeHtml(d.home.description)}</textarea></label><button class="btn primary" data-save="home">Simpan Beranda</button></section>
  <section class="admin-edit-card"><h3>👥 Profil Kelas</h3><label>Wali Kelas<input id="admWali" value="${escapeAttr(d.profile.wali)}"></label><label>Sekolah<input id="admSchool" value="${escapeAttr(d.profile.school)}"></label><div class="mini-grid">${[["admChair","Ketua Kelas",d.profile.chairman],["admVice","Wakil Ketua",d.profile.vice],["admSec","Sekretaris",d.profile.secretary],["admTreas","Bendahara",d.profile.treasurer]].map(x=>`<label>${x[1]}<input id="${x[0]}" value="${escapeAttr(x[2])}"></label>`).join("")}</div><button class="btn primary" data-save="profile">Simpan Profil</button></section>
  <section class="admin-edit-card wide"><h3>📚 Jadwal Pelajaran</h3><div class="mini-grid schedule-admin">${["Senin","Selasa","Rabu","Kamis","Jumat"].map(day=>`<label><b>${day}</b><textarea data-day="${day}" class="admSchedule" rows="5">${escapeHtml((d.schedule[day]||[]).join("\n"))}</textarea><small>Satu mapel per baris</small></label>`).join("")}</div><button class="btn primary" data-save="schedule">Simpan Jadwal</button></section>
  <section class="admin-edit-card wide"><h3>🧹 Jadwal Piket</h3><div class="mini-grid">${["Senin","Selasa","Rabu","Kamis","Jumat"].map(day=>`<label><b>${day}</b><textarea data-piket-day="${day}" class="admPiket" rows="6">${escapeHtml((d.piket[day]||[]).join("\n"))}</textarea><small>Satu nama per baris</small></label>`).join("")}</div><button class="btn primary" data-save="piket">Simpan Piket</button></section>
  <section class="admin-edit-card"><h3>💰 Kas Kelas</h3><label>Pemasukan<input id="admIncome" type="number" min="0" value="${Number(d.cash.income)||0}"></label><label>Pengeluaran<input id="admExpense" type="number" min="0" value="${Number(d.cash.expense)||0}"></label><div class="admin-balance">Saldo otomatis: <b id="admBalance">${rupiah((Number(d.cash.income)||0)-(Number(d.cash.expense)||0))}</b></div><button class="btn primary" data-save="cash">Simpan Kas</button></section>
  <section class="admin-edit-card wide"><h3>📝 Materi & Tugas</h3><p class="admin-help">Format: satu baris untuk satu tugas, gunakan <b>JENIS | JUDUL | DESKRIPSI | DEADLINE</b></p><textarea id="admTasks" rows="8">${escapeHtml((d.tasks||[]).map(x=>[x.type,x.title,x.desc,x.deadline].join(" | ")).join("\n"))}</textarea><button class="btn primary" data-save="tasks">Simpan Materi & Tugas</button></section>
  <section class="admin-edit-card wide"><h3>🖼️ Galeri</h3><p class="admin-help">Foto galeri diganti dari halaman Galeri setelah login. Judul 50 slot bisa diedit di sini.</p><textarea id="admGallery" rows="8">${escapeHtml((d.galleryLabels||galleryLabels).map((x,i)=>`${i+1}. ${x[1]}`).join("\n"))}</textarea><button class="btn primary" data-save="gallery">Simpan Nama Slot Galeri</button></section>
  <section class="admin-edit-card wide"><h3>👤 Data Siswa</h3><p class="admin-help">Klik kartu siswa di Profil untuk melihat profil. Foto dan data pribadi hanya dapat diubah setelah login admin.</p><button class="btn ghost" data-go="profil.html">Buka Halaman Profil</button></section>
 </div>`;
 wireAdminDashboard();
}
function escapeHtml(s){return String(s??"").replace(/[&<>]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[m]))}
function escapeAttr(s){return escapeHtml(s).replace(/"/g,"&quot;")}
function wireAdminDashboard(){
 document.getElementById("adminClose")?.addEventListener("click",()=>closeModal(adminModal));
 document.getElementById("logoutBtn")?.addEventListener("click",()=>{sessionStorage.removeItem(ADMIN_SESSION);closeModal(adminModal);refreshEditVisibility();toast("Berhasil keluar dari admin 🔒")});
 document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>location.href=b.dataset.go));
 const bal=()=>{const i=Number(document.getElementById("admIncome")?.value)||0,e=Number(document.getElementById("admExpense")?.value)||0;const x=document.getElementById("admBalance");if(x)x.textContent=rupiah(i-e)};
 document.getElementById("admIncome")?.addEventListener("input",bal);document.getElementById("admExpense")?.addEventListener("input",bal);
 document.querySelectorAll("[data-save]").forEach(btn=>btn.addEventListener("click",()=>saveAdminSection(btn.dataset.save)));
}
function saveAdminSection(type){
 const d=readSiteData();
 if(type==="home")d.home={title:document.getElementById("admHomeTitle").value,motto:document.getElementById("admHomeMotto").value,description:document.getElementById("admHomeDesc").value};
 if(type==="profile")d.profile={wali:document.getElementById("admWali").value,school:document.getElementById("admSchool").value,chairman:document.getElementById("admChair").value,vice:document.getElementById("admVice").value,secretary:document.getElementById("admSec").value,treasurer:document.getElementById("admTreas").value};
 if(type==="schedule"){d.schedule={};document.querySelectorAll(".admSchedule").forEach(t=>d.schedule[t.dataset.day]=t.value.split(/\n/).map(s=>s.trim()).filter(Boolean))}
 if(type==="piket"){d.piket={};document.querySelectorAll(".admPiket").forEach(t=>d.piket[t.dataset.piketDay]=t.value.split(/\n/).map(s=>s.trim()).filter(Boolean))}
 if(type==="cash")d.cash={income:Number(document.getElementById("admIncome").value)||0,expense:Number(document.getElementById("admExpense").value)||0};
 if(type==="tasks"){d.tasks=document.getElementById("admTasks").value.split(/\n/).map(line=>line.split("|").map(s=>s.trim())).filter(a=>a.length>=2&&a[1]).map(a=>({type:a[0]||"TUGAS",title:a[1],desc:a[2]||"",deadline:a[3]||""}))}
 if(type==="gallery"){const names=document.getElementById("admGallery").value.split(/\n/).filter(Boolean);d.galleryLabels=(d.galleryLabels||galleryLabels).map((x,i)=>{const raw=(names[i]||"").replace(/^\s*\d+\.\s*/,"").trim();return [x[0],raw||x[1]]})}
 saveSiteData(d);buildAdminDashboard();openModal(adminModal);
}

// Login: session admin, lalu buka dashboard lengkap
if(loginForm)loginForm.addEventListener("submit",e=>{e.preventDefault();const u=document.getElementById("username").value.trim(),p=document.getElementById("password").value;if(u===ADMIN_USER&&p===ADMIN_PASS){sessionStorage.setItem(ADMIN_SESSION,"1");closeModal(loginModal);buildAdminDashboard();openModal(adminModal);toast("Login admin berhasil 👋 Semua editor terbuka") }else toast("Username atau password salah")});
if(loginOpen)loginOpen.onclick=()=>{if(isAdmin()){buildAdminDashboard();openModal(adminModal)}else openModal(loginModal)};

// Ganti data kas lama supaya memakai data admin
const originalRenderCash=renderCash;
renderCash=function(){const el=document.getElementById("cashBody");if(!el){return}const d=readSiteData().cash||{income:0,expense:0};const income=Number(d.income)||0,expense=Number(d.expense)||0,balance=income-expense;document.getElementById("incomeTotal")&&(document.getElementById("incomeTotal").textContent=rupiah(income));document.getElementById("expenseTotal")&&(document.getElementById("expenseTotal").textContent=rupiah(expense));document.getElementById("balanceTotal")&&(document.getElementById("balanceTotal").textContent=rupiah(balance));const i=document.getElementById("editIncome"),e=document.getElementById("editExpense"),p=document.getElementById("editBalancePreview");if(i)i.value=income;if(e)e.value=expense;if(p)p.textContent=rupiah(balance);};

// Cash editor lama dikunci untuk non-admin
cashEditForm?.addEventListener("submit",e=>{if(!requireAdmin())e.preventDefault()});
resetCash?.addEventListener("click",e=>{if(!requireAdmin())e.preventDefault()});

// Galeri: klik slot hanya bisa upload setelah login
function renderGalleryAdminAware(){
 const el=document.getElementById("galleryGrid");if(!el)return;const labels=readSiteData().galleryLabels||galleryLabels;
 el.innerHTML=labels.map((x,i)=>{const saved=localStorage.getItem("akl1_gallery_"+(i+1));return `<div class="gallery-item reveal visible" data-slot="${i+1}" title="${isAdmin()?"Klik untuk memilih foto":"Login admin untuk mengubah foto"}">${saved?`<img src="${saved}" alt="${escapeAttr(x[1])}">`:`<span>${x[0]}</span>`}<b>${x[1]}</b><small>Slot ${i+1}${saved?" • Foto tersimpan":""}</small>${isAdmin()?`<label class="gallery-upload">📷 Ganti<input type="file" accept="image/*" hidden></label><button class="gallery-delete" type="button">Hapus</button>`:""}</div>`}).join("");
 el.querySelectorAll(".gallery-upload input").forEach(inp=>inp.addEventListener("change",async e=>{if(!requireAdmin())return;const item=e.target.closest(".gallery-item"),file=e.target.files?.[0];if(!file)return;try{localStorage.setItem("akl1_gallery_"+item.dataset.slot,await compressImage(file,900,.76));renderGalleryAdminAware();toast("Foto galeri tersimpan 📸")}catch(err){toast("Foto gagal diproses")}}));
 el.querySelectorAll(".gallery-delete").forEach(b=>b.addEventListener("click",()=>{if(!requireAdmin())return;const item=b.closest(".gallery-item");localStorage.removeItem("akl1_gallery_"+item.dataset.slot);renderGalleryAdminAware();toast("Foto galeri dihapus") }));
 el.querySelectorAll(".gallery-item").forEach(item=>item.addEventListener("click",e=>{if(e.target.closest("label,button,input"))return;if(!isAdmin()){requireAdmin();return}}));
}
renderGallery=renderGalleryAdminAware;

// Kunci form aspirasi admin? Aspirasi tetap boleh diisi siswa, hanya pengelolaan/edit konten oleh admin.
applySiteData();
guardStudentEditing();
if(isAdmin())document.body.classList.add("admin-active");
