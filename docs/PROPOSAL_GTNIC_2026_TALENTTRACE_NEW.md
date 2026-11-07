# Proposal GTNIC 2026: TalentTrace AI
**Sub-Tema**: Building Intelligent AI Agents for Enterprise Productivity  
**Kategori**: AI Agents (Enterprise & Industry)  

---

## 1. Judul Karya
**Pengembangan Sistem AI Agent Berbasis Multi-Tool Calling untuk Otomatisasi Validasi Klaim CV dan Audit Portofolio GitHub Calon Software Engineer**

---

## 2. Latar Belakang Masalah
Industri teknologi informasi saat ini bergerak sangat dinamis dengan minat karier rekayasa perangkat lunak (*software engineering*) yang terus melonjak tinggi. Setiap kali sebuah lowongan pekerjaan dibuka, tim perekrut menerima puluhan hingga ratusan berkas lamaran hanya dalam hitungan hari. Di balik antusiasme pelamar yang masif tersebut, muncul tantangan operasional yang nyata bagi tim *Human Resources Department* (HRD) dan *Talent Acquisition*, terutama dalam menyaring kandidat secara adil, objektif, dan efisien.

Persoalan utama bermula dari fenomena klaim berlebih pada dokumen riwayat hidup (*resume inflation*). Di era keterbukaan informasi saat ini, sangat mudah bagi pelamar untuk mencantumkan deretan penguasaan bahasa pemrograman dan kerangka kerja mutakhir pada CV mereka. Namun, realitas di lapangan menunjukkan bahwa banyak dari proyek yang dicantumkan sekadar hasil menyalin tutorial daring selangkah demi selangkah (*tutorial-based projects*) atau kloning repositori publik tanpa pemahaman logika kode yang mendalam. Keterbatasan latar belakang teknis koding sering kali menempatkan staf rekruter pada posisi dilematis: mereka kesulitan membedakan kandidat yang benar-benar memiliki jam terbang koding nyata dengan kandidat yang sekadar mahir merangkai kata di atas kertas.

Kondisi tersebut pada akhirnya memaksa perusahaan melibatkan *Tech Lead* atau *Senior Engineer* sejak tahap skrining paling awal, hanya untuk membuka satu per satu akun GitHub pelamar dan memeriksa keaslian kodenya. Praktik manual ini menimbulkan pemborosan jam kerja produktif yang sangat berharga (*high opportunity cost*), di mana insinyur senior yang seharusnya fokus pada pengembangan produk justru tersita waktunya untuk pekerjaan administratif berulang. Di sisi lain, sistem penyaring otomatis konvensional (*Applicant Tracking System* / ATS) yang banyak beredar saat ini hanya bekerja sebatas mencocokkan kata kunci (*keyword matching*), sehingga mudah dimanipulasi dan tidak mampu membaca substansi kualitas kode.

Berangkat dari keresahan tersebut, kami menginisiasi **TalentTrace AI**. Alih-alih sekadar membaca teks CV secara pasif, sistem ini hadir sebagai asisten cerdas berbasis *AI Agent* otonom yang mampu melakukan penyelidikan kode secara langsung ke repositori GitHub kandidat, menelusuri riwayat komit asli, memverifikasi kesesuaian klaim keahlian berbasis bukti nyata (*grounding verification*), serta menyajikan ringkasan hasil audit yang mudah dipahami oleh rekruter non-teknis. Inovasi ini menjembatani jurang pemisah antara bahasa teknis rekayasa perangkat lunak dengan kebutuhan praktis operasional tim rekruter di dunia industri.

---

## 3. Tujuan, Manfaat, dan Solusi

### 3.1 Tujuan
1. Mengotomatisasi penelusuran dan audit portofolio kode GitHub kandidat secara mendalam untuk memvalidasi klaim keahlian pada berkas CV.
2. Memangkas durasi seleksi berkas awal (*initial screening*) dari hitungan hari kerja menjadi beberapa menit saja tanpa mengorbankan akurasi penilaian.
3. Memberikan asisten dialogis yang ramah dan interaktif bagi rekruter non-teknis agar dapat memahami rekam jejak koding kandidat tanpa rasa canggung terhadap istilah teknis yang rumit.
4. Menghubungkan alur telaah portofolio dengan tindakan operasional nyata, seperti penjadwalan wawancara dan pengiriman umpan balik secara terpadu.

