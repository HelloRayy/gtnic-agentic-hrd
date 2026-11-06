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

## 5. Batasan Sistem dan Mitigasi Risiko
1. **Akses Terbatas pada Repositori Publik**
   - *Batasan*: AI Agent hanya dapat memeriksa repositori GitHub yang disetel publik; proyek pada repositori privat tidak dapat diakses demi menjaga privasi dan kerahasiaan kandidat.
   - *Mitigasi*: Kandidat disarankan menyematkan (*pinned*) proyek publik terbaiknya. Agen menandai keahlian yang belum memiliki bukti publik dengan status "Perlu Konfirmasi" agar tim HRD dapat mengklarifikasikannya langsung saat sesi wawancara.
2. **Potensi Salah Tafsir AI (*False Negative*)**
   - *Batasan*: Model AI berpotensi mengalami salah interpretasi (*false negative*) saat membandingkan istilah teknis di CV dengan gaya penulisan kode di repositori.
   - *Mitigasi*: Sistem menerapkan prinsip *Human-in-the-Loop* di mana AI hanya bertindak sebagai asisten pemberi rekomendasi awal, bukan penentu kelulusan mutlak. Dilengkapi proses verifikasi bukti bertahap dan ruang tanya-jawab interaktif agar rekruter dapat menguji ulang temuan agen sebelum mengambil keputusan.
3. **Dokumen CV Berbasis Gambar atau Hasil Pindai (*Scan*)**
   - *Batasan*: Berkas CV yang berupa gambar murni atau hasil scan tanpa lapisan teks digital sulit diekstraksi secara akurat oleh sistem parser dokumen.
   - *Mitigasi*: Sistem memprioritaskan dokumen PDF berbasis teks digital standar dan memberikan notifikasi peringatan jika teks berkas tidak terbaca, sehingga HRD dapat meminta pelamar mengirimkan dokumen berformat teks standar.
