# XI-AKL 1 — Publish + Admin Edit + GitHub Storage

## Arsitektur
- Frontend: GitHub Pages
- Backend/API: Cloudflare Workers
- Penyimpanan perubahan: file `data/site.json` dan folder `assets/img/...` di repository GitHub
- Token GitHub dan password admin: Cloudflare Worker Secrets, BUKAN JavaScript frontend

## Struktur baru
- `data/site.json` — seluruh data awal website
- `backend/` — API Cloudflare Worker
- `js/config.js` — URL Worker publik
- `js/cloud.js` — sinkronisasi website dengan API/GitHub

## 1. Buat repository GitHub
Buat repository misalnya `xi-akl-1`, lalu upload seluruh isi folder website ini ke branch `main`.

## 2. Aktifkan GitHub Pages
Repository → Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` → folder `/ (root)` → Save.

## 3. Buat Fine-grained Personal Access Token GitHub
Buat token yang hanya mengakses repository `xi-akl-1` dan beri permission repository `Contents: Read and write`.
Jangan pernah menaruh token ini di `js/config.js`, HTML, atau JavaScript frontend.

## 4. Siapkan Cloudflare Worker
Pastikan Node.js terpasang. Buka terminal pada folder `backend`:

```bash
npm install
npx wrangler login
```

Edit `backend/wrangler.jsonc`:
- `PUBLIC_ORIGIN` = alamat GitHub Pages, misalnya `https://USERNAME.github.io`
- `GITHUB_OWNER` = username GitHub
- `GITHUB_REPO` = nama repository
- `GITHUB_BRANCH` = `main`

## 5. Masukkan secrets
Jalankan:

```bash
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put ADMIN_USERNAME
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put SESSION_SECRET
```

Nilainya:
- `GITHUB_TOKEN` = token GitHub tadi
- `ADMIN_USERNAME` = `ARYA`
- `ADMIN_PASSWORD` = `arya1140`
- `SESSION_SECRET` = string acak panjang, misalnya 40+ karakter

## 6. Deploy Worker

```bash
npx wrangler deploy
```

Cloudflare akan memberikan URL seperti:

`https://xi-akl-1-api.<subdomain>.workers.dev`

## 7. Hubungkan frontend ke Worker
Buka:

`js/config.js`

Ganti:

```js
window.AKL_API_URL = "https://GANTI-DENGAN-URL-WORKER-ANDA";
```

menjadi URL Worker kamu, contoh:

```js
window.AKL_API_URL = "https://xi-akl-1-api.example.workers.dev";
```

Simpan, lalu commit/push file ke GitHub.

## 8. Tes
1. Buka website GitHub Pages.
2. Klik Admin.
3. Login dengan `ARYA` / `arya1140`.
4. Ubah jadwal.
5. Klik Simpan.
6. Buka repository GitHub.
7. Pastikan `data/site.json` mendapatkan commit baru.
8. Buka website dari perangkat lain setelah Pages selesai memperbarui.
9. Tes foto siswa dan galeri.

## Catatan
- GitHub Pages dapat membutuhkan sedikit waktu untuk menerbitkan commit baru.
- Semua perubahan penting dibuat sebagai commit GitHub.
- Token GitHub hanya berada di Cloudflare Worker Secret.
- `data/site.json` boleh dibaca publik karena website memang membutuhkannya; rahasia login dan token tidak disimpan di sana.
- Jangan commit `.dev.vars` atau file yang berisi token.