### 3.2 Manfaat
1. **Efisiensi Waktu dan Produktivitas Tim HRD**: Tim rekruter tidak lagi terbebani membuka tab repositori dan memeriksa ratusan berkas secara manual satu per satu. Ringkasan kualifikasi kandidat tersaji instan, mempercepat siklus penarikan talenta (*time-to-hire*).
2. **Pengembalian Fokus Kerja Tim Engineering**: Membebaskan *Tech Lead* dan *Senior Engineer* dari beban telaah awal portofolio, sehingga waktu mereka tetap terfokus pada arsitektur sistem dan *sprint* pengembangan produk perusahaan.
3. **Penyaringan Berbasis Bukti Nyata (*Evidence-Based Screening*)**: Memastikan keputusan seleksi didasarkan pada rekam jejak kontribusi kode asli, meminimalkan risiko salah rekrut (*bad hire*) akibat klaim CV yang dilebih-lebihkan.
4. **Penerjemah Teknis Interaktif untuk Rekruter**: Rekruter dapat berkonsultasi langsung dengan asisten cerdas mengenai proyek kandidat menggunakan bahasa sehari-hari yang lugas, memperoleh penjelasan analogis tanpa harus menghafal istilah teknis yang rumit.
5. **Transisi Koordinasi yang Mulus**: Hasil audit yang terstruktur rapi beserta rekomendasi pertanyaan wawancara dapat langsung diteruskan ke tim penguji teknis, menciptakan alur rekrutmen yang terstandarisasi.

### 3.3 Solusi Otomatisasi
TalentTrace AI mengusung solusi berbasis agen cerdas mandiri (*autonomous AI Agent*) yang menggabungkan model bahasa besar (*Large Language Model*) dengan serangkaian perkakas analisis khusus (*specialized tools*). Agen tidak memperlakukan CV sebagai dokumen teks semata, melainkan sebagai hipotesis kualifikasi yang harus diverifikasi langsung ke sumber koding pelamar. 

Sistem secara aktif membaca berkas CV, mengakses akun GitHub pelamar, menyeleksi proyek paling relevan, membedah struktur repositori, hingga memeriksa riwayat komit nyata. Melalui pencocokan data silang (*grounding*), agen menghasilkan matriks kesesuaian yang transparan. Untuk menutup alur kerja secara tuntas (*end-to-end*), sistem terintegrasi langsung dengan ekosistem Google Workspace (Google Calendar untuk penjadwalan wawancara teknis dan Gmail untuk pengiriman draf korespondensi tindak lanjut), seluruhnya dalam satu antarmuka kerja tunggal.

---

## 4. Target Perusahaan dan Pengguna Industri
TalentTrace AI ditujukan secara spesifik untuk:
1. **Tim Human Resources & Talent Acquisition**: Staf perekrut di industri teknologi yang membutuhkan instrumen objektif dan mudah digunakan untuk menyaring pelamar teknis.
2. **Startup Digital & Perusahaan Skala Menengah (*Scale-up*)**: Perusahaan dengan tim rekruter ramping namun memiliki frekuensi perekrutan insinyur perangkat lunak yang intensif.
3. **Agensi Perekrutan Tenaga Kerja TI (*Tech Recruitment Agency*)**: Konsultan perekrutan independen yang membutuhkan validasi portofolio cepat dan akurat sebelum menyalurkan kandidat ke perusahaan mitra.

---

## 5. Arsitektur Sistem AI
TalentTrace AI dirancang dengan paradigma agen otonom berbasis *multi-tool calling*. Alur kerja sistem tidak linier kaku, melainkan digerakkan oleh *reasoning engine* yang menentukan pemanggilan alat (*tool*) sesuai kebutuhan data yang ditemukan.

Arsitektur sistem tersusun atas empat tahapan utama:
1. **Asupan Berkas dan Ekstraksi Dokumen (*Ingestion & Parsing*)**: Pengguna mengunggah berkas CV pelamar (format PDF) dan memasukkan tautan profil GitHub. Modul `cv_parser` mengekstrak informasi profil, riwayat pengalaman kerja, serta daftar klaim keahlian teknis (*tech stack*).
2. **Triase dan Penyelidikan Repositori (*GitHub Triage & Audit*)**:
   - Modul `github_triage` menelusuri repositori publik kandidat dan memilah repositori mana yang paling relevan dengan posisi yang dilamar (misal: membedakan proyek riil dari sekadar repositori tugas kuliah dasar).
   - Modul `github_repo_audit` menginspeksi repositori terpilih: mengunduh struktur pohon direktori (*repo tree*), membaca berkas konfigurasi dependensi (seperti `package.json`, `go.mod`, atau `requirements.txt`), serta meneliti riwayat komit untuk memastikan apakah kandidat benar-benar menulis kode tersebut secara berkala.
