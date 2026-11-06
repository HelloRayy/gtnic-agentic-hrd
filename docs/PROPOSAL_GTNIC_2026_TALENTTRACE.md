# Draf Proposal GTNIC 2026: TalentTrace AI
**Sub-Tema**: Building Intelligent AI Agents for Enterprise Productivity  
**Kategori**: AI Agents (Enterprise & Industry)  

---

## 1. Judul Karya
**Pengembangan Sistem AI Agent Berbasis Multi-Tool Calling untuk Validasi Klaim CV dan Portofolio GitHub Calon Software Engineer.**

---

## 2. Latar Belakang Masalah
Proses rekrutmen tenaga kerja di bidang teknologi informasi, khususnya posisi rekayasa perangkat lunak (*software engineer*), menghadapi tantangan operasional yang cukup berat akibat tingginya volume berkas lamaran yang masuk. Tim *Human Resources Department* (HRD) sering kali harus memeriksa puluhan hingga ratusan berkas pelamar satu per satu secara manual, yang menyita banyak waktu dan tenaga.

Di samping volume yang besar, muncul pula fenomena klaim keahlian berlebih pada berkas resume (*resume inflation*). Banyak pelamar mencantumkan penguasaan berbagai teknologi dan *framework* terkini, namun sebagian di antaranya hanya memiliki pengalaman sebatas proyek latihan dasar atau menyalin kode dari tutorial daring. Keterbatasan latar belakang teknis koding membuat tim rekruter HRD kesulitan membedakan antara pelamar yang benar-benar berkompeten dengan pelamar yang sekadar mempercantik tulisan di CV.

Kondisi tersebut kerap memaksa tim HRD melibatkan *Tech Lead* atau *Senior Engineer* sejak tahap awal seleksi hanya untuk memeriksa repositori GitHub pelamar. Hal ini menimbulkan pemborosan jam kerja produktif tim rekayasa perangkat lunak yang berbiaya tinggi (*high opportunity cost*). Oleh karena itu, diperlukan sebuah asisten cerdas berbasis agen AI yang mampu membantu tim HRD memvalidasi portofolio kode kandidat secara otomatis, menyajikan ringkasan kualifikasi nyata yang mudah dipahami, serta mempercepat alur koordinasi sebelum masuk ke tahap wawancara teknis.

---

## 3. Tujuan, Manfaat, dan Solusi

### 3.1 Tujuan
Mempercepat proses screening awal kandidat teknologi dengan mengotomatisasi penelusuran portofolio GitHub, sehingga rekruter non-teknis dapat menyaring pelamar yang kompeten sebelum tahap interview teknis bersama tim engineering.

### 3.2 Manfaat
1. **Menghemat Waktu Seleksi HRD**: Tim rekruter tidak perlu membuka dan membaca ratusan berkas pelamar satu per satu. Sistem langsung menyajikan ringkasan profil kandidat, sehingga proses screening awal yang biasanya butuh berhari-hari bisa selesai dalam hitungan menit.
2. **Pemeriksaan Portofolio GitHub Otomatis**: Membantu HRD memvalidasi apakah keahlian yang ditulis di CV benar-benar ada buktinya di repositori GitHub pelamar, termasuk memeriksa riwayat commit asli agar terhindar dari proyek hasil tiruan atau salin-tempel.
3. **Konsultasi Teknis Sederhana untuk Rekruter**: Rekruter yang tidak memiliki latar belakang koding bisa langsung bertanya ke asisten AI mengenai istilah teknis atau proyek kandidat, lalu mendapatkan penjelasan yang mudah dipahami menggunakan bahasa sehari-hari.
4. **Mempermudah Koordinasi dengan Tim Engineering**: Hasil evaluasi yang rapi beserta rekomendasi topik pertanyaan teknis bisa langsung diteruskan ke Tech Lead, sehingga tahap wawancara lanjutan menjadi lebih terarah.

### 3.3 Solusi Otomatisasi
TalentTrace AI menawarkan solusi otomatisasi di mana agen AI mengakses langsung akun GitHub pelamar dan memeriksa riwayat proyek koding aslinya. Agen ini menyaring dan menyajikan informasi yang relevan dengan memadukan data dari CV dan akun GitHub, sehingga HRD memperoleh gambaran kompetensi pelamar secara akurat tanpa harus mengeceknya manual. Selain itu, sistem sudah terkoneksi langsung dengan ekosistem Google (Google Calendar dan Gmail) untuk mempercepat penjadwalan interview dan pengiriman draf email tindak lanjut.

---

