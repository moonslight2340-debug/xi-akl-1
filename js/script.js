// =====================================================
// DATA XI - AKL 1 — MUDAH DIEDIT
// =====================================================
const schedule = {
  "Senin":["Komputer Akuntansi","PJDM","BP/BK","Bahasa Indonesia"],
  "Selasa":["Mapel Pilihan AK","Kreativitas, Inovasi, dan Kewirausahaan","Pendidikan Agama Dan Budi Pekerti","Akuntansi Keuangan"],
  "Rabu":["Matematika","PJDM","Administrasi Pajak","Sejarah"],
  "Kamis":["Komputer Akuntansi","PJOK","Akuntansi Keuangan","Bahasa Inggris","PPKN"],
  "Jumat":["Kreativitas, Inovasi, dan Kewirausahaan","Administrasi Pajak","Bahasa Inggris","Mapel Pilihan AK"]
};

const tasks = [
  {type:"TUGAS", title:"Latihan Akuntansi", desc:"Tambahkan deskripsi tugas dan link pengumpulan di sini.", deadline:"Deadline: Isi tanggal"},
  {type:"MATERI", title:"Materi Pembelajaran", desc:"Tambahkan link Google Drive, PDF, atau sumber belajar.", deadline:"Update: Isi tanggal"},
  {type:"TUGAS", title:"Proyek Kelompok", desc:"Tambahkan anggota kelompok dan instruksi proyek.", deadline:"Deadline: Isi tanggal"}
];

const piket = {
  "Senin":["HAIKAL","DAFA","ARGYA","ERSA","ARYA","DARRIS","DZAKI","RAMADHAN"],
  "Selasa":["ADISKHA","SAJA","RISSA","TIFANY","APPRISCA","INTAN","EZALEA"],
  "Rabu":["DEWI","RIZKA NURAINI","DIVA","RIRI","NAJWA","NURI","ZAHRA"],
  "Kamis":["WAODE","CALYA","RIZKA DEWI","JIHAN","KHINANTI","NELDYA","OCTHA"],
  "Jumat":["ADINDA","NAZWATUL","JAHRA","LIDYA","TIKA","FARIDAH","AFIQA"]
};

const cash = [
  {date:"01/08/2026", desc:"Iuran kas", type:"Masuk", amount:360000},
  {date:"05/08/2026", desc:"Kebutuhan kelas", type:"Keluar", amount:75000},
  {date:"12/08/2026", desc:"Iuran kas", type:"Masuk", amount:180000}
];

const galleryLabels = [
  ["📸","Foto Kelas"],["🎉","Kegiatan"],["🏫","Sekolah"],["🏆","Lomba"],["📚","Belajar"],
  ["💙","Kenangan"],["👥","Teman"],["📝","Proyek"],["🎨","Kreativitas"],["🎵","Musik"],
  ["⚽","Olahraga"],["🚌","Study Tour"],["🧪","Praktikum"],["📖","Perpustakaan"],["📕","Literasi"],
  ["🤝","Kebersamaan"],["🏅","Kedisiplinan"],["💡","Motivasi"],["👫","Organisasi"],["💚","Kepedulian"],
  ["🧹","Kebersihan"],["🔒","Keamanan"],["📁","Dokumentasi"],["🚀","Inspirasi"],["🏠","Kelas Kita"],
  ["💬","Quotes"],["🙏","Doa Bersama"],["📰","Jurnal Kelas"],["📒","Catatan Penting"],["ℹ️","Info Penting"],
  ["🗓️","Agenda Kelas"],["🎖️","Penghargaan"],["💌","Ucapan"],["🎮","Games Edu"],["🌟","Wall of Fame"],
  ["🎂","Hari Spesial"],["🛡️","Tim Kelas"],["📄","Bank Soal"],["🎬","Video Kelas"],["☁️","Refleksi"],
  ["🏃","Ekskul"],["🖌️","Karya Siswa"],["👨‍🏫","Saran Guru"],["☎️","Kontak"],["🌐","Website Kelas"],
  ["📢","Pengumuman"],["📊","Polling"],["📋","Survey"],["🔴","Live Update"],["•••","Lainnya"]
];

const rupiah=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

function renderSchedule(){
  const el=document.getElementById("scheduleBoard"); if(!el)return;
  const days=["Senin","Selasa","Rabu","Kamis","Jumat"];
  const rows=Array.from({length:5},(_,i)=>`<div class="schedule-row"><div class="time-box"><strong>${i+1}</strong><small>Mapel ${i+1}</small></div>${days.map(d=>`<div class="subject-box">${schedule[d][i]||"—"}</div>`).join("")}</div>`).join("");
  el.innerHTML=rows;
}