3. **Verifikasi Bukti Nyata (*Grounding Verification Engine*)**: Model AI membandingkan temuan kode dengan butir klaim di CV. Klaim diberi label status berbasis bukti (*Terverifikasi*, *Parsial*, atau *Belum Terverifikasi*). Proses ini mencegah timbulnya halusinasi AI karena setiap simpulan diwajibkan menyertakan rujukan berkas kode yang nyata.
4. **Penyimpanan Lokal Persisten & Caching Dua Tingkat**: Sistem didukung basis data lokal SQLite dengan konfigurasi *Write-Ahead Logging* (WAL). Seluruh respons audit dan metadata repositori disimpan pada sistem *caching* dua tingkat (memori RAM untuk akses aktif dan penyimpanan lokal untuk retensi sesi). Pendekatan ini menjamin kedaulatan data internal perusahaan, kecepatan akses instan, serta menghemat kuota panggilan API GitHub.
5. **Antarmuka Interaksi dan Eksekusi Terintegrasi**: Pengguna dapat menelaah hasil temuan lewat antarmuka visual satu layar, mengeksplorasi hierarki direktori kode, berdiskusi interaktif dengan agen, dan mengeksekusi integrasi Google Calendar serta Gmail.

---

## 6. Fitur Utama AI Agent dan Estimasi Efisiensi Operasional

### 6.1 Fitur Utama
1. **Matriks Kesesuaian Kualifikasi (*Fact Matrix Tab*)**: Tabel ringkas yang membandingkan klaim resume dengan bukti nyata di repositori GitHub, lengkap dengan lencana status verifikasi transparan dan cuplikan referensi berkas kode pendukung.
2. **Penjelajah Pohon Berkas Repositori (*Repo Tree Explorer*)**: Panel interaktif untuk meninjau susunan folder dan berkas proyek kandidat secara visual, memberikan kenyamanan memeriksa hierarki proyek tanpa perlu membuka peramban baru ke halaman GitHub.
3. **Ruang Diskusi Interaktif (*Deliberation Workspace*)**: Fitur percakapan cerdas di mana rekruter dapat mengajukan pertanyaan teknis menggunakan gaya bahasa sehari-hari. Agen merespons dengan bahasa yang mudah dipahami sembari mengacu pada data repositori pelamar, sekaligus memberikan rekomendasi pertanyaan teknis untuk sesi wawancara.
4. **Eksekusi Aksi Terintegrasi (*Google Workspace Action Engine*)**: Fitur otomatisasi satu klik untuk menyusun jadwal wawancara teknis di Google Calendar dan menyiapkan draf email umpan balik profesional bagi kandidat melalui integrasi Gmail.

### 6.2 Estimasi Efisiensi Operasional
1. **Akselerasi Waktu Skrining**: Memangkas waktu telaah awal portofolio dari rata-rata 3 hingga 5 hari kerja menjadi hanya 3 sampai 5 menit per kandidat.
2. **Penghematan Jam Kerja Rekayasa Perangkat Lunak**: Menghemat sekitar 10 hingga 15 jam kerja per minggu bagi *Tech Lead* atau *Senior Engineer*, mengembalikan fokus mereka pada penyelesaian *roadmap* teknologi inti.
3. **Pencegahan Biaya Salah Rekrut (*Bad Hire Avoidance*)**: Meminimalisir lolosnya kandidat yang mengandalkan portofolio tiruan atau klaim resume semu, menyelamatkan perusahaan dari pemborosan biaya pelatihan dan kompensasi dini.

---

## 7. Batasan Sistem dan Mitigasi Risiko

1. **Akses Terbatas pada Repositori Publik**
   - *Batasan*: Sistem secara etis dan teknis hanya mengakses repositori publik kandidat di GitHub demi menghormati privasi dan perjanjian kerahasiaan (*Non-Disclosure Agreement* / NDA) proyek masa lalu kandidat.
   - *Mitigasi*: Kandidat dianjurkan menyematkan (*pinned*) proyek publik terbaik mereka. Untuk keahlian yang belum memiliki bukti di repositori publik, agen menandainya dengan status "Perlu Konfirmasi" agar dapat divalidasi langsung oleh pewawancara teknis.