## 4. Target Perusahaan / Pengguna Industri
Target utama pengguna TalentTrace AI adalah tim Human Resources Department (HRD), talent acquisition, dan rekruter teknis di perusahaan teknologi maupun startup digital yang secara rutin menyaring pelamar untuk posisi rekayasa perangkat lunak (*software engineering*).

---

## 5. Arsitektur Sistem AI
TalentTrace AI bekerja dengan menggabungkan model LLM dan mekanisme pemanggilan fungsi (*tool calling*) secara berurutan. Alur dimulai saat pengguna mengunggah berkas CV dan memasukkan tautan GitHub pelamar. Agen AI kemudian membaca dokumen tersebut, menentukan alat analisis yang dibutuhkan, dan memvalidasi kesesuaian data sebelum menyajikan hasilnya ke antarmuka web.

Proses analisis dijalankan melalui beberapa modul utama. Modul *cv_parser* mengekstrak riwayat kerja dan keahlian dari CV, lalu *github_triage* menyortir repositori publik kandidat yang paling relevan. Repositori tersebut kemudian diperiksa oleh *github_repo_audit* untuk melihat struktur folder, riwayat commit asli, dan berkas dependensi proyek. Selanjutnya, hasil temuan kode dicocokkan dengan klaim di CV melalui proses *grounding verification* agar ringkasan yang dihasilkan berbasis bukti nyata dan terbebas dari halusinasi model.

Untuk penyimpanan dan performa, sistem menggunakan database lokal SQLite dengan mode WAL serta *caching* dua lapis (RAM dan disk). Penggunaan SQLite lokal menjaga riwayat evaluasi tetap tersimpan cepat dan aman tanpa membebani panggilan API GitHub secara berulang. Pada sisi tampilan, pengguna dapat melihat ringkasan evaluasi, menjelajahi struktur berkas proyek, bertanya langsung ke asisten AI, serta menjadwalkan wawancara lewat integrasi Google Calendar dan Gmail.

---

## 6. Fitur Utama AI Agent & Metrik Estimasi Efisiensi Operasional
Fitur utama TalentTrace AI berfokus pada verifikasi kecocokan antara dokumen resume pelamar dengan bukti repositori kode di GitHub. Sistem mengekstrak klaim kemampuan teknis kandidat dan memetakannya langsung ke riwayat commit serta susunan proyek nyata. Melalui fitur penjelajah pohon berkas (*repo tree explorer*), pengguna dapat melihat hierarki direktori kode kandidat layaknya tampilan editor kode ringkas tanpa perlu berpindah tab peramban. Setiap keahlian yang diaudit kemudian diberi label status verifikasi secara transparan, sehingga rekruter langsung mengetahui bagian mana yang terbukti ada di repositori dan bagian mana yang belum memiliki bukti.

Untuk mendukung rekruter non-teknis, sistem menyediakan ruang diskusi interaktif di mana HRD dapat menanyakan aspek teknis atau istilah koding kandidat kepada asisten AI menggunakan bahasa sehari-hari. Agen menjawab dengan merujuk langsung pada fakta repositori pelamar, sekaligus membantu menyusun draf jadwal wawancara teknis yang terhubung ke Google Calendar serta menyiapkan draf email *feedback* bagi kandidat. Seluruh riwayat evaluasi ini dikelola secara persisten menggunakan basis data lokal SQLite dengan mode WAL dan mekanisme *caching* dua lapis, menjamin keamanan data internal perusahaan serta memungkinkan penelusuran riwayat audit secara instan.

Dari sisi efisiensi operasional, penerapan sistem ini memangkas waktu proses screening awal dari rata-rata 3 hingga 5 hari kerja per posisi menjadi sekitar 3 sampai 5 menit per kandidat. Pengurangan waktu telaah manual ini sekaligus menghemat sekitar 10 hingga 15 jam kerja per minggu bagi tim *Tech Lead* atau *Senior Engineer* yang sebelumnya harus memeriksa portofolio teknis secara manual. Selain mempercepat siklus seleksi (*time-to-hire*), validasi berbasis bukti kode nyata ini secara signifikan meminimalkan risiko salah rekrut (*bad hire*) yang kerap dipicu oleh klaim berlebih pada resume pelamar.

---

## 7. Batasan Sistem dan Mitigasi Risiko
1. **Akses Terbatas pada Repositori Publik**
   - *Batasan*: AI Agent hanya dapat memeriksa repositori GitHub yang disetel publik; proyek pada repositori privat tidak dapat diakses demi menjaga privasi dan kerahasiaan kandidat.
   - *Mitigasi*: Kandidat disarankan menyematkan (*pinned*) proyek publik terbaiknya. Agen menandai keahlian yang belum memiliki bukti publik dengan status "Perlu Konfirmasi" agar tim HRD dapat mengklarifikasikannya langsung saat sesi wawancara.