function renderGallery(){
  const el=document.getElementById("galleryGrid"); if(!el)return;
  el.innerHTML=galleryLabels.map((x,i)=>`<div class="gallery-item reveal visible" data-slot="${i+1}" title="Slot galeri ${i+1}"><span>${x[0]}</span><b>${x[1]}</b><small>Slot ${i+1}</small></div>`).join("");
  document.querySelectorAll("#galleryGrid .gallery-item").forEach(item=>item.addEventListener("click",()=>toast(`Slot galeri ${item.dataset.slot} siap diisi foto`)));
}

function renderTasks(){
  const el=document.getElementById("taskGrid"); if(!el)return;
  el.innerHTML=tasks.map(x=>`<article class="task-card reveal visible"><span class="tag">${x.type}</span><h3>${x.title}</h3><p>${x.desc}</p><div class="deadline">${x.deadline}</div></article>`).join("");
}

function renderPiket(){
  const el=document.getElementById("piketGrid"); if(!el)return;
  el.innerHTML=Object.entries(piket).map(([day,members])=>`<article class="piket-card reveal visible"><span class="eyebrow">${day}</span><h3>Petugas Piket</h3><ul>${members.map(m=>`<li>${m}</li>`).join("")}</ul></article>`).join("");
}

function getCashManual(){
  try{return JSON.parse(localStorage.getItem("akl1_cash_manual")||"null")}catch(e){return null}
}

function renderCash(){
  const body=document.getElementById("cashBody"); if(!body)return;
  const autoIncome=cash.filter(x=>x.type==="Masuk").reduce((a,x)=>a+x.amount,0);
  const autoExpense=cash.filter(x=>x.type==="Keluar").reduce((a,x)=>a+x.amount,0);
  const manual=getCashManual();
  const income=manual?.income ?? autoIncome;
  const expense=manual?.expense ?? autoExpense;
  const balance=income-expense;

  document.getElementById("incomeTotal").textContent=rupiah(income);
  document.getElementById("expenseTotal").textContent=rupiah(expense);
  document.getElementById("balanceTotal").textContent=rupiah(balance);
  body.innerHTML=cash.map(x=>`<tr><td>${x.date}</td><td>${x.desc}</td><td>${x.type}</td><td>${rupiah(x.amount)}</td></tr>`).join("");

  const incomeInput=document.getElementById("editIncome");
  const expenseInput=document.getElementById("editExpense");
  const balancePreview=document.getElementById("editBalancePreview");
  if(incomeInput)incomeInput.value=income;
  if(expenseInput)expenseInput.value=expense;
  if(balancePreview)balancePreview.textContent=rupiah(balance);
}

const cashEditForm=document.getElementById("cashEditForm");
function updateCashPreview(){
  const income=Number(document.getElementById("editIncome")?.value)||0;
  const expense=Number(document.getElementById("editExpense")?.value)||0;
  const balance=income-expense;
  const balancePreview=document.getElementById("editBalancePreview");
  if(balancePreview)balancePreview.textContent=rupiah(balance);
  const incomeTotal=document.getElementById("incomeTotal");
  const expenseTotal=document.getElementById("expenseTotal");
  const balanceTotal=document.getElementById("balanceTotal");
  if(incomeTotal)incomeTotal.textContent=rupiah(income);
  if(expenseTotal)expenseTotal.textContent=rupiah(expense);
  if(balanceTotal)balanceTotal.textContent=rupiah(balance);
}

const editIncome=document.getElementById("editIncome");
const editExpense=document.getElementById("editExpense");
if(editIncome)editIncome.addEventListener("input",updateCashPreview);
if(editExpense)editExpense.addEventListener("input",updateCashPreview);

if(cashEditForm)cashEditForm.addEventListener("submit",e=>{
  e.preventDefault();
  const income=Number(document.getElementById("editIncome").value)||0;
  const expense=Number(document.getElementById("editExpense").value)||0;
  const data={income,expense};
  localStorage.setItem("akl1_cash_manual",JSON.stringify(data));
  renderCash();
  toast(`Kas tersimpan • Saldo otomatis ${rupiah(data.income-data.expense)} 💰`);
});

const resetCash=document.getElementById("resetCash");
if(resetCash)resetCash.onclick=()=>{
  localStorage.removeItem("akl1_cash_manual");
  renderCash();
  toast("Kas dikembalikan ke perhitungan otomatis ↺");
};

