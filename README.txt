WEBSITE KELAS XI-AKL 1 - V6

Perubahan V6:
- Foto pada bagian Beranda sekarang menggunakan logo kelas XI AKL 1.
- File logo disimpan di assets/img/logo-kelas.png.
- Untuk mengganti foto/logo Beranda, cukup ganti file assets/img/logo-kelas.png dengan gambar baru menggunakan nama file yang sama.

Cara menjalankan:
Buka index.html di browser.


Fitur Profil Siswa V7
- Setiap siswa kini berbentuk kartu foto
- Klik ikon kamera untuk menambahkan/mengganti foto
- Foto otomatis diperkecil dan disimpan di browser perangkat menggunakan localStorage
- Tombol Hapus foto tersedia setelah foto ditambahkan
- Fitur ini bersifat lokal, jadi foto tidak otomatis tersimpan ke server atau terlihat di perangkat lain

V8 - BACKGROUND CURUG
- Seluruh background halaman menggunakan gambar curug di dalam hutan.
- File background: assets/img/background-curug.png
- Background dibuat soft/blur dan diberi overlay tipis agar teks tetap terbaca.

V15 - ADMIN PROFIL SISWA
- Admin yang sudah login dapat mengelola profil pribadi setiap siswa langsung dari Dashboard Admin
- Pilih salah satu dari 36 siswa
- Ubah nama, tempat/tanggal lahir, dan moto hidup
- Pilih/ganti foto profil siswa dan hapus foto jika diperlukan
- Foto diproses dan disimpan di localStorage perangkat
- Data profil siswa disimpan di localStorage perangkat
- Pengunjung biasa tidak dapat mengakses fitur edit tersebut sebelum login admin

V16: Login admin diperbarui menjadi username ARYA dan password arya1140, ditambah tombol mata untuk melihat/menyembunyikan password, serta foto profil siswa pada modal dapat diklik untuk diperbesar.

V17 UPDATE:
- Ikon kamera pada kartu siswa hanya terlihat saat admin sudah login.
- Tombol hapus foto dan catatan instruksi foto juga disembunyikan untuk pengunjung biasa.
- Setelah admin logout, kontrol foto langsung kembali tersembunyi.
- Ditambahkan tombol ↻ Refresh pada navigasi setiap halaman untuk memuat ulang halaman dan mengambil data terbaru dari browser.

V18: Menambahkan tombol "Kembali ke Beranda" pada semua page selain Beranda.


Fitur Galeri Dinamis:
- Galeri dimulai dengan 50 kotak foto.
- Jika semua kotak sudah terisi foto, Admin akan melihat tombol "＋ Tambah Kotak Foto" di halaman Galeri.
- Klik tombol tersebut untuk menambah satu slot baru. Nama awal slot baru adalah "Foto Baru N" dan dapat diubah dari Dashboard Admin.
- Slot baru disimpan di data/site.json melalui backend/GitHub ketika fitur online aktif.