2. **Potensi Salah Tafsir AI (*False Negative*)**
   - *Batasan*: Model AI berpotensi mengalami salah interpretasi (*false negative*) saat membandingkan istilah teknis di CV dengan gaya penulisan kode di repositori.
   - *Mitigasi*: Sistem menerapkan prinsip *Human-in-the-Loop* di mana AI hanya bertindak sebagai asisten pemberi rekomendasi awal, bukan penentu kelulusan mutlak. Dilengkapi proses verifikasi bukti bertahap dan ruang tanya-jawab interaktif agar rekruter dapat menguji ulang temuan agen sebelum mengambil keputusan.
3. **Dokumen CV Berbasis Gambar atau Hasil Pindai (*Scan*)**
   - *Batasan*: Berkas CV yang berupa gambar murni atau hasil scan tanpa lapisan teks digital sulit diekstraksi secara akurat oleh sistem parser dokumen.
   - *Mitigasi*: Sistem memprioritaskan dokumen PDF berbasis teks digital standar dan memberikan notifikasi peringatan jika teks berkas tidak terbaca, sehingga HRD dapat meminta pelamar mengirimkan dokumen berformat teks standar.

---

## 8. Tangkapan Layar Antarmuka dan Interaksi AI Agent
Antarmuka pengguna TalentTrace AI dirancang dengan tata letak satu layar terintegrasi (*workspace*) yang memudahkan pengguna non-teknis memahami hasil audit kode secara visual:

1. **Halaman Masukan Berkas (Ingestion)**: Halaman awal tempat rekruter mengunggah berkas CV pelamar (PDF) dan memasukkan tautan akun GitHub untuk memulai proses audit otomatis.
2. **Matriks Kesesuaian Kualifikasi (Fact Matrix Tab)**: Menampilkan tabel komparasi antara klaim keahlian pada resume dengan temuan nyata di repositori GitHub, lengkap dengan badge status verifikasi (Terverifikasi, Parsial, atau Belum Terverifikasi).
3. **Penjelajah Pohon Berkas Kode (Repo Tree Explorer)**: Panel sisi kanan yang menampilkan hierarki direktori proyek kandidat (1 repositori = 1 folder root independen), memungkinkan pengguna memeriksa susunan berkas tanpa berpindah aplikasi.
4. **Ruang Diskusi Interaktif (Deliberation Workspace)**: Kolom obrolan tempat rekruter dapat menanyakan keraguan teknis seputar portofolio kandidat ke asisten AI dan memperoleh jawaban berbasis bukti nyata.
5. **Aksi Terintegrasi (Google Integration)**: Tombol tindakan langsung untuk menyusun jadwal wawancara teknis di Google Calendar dan draf email *feedback* yang membangun bagi pelamar.

---

## 9. Rencana Pengembangan Lanjutan (*Future Development*)
Ke depan, pengembangan TalentTrace AI diarahkan pada perluasan ekosistem dan penguatan kedaulatan data. Dari sisi sumber portofolio, sistem akan dikembangkan agar mendukung repositori multiplatform di luar GitHub, seperti GitLab, Bitbucket, hingga *self-hosted Git* internal perusahaan. Selain itu, arsitektur model AI akan diperluas agar mendukung penggunaan model bahasa lokal (*open-source* / *on-premise LLM* seperti Llama atau Qwen). Fleksibilitas ini memungkinkan perusahaan dengan standar kepatuhan privasi yang ketat, seperti sektor perbankan dan industri finansial, menjalankan seluruh proses verifikasi kandidat di server lokal tanpa ketergantungan pada API komersial pihak ketiga.

Dari sisi operasional perusahaan, sistem direncanakan terhubung langsung dengan sistem internal HRIS (*Human Resource Information System*) dan platform rekrutmen perusahaan melalui REST API dan *webhook*, sehingga status seleksi kandidat dapat tersinkronisasi secara otomatis dengan alur kerja internal. Rencana pengembangan ini juga mencakup penyediaan lingkungan uji terisolasi (*sandbox container*) untuk menguji apakah proyek kandidat benar-benar dapat dijalankan (*runnable*), serta memperluas cakupan analisis ke ranah teknis lainnya seperti *Data Science* (verifikasi notebook Jupyter dan riwayat proyek analisis data) serta *DevOps* (pemeriksaan berkas konfigurasi *container* dan *pipeline CI/CD*).