// =====================================================
// NAVIGASI + ANIMASI
// =====================================================
const menuToggle=document.getElementById("menuToggle"),mainNav=document.getElementById("mainNav");
if(menuToggle&&mainNav)menuToggle.addEventListener("click",()=>mainNav.classList.toggle("open"));
if(mainNav)mainNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>mainNav.classList.remove("open")));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const toastEl=document.getElementById("toast");
function toast(msg){if(!toastEl)return;toastEl.textContent=msg;toastEl.classList.add("show");setTimeout(()=>toastEl.classList.remove("show"),2600)}

// SEARCH SISWA
const search=document.getElementById("studentSearch");
if(search){
  const cards=[...document.querySelectorAll(".student-card")];
  search.addEventListener("input",e=>{const q=e.target.value.toLowerCase().trim();let shown=0;cards.forEach(c=>{const ok=c.innerText.toLowerCase().includes(q);c.style.display=ok?"flex":"none";if(ok)shown++});document.getElementById("studentCount").textContent=`${shown} siswa`});
}


// FOTO SISWA
function compressImage(file, maxSize=700, quality=.78){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const scale=Math.min(1,maxSize/Math.max(img.width,img.height));
        const canvas=document.createElement("canvas");
        canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);
        canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
        resolve(canvas.toDataURL("image/jpeg",quality));
      };
      img.onerror=reject;img.src=reader.result;
    };
    reader.onerror=reject;reader.readAsDataURL(file);
  });
}
function studentPhotoKey(card){return "akl1_student_photo_"+card.dataset.student}
function renderStudentPhotos(){
  document.querySelectorAll(".student-card").forEach(card=>{
    const box=card.querySelector(".student-photo"), saved=localStorage.getItem(studentPhotoKey(card));
    if(saved){box.innerHTML=`<img src="${saved}" alt="Foto ${card.querySelector("h3").textContent}">`;box.classList.add("has-image");card.querySelector(".photo-remove").style.display="inline-block"}
    else{box.textContent=box.dataset.initial;box.classList.remove("has-image");card.querySelector(".photo-remove").style.display="none"}
  });
}
document.querySelectorAll(".student-photo-input").forEach(input=>input.addEventListener("change",async e=>{
  const card=e.target.closest(".student-card"),file=e.target.files?.[0];if(!card||!file)return;
  if(!file.type.startsWith("image/")){toast("File harus berupa gambar");return}
  try{const data=await compressImage(file);localStorage.setItem(studentPhotoKey(card),data);renderStudentPhotos();toast("Foto siswa berhasil disimpan 📸")}catch(err){toast("Foto gagal diproses, coba gambar lain")}
  e.target.value="";
}));
document.querySelectorAll(".photo-remove").forEach(btn=>btn.addEventListener("click",()=>{
  const card=btn.closest(".student-card");localStorage.removeItem(studentPhotoKey(card));renderStudentPhotos();toast("Foto siswa dihapus")
}));
renderStudentPhotos();