2. **Pencegahan Salah Tafsir AI (*False Negative*)**
   - *Batasan*: Keragaman gaya penulisan kode atau penggunaan istilah teknologi yang tidak baku berpotensi menimbulkan interpretasi yang kurang tepat oleh model AI.
   - *Mitigasi*: Sistem menerapkan prinsip *Human-in-the-Loop*. AI Agent diposisikan sebagai pemberi rekomendasi awal berbasis data, bukan penentu kelulusan tunggal. Rekruter dibekali ruang diskusi interaktif untuk menguji ulang pertimbangan agen sebelum mengambil keputusan akhir.
3. **Kualitas Berkas CV yang Bervariasi**
   - *Batasan*: Berkas lamaran berupa hasil pindai (*scanned PDF*) atau format gambar murni tanpa lapisan teks digital berisiko mengalami kendala ekstraksi karakter.
   - *Mitigasi*: Sistem menerapkan validasi awal terhadap struktur berkas PDF dan memberikan notifikasi ramah kepada rekruter jika berkas yang diunggah tidak memiliki lapisan teks yang dapat dibaca, sehingga dapat segera dimintakan versi teks digital standar.

---

## 8. Tangkapan Layar Antarmuka dan Interaksi AI Agent
Antarmuka TalentTrace AI dirancang dengan filosofi *single-screen workspace* yang bersih, minim distraksi, dan memudahkan penelusuran data secara visual:

1. **Halaman Masukan Berkas (*Ingestion Screen*)**: Panel awal tempat pengguna mengunggah dokumen CV pelamar dan menyematkan tautan profil GitHub untuk memulai proses audit otomatis.
2. **Panel Matriks Kesesuaian (*Fact Matrix View*)**: Visualisasi komparatif antara poin-poin keahlian pelamar dengan temuan riil di repositori kode, dilengkapi indikator verifikasi warna-warni yang intuitif.
3. **Panel Pohon Berkas (*Repo Tree View*)**: Navigasi struktur direktori proyek kandidat di sisi kanan layar, memudahkan pengguna menelaah kerapian arsitektur proyek pelamar layaknya menggunakan penjelajah berkas modern.
4. **Ruang Tanya Jawab AI (*Deliberation Chat*)**: Kolom obrolan konsultatif tempat rekruter mengajukan keraguan seputar portofolio pelamar dan mendapatkan klarifikasi teknis yang gamblang.
5. **Panel Integrasi Aksi (*Action Bar*)**: Deretan tombol tindakan cepat untuk langsung menjadwalkan wawancara di kalender atau mengirimkan draf email tanpa harus berpindah aplikasi.

---

## 9. Rencana Pengembangan Lanjutan (*Future Roadmap*)
Sebagai karya yang lahir dari semangat eksplorasi mahasiswa, TalentTrace AI dirancang dengan visi keberlanjutan yang siap dikembangkan lebih jauh:

1. **Ekspansi Multiplatform Repositori**: Menghubungkan agen dengan ekosistem pelacak kode lainnya seperti GitLab, Bitbucket, dan instalasi Git internal perusahaan (*self-hosted Git*).
2. **Dukungan Model AI Lokal (*On-Premise / Local LLM*)**: Memungkinkan integrasi dengan model bahasa terbuka (*open-source* seperti Llama atau Qwen) yang dapat dijalankan pada infrastruktur server lokal perusahaan. Opsi ini memberikan fleksibilitas tinggi bagi sektor dengan kepatuhan data ketat, seperti perbankan dan industri finansial, agar data kandidat tidak keluar dari jaringan internal.
3. **Integrasi Ekosistem HRIS Perusahaan**: Menyediakan antarmuka pemrograman aplikasi (REST API) dan *webhook* agar TalentTrace AI dapat terhubung langsung dengan perangkat lunak HRIS korporat, menyinkronkan status pelamar secara otomatis.
4. **Lingkungan Pengujian Kode Terisolasi (*Sandbox Code Runner*)**: Mengembangkan modul kontainer terisolasi untuk menguji apakah proyek kandidat benar-benar dapat dikompilasi dan dijalankan (*runnable*), serta mengevaluasi kebersihan pengujian unit (*unit test coverage*).
5. **Perluasan Domain Spesialisasi**: Menambahkan keahlian audit untuk bidang teknis lainnya, seperti analisis *notebook* data pada posisi *Data Science* serta berkas konfigurasi *pipeline* CI/CD untuk posisi *DevOps Engineer*.