// PROFIL PRIBADI SISWA
const studentProfiles = {
  "adinda-khairunnisya": {birth:"Belum diisi", motto:"Belum diisi"},
  "adiskha-mauliddya-arbah": {birth:"Belum diisi", motto:"Belum diisi"},
  "afiqa-fathina-yasmin": {birth:"Belum diisi", motto:"Belum diisi"},
  "apprisca-widyastuti": {birth:"Belum diisi", motto:"Belum diisi"},
  "argya-sanggar-agusti": {birth:"Belum diisi", motto:"Belum diisi"},
  "arya-pratama": {birth:"Belum diisi", motto:"Belum diisi"},
  "calya-dwi-putri-wiguna": {birth:"Belum diisi", motto:"Belum diisi"},
  "dafa-rizaldi": {birth:"Belum diisi", motto:"Belum diisi"},
  "darris-athalla-ramdhan": {birth:"Belum diisi", motto:"Belum diisi"},
  "dewi-fadila": {birth:"Belum diisi", motto:"Belum diisi"},
  "ersa-ekarini": {birth:"Belum diisi", motto:"Belum diisi"},
  "ezalea-intan-zahra": {birth:"Belum diisi", motto:"Belum diisi"},
  "faridah": {birth:"Belum diisi", motto:"Belum diisi"},
  "haikal-al-gifari-wibowo": {birth:"Belum diisi", motto:"Belum diisi"},
  "intan-imarizkya": {birth:"Belum diisi", motto:"Belum diisi"},
  "isyfiyani-aulia-diva": {birth:"Belum diisi", motto:"Belum diisi"},
  "jahra-kamila": {birth:"Belum diisi", motto:"Belum diisi"},
  "jihan-riskia-maulida": {birth:"Belum diisi", motto:"Belum diisi"},
  "khinanti-aisyafa-agustia-zahra": {birth:"Belum diisi", motto:"Belum diisi"},
  "lidya-cintya-kumalasari": {birth:"Belum diisi", motto:"Belum diisi"},
  "muhammad-dzaki": {birth:"Belum diisi", motto:"Belum diisi"},
  "muhammad-ramadhan": {birth:"Belum diisi", motto:"Belum diisi"},
  "najwa-putri-maharani": {birth:"Belum diisi", motto:"Belum diisi"},
  "nazwatul-nuralifah": {birth:"Belum diisi", motto:"Belum diisi"},
  "neldya-putri-zulita": {birth:"Belum diisi", motto:"Belum diisi"},
  "nuri": {birth:"Belum diisi", motto:"Belum diisi"},
  "nuri-octhavia-lingga": {birth:"Belum diisi", motto:"Belum diisi"},
  "nurita-aksari": {birth:"Belum diisi", motto:"Belum diisi"},
  "rissa-mulyani": {birth:"Belum diisi", motto:"Belum diisi"},
  "rizka-dewi-supriayadi": {birth:"Belum diisi", motto:"Belum diisi"},
  "rizka-dewi-supriyadi": {birth:"Belum diisi", motto:"Belum diisi"},
  "rizka-nuraini": {birth:"Belum diisi", motto:"Belum diisi"},
  "tifany-rahmita": {birth:"Belum diisi", motto:"Belum diisi"},
  "tika-octaviani-yusyady": {birth:"Belum diisi", motto:"Belum diisi"},
  "umniyyah-sulthanah-saja": {birth:"Belum diisi", motto:"Belum diisi"},
  "waode-bunga-lestari": {birth:"Belum diisi", motto:"Belum diisi"},
  "zahra-maharani": {birth:"Belum diisi", motto:"Belum diisi"}
};
const profileModal=document.getElementById("studentProfileModal");
const profileClose=document.getElementById("studentProfileClose");
let activeStudentKey=null;
function getStudentProfile(key){
  const saved=localStorage.getItem("akl1_student_profile_"+key);
  if(saved){try{return {...(studentProfiles[key]||{}),...JSON.parse(saved)}}catch(e){}}
  return studentProfiles[key]||{birth:"",motto:""};
}
function saveStudentProfile(key,birth,motto){
  localStorage.setItem("akl1_student_profile_"+key,JSON.stringify({birth:birth.trim(),motto:motto.trim()}));
}
function openStudentProfile(card){
  if(!profileModal)return;
  const name=card.querySelector("h3")?.textContent.trim()||"Nama Siswa";
  const key=card.dataset.student; activeStudentKey=key;
  const data=getStudentProfile(key);
  document.getElementById("profileName").textContent=name;
  document.getElementById("profileFullName").textContent=name;
  document.getElementById("profileBirth").textContent=data.birth||"Belum diisi";
  document.getElementById("profileMotto").textContent=data.motto||"Belum diisi";
  document.getElementById("editProfileBirth").value=data.birth||"";
  document.getElementById("editProfileMotto").value=data.motto||"";
  const saved=localStorage.getItem(studentPhotoKey(card));
  const photo=document.getElementById("profilePhoto");
  photo.innerHTML=saved?`<img src="${saved}" alt="Foto ${name}">`:(card.querySelector(".student-photo")?.dataset.initial||name.charAt(0));
  profileModal.classList.add("open"); profileModal.setAttribute("aria-hidden","false");
}
const profileEditForm=document.getElementById("profileEditForm");
profileEditForm?.addEventListener("submit",e=>{
  e.preventDefault(); if(!activeStudentKey)return;
  const birth=document.getElementById("editProfileBirth").value;
  const motto=document.getElementById("editProfileMotto").value;
  saveStudentProfile(activeStudentKey,birth,motto);
  document.getElementById("profileBirth").textContent=birth||"Belum diisi";
  document.getElementById("profileMotto").textContent=motto||"Belum diisi";
  const btn=profileEditForm.querySelector("button[type=submit]");
  if(btn){const old=btn.innerHTML;btn.innerHTML="✓ Tersimpan";setTimeout(()=>btn.innerHTML=old,1200)}
});
document.querySelectorAll(".student-card").forEach(card=>{
  card.setAttribute("tabindex","0");
  card.setAttribute("role","button");
  card.addEventListener("click",e=>{if(e.target.closest(".photo-upload-btn,.photo-remove,input"))return;openStudentProfile(card)});
  card.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&!e.target.closest(".photo-upload-btn,.photo-remove,input")){e.preventDefault();openStudentProfile(card)}});
});
function closeStudentProfile(){if(!profileModal)return;profileModal.classList.remove("open");profileModal.setAttribute("aria-hidden","true")}
profileClose?.addEventListener("click",closeStudentProfile);
profileModal?.addEventListener("click",e=>{if(e.target===profileModal)closeStudentProfile()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeStudentProfile()});

// FOTO PROFIL: klik untuk memperbesar
function setupProfilePhotoZoom(){
  const photo=document.getElementById("profilePhoto");
  if(!photo || photo.dataset.zoomReady)return;
  photo.dataset.zoomReady="1";
  photo.title="Klik untuk memperbesar foto";
  photo.style.cursor="zoom-in";
  photo.addEventListener("click",()=>{
    const img=photo.querySelector("img");
    if(!img)return;
    let zoom=document.getElementById("photoZoomModal");
    if(!zoom){
      zoom=document.createElement("div");
      zoom.id="photoZoomModal";
      zoom.className="photo-zoom-modal";
      zoom.innerHTML='<button type="button" class="photo-zoom-close" aria-label="Tutup">×</button><img id="photoZoomImage" alt="Foto profil diperbesar">';
      document.body.appendChild(zoom);
      zoom.addEventListener("click",e=>{if(e.target===zoom||e.target.classList.contains("photo-zoom-close")){zoom.classList.remove("open");}});
    }
    document.getElementById("photoZoomImage").src=img.src;
    zoom.classList.add("open");
  });
}
setupProfilePhotoZoom();

// ASPIRASI
function loadAspirations(){
  const list=document.getElementById("aspirationList");if(!list)return;
  const arr=JSON.parse(localStorage.getItem("akl1_aspirations")||"[]");
  list.innerHTML=arr.slice().reverse().map(x=>`<div class="asp-card"><strong>${x.name} • ${x.category}</strong><p>${x.message}</p></div>`).join("");
}
const aspirationForm=document.getElementById("aspirationForm");
if(aspirationForm)aspirationForm.addEventListener("submit",e=>{e.preventDefault();const arr=JSON.parse(localStorage.getItem("akl1_aspirations")||"[]");arr.push({name:document.getElementById("aspName").value,category:document.getElementById("aspCategory").value,message:document.getElementById("aspMessage").value});localStorage.setItem("akl1_aspirations",JSON.stringify(arr));e.target.reset();loadAspirations();toast("Aspirasi berhasil disimpan di perangkat ini 💙")});

// ADMIN LOGIN
const loginModal=document.getElementById("loginModal"),adminModal=document.getElementById("adminModal");
const openModal=m=>m&&m.classList.add("open");
const closeModal=m=>m&&m.classList.remove("open");
const loginOpen=document.getElementById("loginOpen");
if(loginOpen)loginOpen.onclick=()=>openModal(loginModal);
if(document.getElementById("loginClose"))document.getElementById("loginClose").onclick=()=>closeModal(loginModal);
if(document.getElementById("adminClose"))document.getElementById("adminClose").onclick=()=>closeModal(adminModal);
[loginModal,adminModal].filter(Boolean).forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModal(m)}));

const loginForm=document.getElementById("loginForm");

if(document.getElementById("logoutBtn"))document.getElementById("logoutBtn").onclick=()=>{closeModal(adminModal);toast("Berhasil keluar dari dashboard")};
document.querySelectorAll(".admin-tabs button").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".admin-tabs button").forEach(b=>b.classList.remove("active"));btn.classList.add("active");document.getElementById("adminContent").classList.toggle("hidden",btn.dataset.tab!=="content");document.getElementById("adminSettings").classList.toggle("hidden",btn.dataset.tab!=="settings")}));

const addTaskDemo=document.getElementById("addTaskDemo");
if(addTaskDemo)addTaskDemo.onclick=()=>{tasks.push({type:"TUGAS BARU",title:"Tugas Contoh Baru",desc:"Edit data tugas di file JavaScript sesuai kebutuhan kelas.",deadline:"Deadline: Belum ditentukan"});renderTasks();toast("Contoh tugas ditambahkan")};
const exportData=document.getElementById("exportData");
if(exportData)exportData.onclick=()=>{const data=localStorage.getItem("akl1_aspirations")||"[]";const blob=new Blob([data],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="aspirasi-xi-akl-1.json";a.click();URL.revokeObjectURL(a.href);toast("Data aspirasi diekspor")};

// INIT
renderSchedule();renderGallery();renderTasks();renderPiket();renderCash();loadAspirations();
// Password visibility toggle
function setupPasswordToggle(){
  const input=document.getElementById("password");
  if(!input || input.dataset.eyeReady)return;
  input.dataset.eyeReady="1";
  const wrap=input.parentElement;
  wrap.classList.add("password-wrap");
  const btn=document.createElement("button");
  btn.type="button";
  btn.className="password-toggle";
  btn.setAttribute("aria-label","Tampilkan password");
  btn.textContent="👁️";
  btn.addEventListener("click",()=>{
    const visible=input.type==="text";
    input.type=visible?"password":"text";
    btn.textContent=visible?"👁️":"🙈";
    btn.setAttribute("aria-label",visible?"Tampilkan password":"Sembunyikan password");
  });
  wrap.appendChild(btn);
}
setupPasswordToggle();

// =====================================================
// ADMIN EDITOR V14 — semua perubahan lewat login admin
// Penyimpanan: localStorage (cocok untuk demo/static site)
// =====================================================
const ADMIN_USER = "ARYA";
const ADMIN_PASS = "arya1140";
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
  <section class="admin-edit-card wide"><h3>🖼️ Galeri</h3><p class="admin-help">Foto galeri diganti dari halaman Galeri setelah login. Jika semua kotak sudah penuh foto, tombol <b>Tambah Kotak Foto</b> akan muncul otomatis untuk menambah slot baru.</p><textarea id="admGallery" rows="8">${escapeHtml((d.galleryLabels||galleryLabels).map((x,i)=>`${i+1}. ${x[1]}`).join("\n"))}</textarea><button class="btn primary" data-save="gallery">Simpan Nama Slot Galeri</button></section>
  <section class="admin-edit-card wide"><h3>👤 Data Siswa</h3><p class="admin-help">Klik kartu siswa di Profil untuk melihat profil. Foto dan data pribadi hanya dapat diubah setelah login admin.</p><button class="btn ghost" data-go="profil.html">Buka Halaman Profil</button></section>
 </div>`;
 wireAdminDashboard();
}
function escapeHtml(s){return String(s??"").replace(/[&<>]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[m]))}
function escapeAttr(s){return escapeHtml(s).replace(/"/g,"&quot;")}
function wireAdminDashboard(){
 document.getElementById("adminClose")?.addEventListener("click",()=>closeModal(adminModal));
 document.getElementById("logoutBtn")?.addEventListener("click",()=>{sessionStorage.removeItem(ADMIN_SESSION);closeModal(adminModal);toast("Berhasil keluar dari admin 🔒")});
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
 const el=document.getElementById("galleryGrid");if(!el)return;
 const data=readSiteData();
 const labels=data.galleryLabels||galleryLabels;
 const countEl=document.getElementById("galleryCount");
 const addBtn=document.getElementById("addGallerySlot");
 if(countEl)countEl.textContent=labels.length;
 const allFull=labels.length>0 && labels.every((x,i)=>!!localStorage.getItem("akl1_gallery_"+(i+1)));
 if(addBtn){
   addBtn.classList.toggle("hidden",!isAdmin() || !allFull);
   addBtn.onclick=()=>{
     if(!requireAdmin())return;
     const d=readSiteData();
     d.galleryLabels=d.galleryLabels||[];
     const next=d.galleryLabels.length+1;
     d.galleryLabels.push(["📸",`Foto Baru ${next}`]);
     saveSiteData(d);
     renderGalleryAdminAware();
     toast(`Kotak foto ${next} berhasil ditambahkan 📸`);
   };
 }
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

renderGalleryAdminAware(); guardStudentEditing();
// HARD UI GATE: blokir aksi edit sebelum event asli berjalan
function blockUnauthenticatedEdit(e){
  if(isAdmin()) return;
  const target=e.target;
  if(target.closest?.("#profileEditForm,#cashEditForm,.photo-upload-btn,.photo-remove,.gallery-upload,.gallery-delete")){
    e.preventDefault();e.stopImmediatePropagation();requireAdmin();
  }
}
document.addEventListener("submit",blockUnauthenticatedEdit,true);
document.addEventListener("click",blockUnauthenticatedEdit,true);
document.addEventListener("change",blockUnauthenticatedEdit,true);

// Sembunyikan area editor profil siswa bagi pengunjung biasa
function refreshEditVisibility(){
 const editor=document.querySelector(".profile-editor"); if(editor)editor.style.display=isAdmin()?"block":"none";
 document.querySelectorAll(".photo-upload-btn,.photo-remove").forEach(x=>{x.style.display=isAdmin()?"":"none"});
}
refreshEditVisibility();
const oldLoginHandlerRefresh=loginForm;

// Setelah login/logout, refresh tampilan kontrol
const originalOpenModal=openModal;
openModal=function(m){originalOpenModal(m);if(m===adminModal)refreshEditVisibility()};

// =====================================================
// ADMIN: KELOLA PROFIL PRIBADI + FOTO 36 SISWA
// =====================================================
const adminStudentDirectory = [
  ["adinda-khairunnisya","ADINDA KHAIRUNNISYA"],["adiskha-mauliddya-arbah","ADISKHA MAULIDDYA ARBAH"],["afiqa-fathina-yasmin","AFIQA FATHINA YASMIN"],["apprisca-widyastuti","APPRISCA WIDYASTUTI"],["argya-sanggar-agusti","ARGYA SANGGAR AGUSTI"],["arya-pratama","ARYA PRATAMA"],["calya-dwi-putri-wiguna","CALYA DWI PUTRI WIGUNA"],["dafa-rizaldi","DAFA RIZALDI"],["darris-athalla-ramdhan","DARRIS ATHALLA RAMDHAN"],["dewi-fadila","DEWI FADILA"],["ersa-ekarini","ERSA EKARINI"],["ezalea-intan-zahra","EZALEA INTAN ZAHRA"],["faridah","FARIDAH"],["haikal-al-gifari-wibowo","HAIKAL AL GIFARI WIBOWO"],["intan-imarizkya","INTAN IMARIZKYA"],["isyfiyani-aulia-diva","ISYFIYANI AULIA DIVA"],["jahra-kamila","JAHRA KAMILA"],["jihan-riskia-maulida","JIHAN RISKIA MAULIDA"],["khinanti-aisyafa-agustia-zahra","KHINANTI AISYAFA AGUSTIA ZAHRA"],["lidya-cintya-kumalasari","LIDYA CINTYA KUMALASARI"],["muhammad-dzaki","MUHAMMAD DZAKI"],["muhammad-ramadhan","MUHAMMAD RAMADHAN"],["najwa-putri-maharani","NAJWA PUTRI MAHARANI"],["nazwatul-nuralifah","NAZWATUL NURALIFAH"],["neldya-putri-zulita","NELDYA PUTRI ZULITA"],["nuri","NURI"],["nuri-octhavia-lingga","NURI OCTHAVIA LINGGA"],["nurita-aksari","NURITA AKSARI"],["rissa-mulyani","RISSA MULYANI"],["rizka-dewi-supriyadi","RIZKA DEWI SUPRIYADI"],["rizka-nuraini","RIZKA NURAINI"],["tifany-rahmita","TIFANY RAHMITA"],["tika-octaviani-yusyady","TIKA OCTAVIANI YUSYADY"],["umniyyah-sulthanah-saja","UMNIYYAH SULTHANAH SAJA"],["waode-bunga-lestari","WAODE BUNGA LESTARI"],["zahra-maharani","ZAHRA MAHARANI"]
];
function getAdminStudentRows(){
  return adminStudentDirectory.map(([key,defaultName])=>{
    const card=document.querySelector(`.student-card[data-student="${CSS.escape(key)}"]`);
    const stored=getStudentProfile(key);
    const savedName=readSiteData().studentNames?.[key];
    return {key,name:savedName||card?.querySelector("h3")?.textContent.trim()||stored.name||defaultName,birth:stored.birth||"",motto:stored.motto||"",photo:localStorage.getItem("akl1_student_photo_"+key)};
  });
}
function refreshStudentCardByKey(key){
  const card=document.querySelector(`.student-card[data-student="${CSS.escape(key)}"]`);if(!card)return;
  const d=readSiteData(),name=d.studentNames?.[key];
  if(name){const h=card.querySelector("h3");if(h)h.textContent=name}
  const box=card.querySelector(".student-photo"),saved=localStorage.getItem("akl1_student_photo_"+key);
  if(box){if(saved){box.innerHTML=`<img src="${saved}" alt="Foto siswa">`;box.classList.add("has-image")}else{box.textContent=box.dataset.initial||"👤";box.classList.remove("has-image")}}
  const remove=card.querySelector(".photo-remove");if(remove)remove.style.display=saved?"inline-block":"none";
}
const previousBuildAdminDashboard=buildAdminDashboard;
buildAdminDashboard=function(){
  previousBuildAdminDashboard();
  const box=document.querySelector("#adminModal .admin-box"),grid=box?.querySelector(".admin-editor-grid");
  if(!grid)return;
  const rows=getAdminStudentRows();
  const card=document.createElement("section");
  card.className="admin-edit-card wide admin-student-manager";
  card.innerHTML=`<h3>👤 Profil Pribadi & Foto 36 Siswa</h3>
    <p class="admin-help">Admin dapat memilih siswa, mengganti foto profil, mengubah tempat tanggal lahir, moto hidup, dan nama siswa langsung dari dashboard</p>
    <div class="student-admin-layout">
      <div class="student-admin-preview" id="admStudentPhotoPreview">👤</div>
      <div class="student-admin-fields">
        <label>Pilih Siswa<select id="admStudentSelect">${rows.map((r,i)=>`<option value="${escapeAttr(r.key)}">${i+1}. ${escapeHtml(r.name)}</option>`).join("")}</select></label>
        <label>Nama Siswa<input id="admStudentName" autocomplete="off"></label>
        <label>Tempat, Tanggal Lahir<input id="admStudentBirth" type="text" placeholder="Contoh: Jakarta, 12 Mei 2009" autocomplete="off"></label>
        <label>Moto Hidup<textarea id="admStudentMotto" rows="3" maxlength="180" placeholder="Tulis moto hidup..."></textarea></label>
        <div class="student-admin-actions">
          <label class="btn primary admin-photo-picker">📷 Pilih / Ganti Foto<input id="admStudentPhoto" type="file" accept="image/*" hidden></label>
          <button class="btn ghost" type="button" id="admStudentRemovePhoto">Hapus Foto</button>
          <button class="btn primary" type="button" id="saveStudentAdmin">💾 Simpan Profil Siswa</button>
        </div>
      </div>
    </div>`;
  grid.appendChild(card);
  const sel=card.querySelector("#admStudentSelect"),name=card.querySelector("#admStudentName"),birth=card.querySelector("#admStudentBirth"),motto=card.querySelector("#admStudentMotto"),photoInput=card.querySelector("#admStudentPhoto"),preview=card.querySelector("#admStudentPhotoPreview"),removePhoto=card.querySelector("#admStudentRemovePhoto");
  let pendingPhoto=null;
  function fill(){
    const r=rows.find(x=>x.key===sel.value)||rows[0];if(!r)return;
    const latest=getStudentProfile(r.key),storedName=readSiteData().studentNames?.[r.key];
    name.value=storedName||r.name;birth.value=latest.birth||"";motto.value=latest.motto||"";pendingPhoto=r.photo||null;
    preview.innerHTML=pendingPhoto?`<img src="${pendingPhoto}" alt="Preview foto siswa">`:(name.value.charAt(0)||"👤");
    removePhoto.disabled=!pendingPhoto;
  }
  sel.addEventListener("change",fill);
  photoInput.addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith("image/")){toast("File harus berupa gambar");return}try{pendingPhoto=await compressImage(file,700,.78);preview.innerHTML=`<img src="${pendingPhoto}" alt="Preview foto siswa">`;removePhoto.disabled=false;toast("Foto siap disimpan 📸")}catch(err){toast("Foto gagal diproses, coba gambar lain")}e.target.value=""});
  removePhoto.addEventListener("click",()=>{pendingPhoto=null;preview.textContent=(name.value.trim().charAt(0)||"👤");removePhoto.disabled=true});
  card.querySelector("#saveStudentAdmin").addEventListener("click",()=>{
    if(!requireAdmin())return;
    const key=sel.value,n=name.value.trim()||"Nama Siswa",b=birth.value.trim(),m=motto.value.trim();
    const data=readSiteData();data.studentNames=data.studentNames||{};data.studentNames[key]=n;localStorage.setItem(STORE,JSON.stringify(data));
    saveStudentProfile(key,b,m);
    if(pendingPhoto)localStorage.setItem("akl1_student_photo_"+key,pendingPhoto);else localStorage.removeItem("akl1_student_photo_"+key);
    refreshStudentCardByKey(key);toast("Profil dan foto siswa berhasil disimpan 💙");
    const fresh=getAdminStudentRows();const current=fresh.find(x=>x.key===key);if(current){const idx=[...sel.options].findIndex(o=>o.value===key);if(idx>=0)sel.options[idx].textContent=`${idx+1}. ${n}`}
    removePhoto.disabled=!pendingPhoto;
  });
  fill();
};

// Terapkan nama siswa yang telah diubah dari admin
function applyStudentNames(){
  const d=readSiteData(),names=d.studentNames||{};
  document.querySelectorAll(".student-card").forEach(c=>{if(names[c.dataset.student]){const h=c.querySelector("h3");if(h)h.textContent=names[c.dataset.student]}})
}
applyStudentNames();
