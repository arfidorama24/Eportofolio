/* ============================================================
   E-Portfolio Arfido — Data Store
   Menyimpan seluruh konten portofolio di localStorage.
   ============================================================ */
(function () {
  "use strict";

  const STORAGE_KEY = "eportfolio:arfido:v1";
  const DEFAULT_PASSCODE = "arfido2026";

  const DEFAULT_DATA = {
    meta: {
      version: 1,
      owner: "Arfido Ramadhani",
      updatedAt: null
    },

    profile: {
      name: "Arfido Ramadhani, S.Kom",
      shortName: "Arfido",
      initials: "AR",
      role: "Calon Guru Informatika",
      campus: "Universitas Muhammadiyah Surakarta",
      program: "Pendidikan Profesi Guru (PPG) — Informatika",
      address: "RT 01 / RW 02, Dsn. Lanjan, Ds. Lanjan, Kec. Sumowono, Kab. Semarang, Jawa Tengah",
      origin: "Lanjan, Sumowono, Kab. Semarang",
      email: "arfidoramadhani@gmail.com",
      phone: "",
      badge: "E-Portfolio PPG Informatika · UMS",
      heroLine1: "Arfido",
      heroLine2: "Ramadhani",
      heroKicker: "Mengajar dengan logika, mendidik dengan hati.",
      tagline:
        "Calon guru Informatika yang percaya bahwa teknologi terbaik adalah teknologi yang membuat manusia lebih manusiawi. Berakar dari desa di kaki Gunung Ungaran, tumbuh untuk membuka akses belajar bagi semua.",
      photo: null,
      pillars: ["Profesional", "Berintegritas", "Adaptif"],
      stats: [
        { value: "4", label: "Siklus Praktik" },
        { value: "4", label: "Modul Ajar" },
        { value: "4", label: "Video Mengajar" },
        { value: "3", label: "Pilar Visi" }
      ],
      story: {
        title: "Berakar di Lanjan, tumbuh untuk mengajar",
        origin:
          "Nama saya Arfido Ramadhani. Saya lahir dan tumbuh di Lanjan, sebuah desa di Kecamatan Sumowono, Kabupaten Semarang, yang berada di dataran tinggi kaki Gunung Ungaran. Udara yang sejuk, hamparan sawah bertingkat, dan kebun sayur yang menghijau adalah pemandangan sehari-hari yang membentuk cara saya melihat dunia.\n\nLanjan bukan hanya alamat pada kartu identitas. Dari sana saya belajar bahwa kerja keras tidak selalu berisik: ia hadir dalam langkah petani sebelum matahari terbit, dalam dagangan yang diangkut ke pasar, dan dalam gotong royong warga ketika ada hajatan atau musibah. Nilai-nilai itu yang kemudian saya bawa ke ruang kelas.\n\nJarak dari desa ke kota mengajarkan saya satu hal: akses terhadap pendidikan dan teknologi tidak pernah merata. Justru dari ketimpangan itulah saya menemukan alasan untuk menjadi guru, agar anak-anak dari kampung seperti saya tidak hanya menjadi pengguna teknologi, tetapi juga penciptanya.",
        uniqueness: [
          {
            icon: "mountain",
            title: "Sejuknya Kaki Ungaran",
            text: "Lanjan berada di dataran tinggi dengan pagi yang berkabut dan tanah yang subur. Lingkungan ini mengajarkan saya bahwa pertumbuhan selalu membutuhkan proses, tidak ada yang instan."
          },
          {
            icon: "users",
            title: "Gotong Royong yang Hidup",
            text: "Warga Lanjan terbiasa saling membantu tanpa diminta. Dari kebiasaan itu saya belajar bahwa kelas yang baik juga dibangun dengan kolaborasi, bukan kompetisi semata."
          },
          {
            icon: "leaf",
            title: "Tradisi Bertani",
            text: "Kebun sayur dan kopi adalah napas ekonomi desa. Saya tumbuh memahami bahwa pengetahuan harus berguna, kontekstual, dan mampu menjawab persoalan nyata di sekitar."
          }
        ],
        inspiration:
          "Ketertarikan saya pada dunia mengajar dimulai dari seorang guru TIK di SMA. Saat itu komputer bagi saya adalah benda asing yang hanya muncul di lab sekolah. Guru tersebut tidak hanya mengajarkan menu dan tombol, tetapi menunjukkan bahwa di balik layar ada logika, kreativitas, dan kesempatan untuk menciptakan sesuatu. Ia sabar, tidak pernah meremehkan pertanyaan sederhana, dan selalu membuka lab setelah jam pelajaran. Dari beliau saya belajar bahwa guru yang baik bukan yang paling banyak tahu, melainkan yang paling membuat muridnya berani mencoba.\n\nPengalaman itu bertemu dengan latar belakang saya di bidang komputer. Saya menyadari bahwa banyak anak di daerah saya memiliki rasa ingin tahu yang besar, tetapi terbatas akses dan pendampingnya. Di titik itu saya memutuskan bahwa menjadi guru Informatika adalah cara paling bermakna untuk menggabungkan keahlian dan kepedulian.",
        purpose:
          "Tujuan saya menjadi guru profesional adalah menghadirkan pembelajaran Informatika yang bermakna, inklusif, dan kontekstual, terutama bagi peserta didik yang selama ini merasa teknologi bukan untuk mereka. Saya ingin memastikan bahwa kelas Informatika bukan sekadar tempat menghafal istilah, tetapi ruang untuk berpikir kritis, bekerja sama, dan menciptakan solusi.\n\nDalam jangka panjang, saya ingin menjadi guru yang terus belajar, mampu merancang pembelajaran yang berpihak pada murid, serta berkontribusi pada pengembangan literasi digital di sekolah dan masyarakat. Saya percaya profesi guru bukan tujuan akhir, melainkan perjalanan panjang untuk terus memperbaiki diri.",
        visionTitle: "Visi saya",
        vision:
          "Mewujudkan guru yang profesional, berintegritas, dan adaptif: profesional dalam merancang dan mengevaluasi pembelajaran, berintegritas dalam menjaga amanah sebagai pendidik, serta adaptif dalam merespons perkembangan teknologi dan kebutuhan peserta didik.",
        quote:
          "Mengajar informatika bukan mengajarkan cara memakai mesin, melainkan cara berpikir agar manusia tetap menjadi pengendali mesin.",
        quoteAuthor: "Arfido Ramadhani"
      }
    },

    lessons: [
      {
        id: "les-siklus-1",
        cycle: 1,
        title: "Berpikir Komputasional: Algoritma di Sekitar Kita",
        subject: "Informatika",
        grade: "Kelas X · Fase E",
        allocation: "2 × 45 menit",
        summary:
          "Modul ajar terbaik siklus 1 yang merancang pembelajaran algoritma secara konkret melalui aktivitas unplugged, kartu langkah, dan diagram alur, sebelum peserta didik menyentuh komputer.",
        cp:
          "Pada akhir Fase E, peserta didik mampu menerapkan praktik informatika untuk menyelesaikan persoalan sehari-hari, termasuk menggunakan konsep berpikir komputasional untuk merancang algoritma sederhana secara logis, sistematis, dan kreatif.",
        tp:
          "Menjelaskan konsep algoritma dan berpikir komputasional dalam konteks kehidupan sehari-hari.\nMenguraikan persoalan menjadi langkah-langkah yang runtut (decomposition).\nMenyusun algoritma sederhana dan menyajikannya dalam bentuk diagram alur.\nMengevaluasi efisiensi dua algoritma berbeda untuk persoalan yang sama.",
        steps:
          "Pendahuluan (10 menit): apersepsi melalui teka-teki rutinitas pagi dan pertanyaan pemandu.\nPemantik (10 menit): peserta didik mengurutkan kartu langkah membuat minuman secara berkelompok.\nDiskusi konsep (15 menit): guru memandu penemuan konsep decomposition, pattern, abstraction, dan algorithm.\nKerja kelompok (30 menit): kelompok menyusun algoritma perjalanan dari rumah ke sekolah dan menyajikannya sebagai flowchart.\nPresentasi dan evaluasi (20 menit): galeri berjalan, umpan balik antarkelompok, dan perbandingan efisiensi algoritma.\nPenutup (5 menit): exit ticket dan refleksi metakognitif.",
        analysis:
          "Konteks dan tantangan. Pembelajaran algoritma sering menjadi titik ketika peserta didik kehilangan minat karena konsepnya terasa abstrak. Peserta didik kelas X umumnya sudah terbiasa mengoperasikan gawai, tetapi belum terbiasa memecah persoalan menjadi langkah-langkah yang runtut. Pada asesmen awal, sebagian besar peserta didik mampu menyebutkan contoh penggunaan teknologi, namun kesulitan ketika diminta menuliskan urutan langkah secara logis dan lengkap. Kondisi ini menuntut rancangan yang tidak langsung berhadapan dengan kode, melainkan membangun pengalaman berpikir terlebih dahulu.\n\nKeputusan desain pembelajaran. Saya memilih Problem Based Learning dengan pendekatan unplugged pada tahap awal. Peserta didik diberi persoalan kontekstual, yaitu menyusun rute perjalanan dari rumah ke sekolah, lalu memecahnya menjadi langkah-langkah yang dapat diikuti orang lain. Aktivitas mengurutkan kartu langkah membuat konsep algoritma dapat disentuh sebelum dijelaskan secara formal. Diagram alur digunakan sebagai representasi visual agar peserta didik melihat hubungan antara keputusan, pengulangan, dan urutan. Komputer baru diperkenalkan pada tahap penguatan, bukan sebagai titik awal.\n\nPeran guru dan scaffolding. Dalam rancangan ini guru berperan sebagai fasilitator yang mengajukan pertanyaan pemandu, bukan pemberi jawaban. Saya menyiapkan tiga tingkat pertanyaan: pertanyaan klarifikasi untuk kelompok yang masih bingung, pertanyaan konflik kognitif untuk kelompok yang sudah selesai, dan pertanyaan refleksi untuk seluruh kelas. Miskonsepsi yang paling sering muncul adalah anggapan bahwa algoritma harus rumit. Saya sengaja menampilkan contoh algoritma sederhana dari rutinitas pagi untuk mematahkan anggapan tersebut.\n\nDiferensiasi dan kebutuhan peserta didik. Rancangan ini mengakomodasi peserta didik dengan gaya belajar berbeda. Peserta didik visual memperoleh kartu bergambar dan contoh flowchart, peserta didik kinestetik terlibat langsung dalam menyusun kartu, sedangkan peserta didik yang lebih cepat memperoleh tantangan tambahan berupa membandingkan dua algoritma dengan jumlah langkah berbeda. Pembagian kelompok dibuat heterogen agar peserta didik yang lebih percaya diri dapat menjadi teman belajar, tanpa menghilangkan tanggung jawab individual melalui lembar kerja pribadi.\n\nAsesmen dan bukti belajar. Asesmen dilakukan secara formatif melalui observasi diskusi, exit ticket, dan lembar kerja, serta secara sumatif melalui produk flowchart dan presentasi kelompok. Rubrik mencakup empat aspek: ketepatan logika, kelengkapan langkah, kejelasan representasi, dan kemampuan menjelaskan. Saya tidak hanya menilai hasil akhir, tetapi juga proses ketika kelompok merevisi urutan langkah setelah mendapat umpan balik. Bukti belajar yang paling meyakinkan muncul ketika peserta didik mampu menjelaskan mengapa satu urutan lebih efisien daripada urutan lainnya.\n\nRefleksi dan perbaikan. Kekuatan rancangan ini terletak pada pengalaman konkret yang membuat konsep abstrak menjadi mudah dibicarakan. Namun, saya menemukan dua kelemahan: instruksi awal terlalu panjang sehingga waktu kerja kelompok berkurang, dan beberapa peserta didik pasif karena dominasi anggota lain. Temuan ini menjadi dasar perbaikan pada siklus 2, yaitu menyederhanakan instruksi menjadi tiga poin, menggunakan timer yang terlihat, dan menetapkan peran bergilir dalam kelompok.",
        tags: ["Problem Based Learning", "Unplugged", "Computational Thinking", "Kurikulum Merdeka"],
        cover: null,
        driveUrl: "",
        featured: true,
        updatedAt: null
      },
      {
        id: "les-siklus-2",
        cycle: 2,
        title: "Jaringan Komputer: Membangun Koneksi yang Aman",
        subject: "Informatika",
        grade: "Kelas X · Fase E",
        allocation: "2 × 45 menit",
        summary:
          "Rancangan siklus 2 yang menerjemahkan konsep jaringan yang abstrak menjadi pengalaman konkret melalui analogi sistem pos, simulasi topologi, dan studi kasus keamanan jaringan sekolah.",
        cp:
          "Pada akhir Fase E, peserta didik mampu menerapkan konektivitas jaringan lokal dan internet, menjelaskan cara kerja jaringan, serta mengidentifikasi risiko keamanan sederhana dan langkah pencegahannya.",
        tp:
          "Menjelaskan fungsi perangkat jaringan dan perbedaan jaringan lokal dengan internet.\nMenggambarkan topologi jaringan sederhana beserta alur pertukaran data.\nMengidentifikasi risiko keamanan pada jaringan sekolah dan cara mengurangi risiko tersebut.\nMempresentasikan rancangan jaringan aman untuk kebutuhan laboratorium komputer.",
        steps:
          "Pendahuluan (8 menit): apersepsi melalui pertanyaan tentang apa yang terjadi ketika internet terputus.\nPemantik (10 menit): analogi sistem pos untuk menjelaskan peran IP address, router, dan paket data.\nMini lesson (12 menit): penjelasan singkat topologi, perangkat, dan prinsip keamanan jaringan.\nSimulasi kelompok (30 menit): kelompok menyusun topologi laboratorium komputer menggunakan kartu perangkat dan tali sebagai representasi kabel.\nStudi kasus (20 menit): kelompok menganalisis skenario kebocoran data dan merancang tiga langkah pencegahan.\nPresentasi dan penutup (10 menit): galeri berjalan, penguatan konsep, dan exit ticket.",
        analysis:
          "Konteks dan tantangan. Materi jaringan komputer mengandung banyak istilah teknis yang mudah membuat peserta didik merasa jauh dari pengalaman sehari-hari. Berdasarkan refleksi siklus 1, saya menyadari bahwa instruksi panjang dan dominasi beberapa anggota kelompok menjadi hambatan utama. Karena itu, siklus 2 saya rancang dengan instruksi yang lebih ringkas, peran kelompok yang jelas, dan aktivitas yang menuntut keterlibatan semua anggota sejak menit pertama.\n\nKeputusan desain pembelajaran. Saya menggunakan analogi sistem pos untuk menjelaskan perjalanan paket data. Peserta didik memerankan pengirim, penerima, dan petugas pos yang mengarahkan paket berdasarkan alamat. Analogi ini dipilih karena menghubungkan konsep abstrak dengan pengalaman yang sudah dikenal, sehingga peserta didik dapat menjelaskan kembali konsep dengan bahasanya sendiri. Setelah analogi, kelompok menyusun topologi laboratorium menggunakan kartu perangkat dan tali, lalu menandai titik rawan keamanan pada topologi tersebut.\n\nPengelolaan kelas dan perbaikan dari siklus 1. Saya membagi kelompok menjadi empat peran: koordinator, pencatat, penyaji, dan penjaga waktu. Peran diputar pada pertemuan berikutnya agar tidak ada peserta didik yang selalu menjadi pemimpin atau selalu diam. Instruksi ditulis dalam tiga langkah singkat di papan tulis dan disertai contoh hasil akhir. Perubahan ini membuat waktu kerja kelompok lebih efektif dan meningkatkan jumlah peserta didik yang berbicara dalam diskusi.\n\nDiferensiasi dan akses belajar. Peserta didik yang membutuhkan dukungan memperoleh kartu istilah bergambar dan template topologi yang sudah separuh terisi. Peserta didik yang telah menguasai konsep memperoleh tantangan untuk menghitung dampak satu perangkat yang gagal terhadap koneksi lainnya. Saya juga menyediakan versi digital simulasi bagi peserta didik yang ingin mencoba di luar jam pelajaran, sehingga pembelajaran tidak berhenti di ruang kelas.\n\nAsesmen dan bukti belajar. Asesmen formatif dilakukan melalui observasi peran, pertanyaan pemandu, dan exit ticket yang meminta peserta didik menjelaskan satu risiko keamanan dengan bahasa sendiri. Asesmen sumatif berupa poster topologi dan rekomendasi keamanan. Rubrik menekankan ketepatan konsep, relevansi rekomendasi, kerja sama, dan kualitas komunikasi. Saya menambahkan penilaian diri dan penilaian antarteman untuk melihat kontribusi individual di dalam kerja kelompok.\n\nRefleksi dan perbaikan. Siklus 2 menunjukkan peningkatan yang signifikan dalam partisipasi dan pengelolaan waktu. Namun, saya masih perlu memperkuat tahap penguatan konsep karena beberapa peserta didik mampu membuat topologi tetapi belum dapat menjelaskan alasan pemilihan perangkat. Temuan ini saya bawa ke siklus 3 dengan menambahkan pertanyaan 'mengapa' pada setiap keputusan dan meminta peserta didik menuliskan justifikasi singkat.",
        tags: ["Analogi Kontekstual", "Kolaborasi", "Keamanan Jaringan", "Diferensiasi"],
        cover: null,
        driveUrl: "",
        featured: false,
        updatedAt: null
      },
      {
        id: "les-siklus-3",
        cycle: 3,
        title: "Analisis Data: Menemukan Cerita di Balik Angka",
        subject: "Informatika",
        grade: "Kelas X · Fase E",
        allocation: "3 × 45 menit",
        summary:
          "Rancangan siklus 3 yang mengajak peserta didik mengolah data nyata di sekitar sekolah dengan spreadsheet, lalu mengomunikasikannya sebagai data story yang etis dan jujur.",
        cp:
          "Pada akhir Fase E, peserta didik mampu mengumpulkan, mengolah, dan menyajikan data menggunakan aplikasi lembar kerja, serta menarik kesimpulan yang didukung bukti secara etis.",
        tp:
          "Mengumpulkan dan merapikan data sederhana dari lingkungan sekolah.\nMenggunakan rumus dasar spreadsheet untuk mengolah data.\nMembuat visualisasi data yang sesuai dengan jenis data dan pesan yang ingin disampaikan.\nMenyusun kesimpulan berbasis data serta menjelaskan batas dan etika penggunaan data.",
        steps:
          "Pendahuluan (10 menit): apersepsi melalui tebakan jumlah peserta didik yang membawa botol air minum.\nPemantik (15 menit): diskusi tentang data yang ada di sekolah dan pertanyaan yang ingin dijawab.\nMini lesson (20 menit): demonstrasi rumus dasar, pembersihan data, dan pemilihan grafik.\nProyek kelompok (45 menit): kelompok mengumpulkan data mini, mengolahnya, dan membuat satu visualisasi.\nKlinik data (20 menit): guru berkeliling memberikan umpan balik dan bantuan bertingkat.\nPresentasi data story (25 menit): setiap kelompok menyampaikan temuan, batas data, dan rekomendasi.\nPenutup (10 menit): refleksi etika data dan exit ticket.",
        analysis:
          "Konteks dan tantangan. Peserta didik hidup di tengah banjir data, tetapi belum tentu mampu membacanya secara kritis. Sebagian besar mengenal spreadsheet sebagai tabel, bukan sebagai alat berpikir. Tantangan utamanya bukan mengajarkan rumus, melainkan membangun kebiasaan bertanya: data apa yang dibutuhkan, apa yang ingin dijawab, dan sejauh mana kesimpulan boleh ditarik. Saya juga ingin peserta didik menyadari bahwa visualisasi dapat menyesatkan bila dibuat tanpa etika.\n\nKeputusan desain pembelajaran. Saya merancang proyek mini berbasis data sekolah, misalnya data waktu tempuh ke sekolah, jenis transportasi, atau konsumsi air minum. Peserta didik mengumpulkan data sendiri, membersihkannya, mengolah dengan rumus dasar, lalu membuat satu visualisasi yang menjawab pertanyaan kelompok. Pendekatan ini membuat pembelajaran bermakna karena data yang diolah adalah data mereka sendiri, bukan data fiktif dari buku.\n\nStruktur pembelajaran dan scaffolding. Siklus 3 menggunakan model pembelajaran berbasis proyek dengan klinik data. Saya menyiapkan tiga tingkat bantuan: panduan langkah tertulis, contoh rumus, dan tantangan pengayaan. Peserta didik yang cepat tidak diberi tugas tambahan yang menumpuk, melainkan diminta memperdalam analisis dengan membandingkan dua cara visualisasi dan menjelaskan mana yang lebih jujur. Peserta didik yang membutuhkan dukungan memperoleh template dan pendampingan langsung.\n\nDiferensiasi dan kolaborasi. Kelompok dibentuk berdasarkan hasil asesmen formatif siklus 2, dengan komposisi yang memungkinkan tutor sebaya. Setiap anggota memiliki peran yang jelas, tetapi semua wajib menuliskan satu temuan di lembar refleksi pribadi. Saya juga menyediakan jalur alternatif bagi peserta didik yang belum nyaman dengan spreadsheet: menggunakan tabel manual terlebih dahulu, lalu memindahkannya ke lembar kerja. Pendekatan ini menjaga rasa percaya diri tanpa menurunkan standar kompetensi.\n\nAsesmen dan bukti belajar. Penilaian dilakukan terhadap proses dan produk. Produk berupa satu halaman data story yang memuat pertanyaan, visualisasi, temuan, batas data, dan rekomendasi. Rubrik mencakup ketepatan pengolahan, kesesuaian grafik, kualitas interpretasi, etika data, serta kerja sama. Umpan balik diberikan di tengah proyek agar peserta didik memiliki kesempatan memperbaiki, bukan hanya menerima nilai di akhir.\n\nRefleksi dan perbaikan. Siklus 3 berhasil meningkatkan keterlibatan karena data yang digunakan dekat dengan kehidupan peserta didik. Saya melihat pertanyaan kritis muncul, misalnya tentang siapa yang tidak terwakili dalam data. Namun, waktu untuk presentasi masih terlalu singkat sehingga diskusi etika belum optimal. Perbaikan ini saya bawa ke siklus 4 dengan memilih kasus yang lebih terfokus dan menyiapkan struktur debat yang jelas.",
        tags: ["Project Based Learning", "Data Literacy", "Spreadsheet", "Etika Data"],
        cover: null,
        driveUrl: "",
        featured: false,
        updatedAt: null
      },
      {
        id: "les-siklus-4",
        cycle: 4,
        title: "Dampak Sosial Informatika: Etika dan Jejak Digital",
        subject: "Informatika",
        grade: "Kelas X · Fase E",
        allocation: "2 × 45 menit",
        summary:
          "Rancangan siklus 4 yang menempatkan peserta didik sebagai warga digital kritis melalui studi kasus, debat terstruktur, dan kampanye literasi digital yang dapat digunakan di sekolah.",
        cp:
          "Pada akhir Fase E, peserta didik mampu mengevaluasi dampak sosial informatika, termasuk isu privasi, jejak digital, dan penyebaran informasi, serta mengambil sikap yang bertanggung jawab.",
        tp:
          "Menganalisis kasus penyebaran informasi yang menyesatkan dan dampaknya bagi individu serta komunitas.\nMenjelaskan konsep jejak digital dan implikasinya bagi masa depan.\nMenyusun argumen etis berdasarkan bukti dan perspektif yang beragam.\nMerancang kampanye literasi digital sederhana untuk lingkungan sekolah.",
        steps:
          "Pendahuluan (8 menit): apersepsi melalui studi kasus singkat yang dekat dengan kehidupan peserta didik.\nOrientasi masalah (12 menit): kelompok membaca kasus dan mengidentifikasi pihak yang terdampak.\nDebat terstruktur (25 menit): dua kelompok mengambil posisi berbeda dengan aturan waktu dan bukti.\nRefleksi etika (15 menit): guru memandu analisis dampak jangka pendek dan panjang.\nKerja proyek (20 menit): kelompok merancang satu kampanye literasi digital.\nPresentasi dan komitmen (10 menit): galeri kampanye, umpan balik, dan penandatanganan komitmen digital.",
        analysis:
          "Konteks dan tantangan. Isu jejak digital, privasi, dan hoaks sangat dekat dengan kehidupan peserta didik, tetapi sering dibicarakan secara normatif dan menakut-nakuti. Pendekatan ceramah berisiko membuat peserta didik tahu aturannya tanpa memahami alasannya. Tantangan berikutnya adalah menjaga diskusi tetap aman karena kasus yang dibahas dapat menyentuh pengalaman pribadi. Saya perlu merancang ruang diskusi yang terbuka, tetapi tetap terlindungi.\n\nKeputusan desain pembelajaran. Saya memilih studi kasus fiktif yang realistik dan debat terstruktur. Peserta didik tidak diminta menghakimi individu, melainkan menganalisis rantai peristiwa, pihak yang terdampak, dan alternatif tindakan yang lebih bertanggung jawab. Debat digunakan untuk melatih pengambilan perspektif, dengan aturan bahwa setiap argumen harus disertai bukti atau contoh konkret. Sesi ditutup dengan komitmen digital yang ditulis dan ditandatangani peserta didik.\n\nIklim kelas dan keamanan psikologis. Sebelum diskusi, kelas menyepakati aturan: tidak menyebut nama, tidak membagikan tangkapan layar pribadi, dan menghormati perbedaan pengalaman. Saya menempatkan diri sebagai moderator, bukan hakim. Ketika ada peserta didik yang mulai menyerang pribadi, saya mengembalikan fokus pada tindakan dan dampaknya. Pendekatan ini membuat diskusi berjalan hangat tanpa kehilangan ketegasan etis.\n\nDiferensiasi dan peran peserta didik. Peserta didik dengan kemampuan verbal tinggi memperoleh peran sebagai juru bicara, sementara peserta didik yang lebih nyaman menulis menjadi penyusun argumen dan bukti. Semua peserta didik menuliskan refleksi pribadi agar penilaian tidak hanya bergantung pada suara yang paling lantang. Kelompok juga diberi pilihan format kampanye: poster, video pendek, atau unggahan media sosial edukatif.\n\nAsesmen dan bukti belajar. Asesmen mencakup kualitas argumen, kemampuan menggunakan bukti, sikap menghargai perbedaan, dan produk kampanye. Rubrik sikap menggunakan indikator yang dapat diamati, bukan sekadar kesan. Saya juga meminta peserta didik menilai sendiri perubahan pandangan mereka sebelum dan sesudah pembelajaran. Bukti belajar yang paling bermakna adalah ketika peserta didik mampu menyebutkan satu kebiasaan digital yang akan mereka ubah.\n\nRefleksi dan perbaikan. Siklus 4 menjadi penutup yang kuat karena peserta didik terlibat secara emosional dan intelektual. Saya belajar bahwa isu etika tidak cukup diajarkan melalui aturan, tetapi melalui latihan mengambil keputusan. Keterbatasan yang tersisa adalah waktu untuk mendalami kasus yang lebih kompleks. Ke depan, saya ingin mengembangkan pembelajaran ini menjadi proyek lintas mata pelajaran agar dampaknya lebih luas dan berkelanjutan.",
        tags: ["Case Method", "Debat Terstruktur", "Literasi Digital", "Etika"],
        cover: null,
        driveUrl: "",
        featured: false,
        updatedAt: null
      }
    ],

    videos: [
      {
        id: "vid-siklus-1",
        cycle: 1,
        title: "Praktik Mengajar Siklus 1 — Berpikir Komputasional",
        url: "",
        duration: "",
        description:
          "Rekaman pelaksanaan pembelajaran algoritma dengan pendekatan unplugged, mulai dari apersepsi hingga presentasi diagram alur peserta didik.",
        analysis:
          "Video ini merekam pelaksanaan rancangan siklus 1 secara utuh. Bagian awal menunjukkan bagaimana apersepsi digunakan untuk menarik pengalaman peserta didik, sementara bagian tengah memperlihatkan kerja kelompok dan cara guru memberikan pertanyaan pemandu. Pada bagian akhir terlihat presentasi kelompok dan umpan balik yang diberikan.\n\nKetika menonton ulang rekaman ini, saya menyadari bahwa tempo instruksi di awal terlalu cepat dan beberapa peserta didik belum sempat memahami tugas sebelum kerja kelompok dimulai. Saya juga melihat kecenderungan saya untuk membantu terlalu cepat ketika kelompok mengalami kesulitan. Temuan ini menjadi dasar perbaikan pada siklus berikutnya, terutama dalam hal menuliskan instruksi secara visual dan memberi waktu tunggu yang lebih lama.",
        poster: null
      },
      {
        id: "vid-siklus-2",
        cycle: 2,
        title: "Praktik Mengajar Siklus 2 — Jaringan Komputer",
        url: "",
        duration: "",
        description:
          "Rekaman pembelajaran jaringan komputer dengan analogi sistem pos dan simulasi topologi menggunakan kartu perangkat.",
        analysis:
          "Rekaman siklus 2 menunjukkan perubahan nyata pada pengelolaan kelas. Peran kelompok yang jelas membuat lebih banyak peserta didik terlibat, dan instruksi tiga langkah di papan tulis mengurangi kebingungan. Analogi sistem pos terbukti efektif ketika peserta didik mampu menjelaskan kembali perjalanan data dengan bahasa sendiri.\n\nBagian yang masih perlu diperbaiki adalah penguatan konsep di akhir pembelajaran. Saya terlalu cepat menyimpulkan dan belum memberi kesempatan kepada peserta didik untuk menghubungkan analogi dengan istilah teknis secara mandiri. Pada siklus berikutnya saya menambahkan justifikasi 'mengapa' pada setiap keputusan agar pemahaman konsep lebih dalam.",
        poster: null
      },
      {
        id: "vid-siklus-3",
        cycle: 3,
        title: "Praktik Mengajar Siklus 3 — Analisis Data",
        url: "",
        duration: "",
        description:
          "Rekaman proyek mini analisis data: peserta didik mengumpulkan, mengolah, dan menyajikan data sekolah menjadi data story.",
        analysis:
          "Video siklus 3 memperlihatkan pembelajaran yang paling aktif dari sisi peserta didik. Klinik data memungkinkan guru memberikan bantuan yang berbeda sesuai kebutuhan, sementara kelompok yang lebih cepat memperoleh tantangan analisis. Momen penting terlihat ketika seorang peserta didik mempertanyakan siapa yang tidak terwakili dalam data mereka.\n\nDari rekaman ini saya belajar bahwa memberi ruang bertanya lebih berharga daripada menjelaskan semua rumus. Namun, presentasi kelompok masih terburu-buru sehingga diskusi etika data belum tergali optimal. Saya mencatat perlunya mengurangi jumlah kelompok yang tampil atau menambah waktu khusus untuk diskusi.",
        poster: null
      },
      {
        id: "vid-siklus-4",
        cycle: 4,
        title: "Praktik Mengajar Siklus 4 — Etika dan Jejak Digital",
        url: "",
        duration: "",
        description:
          "Rekaman debat terstruktur dan presentasi kampanye literasi digital sebagai penutup rangkaian praktik mengajar mandiri.",
        analysis:
          "Siklus 4 menunjukkan suasana kelas yang berani dan saling menghargai. Aturan diskusi yang disepakati bersama membuat peserta didik merasa aman untuk berpendapat. Debat terstruktur melatih mereka menggunakan bukti, bukan sekadar opini, dan sesi komitmen digital menjadi penutup yang reflektif.\n\nSebagai guru, saya belajar untuk lebih sabar menahan diri dari keinginan menambahkan penjelasan. Beberapa momen terbaik justru muncul ketika saya diam dan membiarkan peserta didik saling merespons. Keterbatasan waktu membuat satu kelompok tidak sempat presentasi, sehingga saya perlu mengatur jumlah kelompok dan alokasi waktu dengan lebih cermat pada praktik berikutnya.",
        poster: null
      }
    ],

    reflections: [
      {
        id: "ref-1",
        cycle: 1,
        title: "Siklus 1 — Belajar dari kelas yang diam",
        body:
          "Siklus pertama saya awali dengan keyakinan bahwa rancangan yang rapi akan otomatis berjalan baik. Kenyataannya, kelas justru terasa diam. Saya terlalu fokus pada kesempurnaan alur dan lupa bahwa peserta didik perlu dibantu memahami apa yang sedang mereka kerjakan. Refleksi ini mengubah cara saya memandang perencanaan: rancangan yang baik bukan yang paling lengkap, tetapi yang paling dapat dijalankan oleh murid.",
        strengths:
          "Aktivitas unplugged membangun rasa ingin tahu dan membuat konsep abstrak lebih konkret.\nMedia kartu langkah membantu peserta didik memahami urutan tanpa tekanan perangkat.\nContoh algoritma dari rutinitas pagi berhasil mematahkan anggapan bahwa algoritma itu rumit.",
        challenges:
          "Instruksi awal terlalu panjang sehingga waktu kerja kelompok berkurang.\nBeberapa peserta didik pasif karena anggota lain mendominasi.\nSaya cenderung membantu terlalu cepat ketika kelompok mengalami kesulitan.",
        followUp:
          "Menyederhanakan instruksi menjadi tiga poin visual, menggunakan timer, dan menetapkan peran bergilir dalam kelompok."
      },
      {
        id: "ref-2",
        cycle: 2,
        title: "Siklus 2 — Menata ritme dan ruang partisipasi",
        body:
          "Siklus 2 mengajarkan bahwa pengelolaan kelas bukan soal membuat murid patuh, melainkan menciptakan struktur yang memungkinkan semua orang berpartisipasi. Peran kelompok dan timer sederhana mengubah dinamika kelas secara signifikan. Saya melihat peserta didik yang sebelumnya diam mulai berani menyampaikan pendapat karena tahu kapan gilirannya.",
        strengths:
          "Peran kelompok yang jelas meningkatkan partisipasi dan mengurangi dominasi.\nAnalogi sistem pos membuat konsep jaringan lebih mudah dijelaskan dengan bahasa sendiri.\nInstruksi visual dan timer membuat waktu kerja lebih efektif.",
        challenges:
          "Penguatan konsep di akhir pembelajaran masih terlalu singkat.\nSebagian peserta didik mampu membuat topologi tetapi belum bisa menjelaskan alasan pemilihan perangkat.\nPenilaian individu dalam kerja kelompok perlu diperkuat.",
        followUp:
          "Menambahkan pertanyaan justifikasi 'mengapa' pada setiap keputusan dan memperkuat asesmen individual melalui lembar refleksi."
      },
      {
        id: "ref-3",
        cycle: 3,
        title: "Siklus 3 — Data yang berbicara, murid yang bertanya",
        body:
          "Data yang dekat dengan kehidupan peserta didik ternyata mampu mengubah suasana kelas. Mereka tidak lagi bertanya 'kapan selesai', tetapi 'apa arti angka ini'. Saya menyadari bahwa pembelajaran bermakna muncul ketika peserta didik memiliki pertanyaan sendiri. Peran guru bergeser dari sumber jawaban menjadi penjaga proses berpikir.",
        strengths:
          "Data kontekstual meningkatkan keterlibatan dan relevansi pembelajaran.\nKlinik data memungkinkan bantuan yang berbeda sesuai kebutuhan.\nPeserta didik mulai mempertanyakan keterbatasan dan etika data.",
        challenges:
          "Waktu presentasi terlalu singkat sehingga diskusi etika belum optimal.\nBeberapa kelompok menghabiskan terlalu banyak waktu membersihkan data.\nTantangan pengayaan belum sepenuhnya menantang peserta didik yang cepat.",
        followUp:
          "Menyiapkan dataset yang lebih bersih, membatasi jumlah kelompok presentasi, dan merancang tantangan pengayaan yang lebih terbuka."
      },
      {
        id: "ref-4",
        cycle: 4,
        title: "Siklus 4 — Menutup dengan keberanian",
        body:
          "Siklus terakhir memberi saya pelajaran tentang keberanian: keberanian peserta didik untuk berpendapat dan keberanian saya untuk tidak selalu menjadi pusat kelas. Debat terstruktur memperlihatkan bahwa murid mampu berpikir etis ketika diberi ruang dan aturan yang jelas. Saya menutup rangkaian praktik ini dengan keyakinan bahwa guru yang baik adalah guru yang terus belajar dari muridnya.",
        strengths:
          "Aturan diskusi yang disepakati menciptakan rasa aman psikologis.\nDebat terstruktur melatih penggunaan bukti dan pengambilan perspektif.\nKampanye literasi digital menghasilkan produk yang dapat digunakan di sekolah.",
        challenges:
          "Waktu tidak cukup untuk seluruh kelompok presentasi.\nBeberapa peserta didik masih kesulitan membedakan opini dan bukti.\nPenilaian sikap perlu indikator yang lebih terukur.",
        followUp:
          "Mengembangkan proyek literasi digital lintas mata pelajaran dan menyusun rubrik sikap yang lebih operasional."
      }
    ],

    reflectionOverview: {
      intro:
        "Empat siklus praktik mengajar mandiri membentuk pola perbaikan yang konsisten: dari kelas yang saya kendalikan, menuju kelas yang saya fasilitasi. Analisis berikut merangkum perubahan tersebut, bukan hanya pada teknik mengajar, tetapi juga pada cara saya memahami murid dan diri sendiri sebagai calon guru.",
      competencies: [
        { name: "Pedagogik", value: 88, note: "Perancangan pembelajaran berbasis kebutuhan murid dan asesmen yang berkelanjutan." },
        { name: "Profesional", value: 86, note: "Penguasaan materi Informatika dan kemampuan menghubungkannya dengan konteks nyata." },
        { name: "Sosial", value: 90, note: "Membangun relasi, kolaborasi, dan iklim kelas yang aman serta inklusif." },
        { name: "Kepribadian", value: 92, note: "Refleksi diri, integritas, dan komitmen untuk terus memperbaiki praktik." }
      ],
      followUp:
        "Rencana tindak lanjut: (1) memperkuat asesmen formatif yang benar-benar mengubah pembelajaran, bukan sekadar mengumpulkan nilai; (2) mengembangkan bank aktivitas unplugged dan proyek kontekstual untuk sekolah dengan fasilitas terbatas; (3) membangun kebiasaan menonton ulang rekaman mengajar dan meminta umpan balik rekan sejawat; serta (4) mendokumentasikan praktik baik dalam portofolio digital yang terus diperbarui."
    },

    archives: [
      {
        id: "ars-1",
        title: "Modul Ajar Siklus 1 — Berpikir Komputasional",
        category: "Modul Ajar",
        type: "pdf",
        driveUrl: "",
        description: "Rancangan pembelajaran lengkap siklus 1: tujuan, langkah, media, asesmen, dan rubrik.",
        date: ""
      },
      {
        id: "ars-2",
        title: "Modul Ajar Siklus 2 — Jaringan Komputer",
        category: "Modul Ajar",
        type: "pdf",
        driveUrl: "",
        description: "Rancangan pembelajaran siklus 2 dengan analogi sistem pos dan simulasi topologi.",
        date: ""
      },
      {
        id: "ars-3",
        title: "Modul Ajar Siklus 3 — Analisis Data",
        category: "Modul Ajar",
        type: "pdf",
        driveUrl: "",
        description: "Proyek mini analisis data sekolah beserta lembar kerja dan rubrik penilaian.",
        date: ""
      },
      {
        id: "ars-4",
        title: "Modul Ajar Siklus 4 — Etika dan Jejak Digital",
        category: "Modul Ajar",
        type: "pdf",
        driveUrl: "",
        description: "Rancangan debat terstruktur dan kampanye literasi digital untuk kelas X.",
        date: ""
      }
    ],

    settings: {
      passHash: null,
      drive: {
        clientId: "",
        apiKey: "",
        folderId: "",
        folderName: "E-Portfolio Arfido",
        autoShare: true
      }
    }
  };

  /* ----------------------------- helpers ----------------------------- */

  function isObj(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
  }

  function clone(v) {
    try {
      return structuredClone(v);
    } catch (e) {
      return JSON.parse(JSON.stringify(v));
    }
  }

  function merge(base, extra) {
    if (Array.isArray(base)) {
      return Array.isArray(extra) ? clone(extra) : clone(base);
    }
    if (isObj(base)) {
      const out = {};
      Object.keys(base).forEach(function (k) {
        out[k] = clone(base[k]);
      });
      if (isObj(extra)) {
        Object.keys(extra).forEach(function (k) {
          out[k] = k in base ? merge(base[k], extra[k]) : clone(extra[k]);
        });
      }
      return out;
    }
    return extra === undefined || extra === null ? base : extra;
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(DEFAULT_DATA);
      return merge(DEFAULT_DATA, JSON.parse(raw));
    } catch (e) {
      console.warn("Gagal membaca data portofolio, memakai data bawaan.", e);
      return clone(DEFAULT_DATA);
    }
  }

  function save(data) {
    if (!data.meta) data.meta = { version: 1, owner: "Arfido Ramadhani" };
    data.meta.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    try {
      window.dispatchEvent(new CustomEvent("portfolio:changed", { detail: data }));
    } catch (e) {
      /* noop */
    }
    return data;
  }

  function reset() {
    const data = clone(DEFAULT_DATA);
    save(data);
    return data;
  }

  function exportJSON(data) {
    const payload = clone(data || load());
    return JSON.stringify(payload, null, 2);
  }

  function importJSON(text) {
    const parsed = JSON.parse(text);
    if (!parsed || !parsed.profile || !parsed.profile.name) {
      throw new Error("Berkas tidak dikenali sebagai data E-Portfolio.");
    }
    const data = merge(DEFAULT_DATA, parsed);
    save(data);
    return data;
  }

  function uid(prefix) {
    return (
      (prefix || "id") +
      "-" +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 7)
    );
  }

  function escapeHTML(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function paragraphs(text) {
    return String(text || "")
      .split(/\n\s*\n/)
      .map(function (p) {
        return p.trim();
      })
      .filter(Boolean);
  }

  function lines(text) {
    return String(text || "")
      .split("\n")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
  }

  function formatDate(value, fallback) {
    if (!value) return fallback || "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  }

  function getPath(obj, path) {
    return String(path)
      .split(".")
      .reduce(function (acc, key) {
        if (acc == null) return undefined;
        return acc[key];
      }, obj);
  }

  function setPath(obj, path, value) {
    const keys = String(path).split(".");
    let target = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (target[k] == null || typeof target[k] !== "object") target[k] = {};
      target = target[k];
    }
    target[keys[keys.length - 1]] = value;
    return obj;
  }

  /* ----------------------------- icons ----------------------------- */

  const ICONS = {
    arrowUpRight: '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    arrowUp: '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
    play: '<path d="m8 5 11 7-11 7V5Z" fill="currentColor" stroke="none"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    video: '<path d="m16 13 5 3V8l-5 3"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16 8-2 6-6 2 2-6 6-2Z"/>',
    quote: '<path d="M10 11H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4"/><path d="M20 11h-4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4"/>',
    mapPin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>',
    graduation: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>',
    external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    folder: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
    home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22V12h6v10"/>',
    drive: '<path d="M9 3h6l7 12h-6L9 3Z"/><path d="M9 3 2 15l3 6 7-12L9 3Z"/><path d="M5 21h14l3-6H8l-3 6Z"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    tag: '<path d="M12.6 2.6a2 2 0 0 0-1.4-.6H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.6 8.6a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8Z"/><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    cpu: '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3"/><path d="M15 2v3"/><path d="M9 19v3"/><path d="M15 19v3"/><path d="M2 9h3"/><path d="M2 15h3"/><path d="M19 9h3"/><path d="M19 15h3"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
    presentation: '<path d="M2 3h20"/><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="m7 21 5-5 5 5"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="m8.2 13.4-1.7 8.1 5.5-3 5.5 3-1.7-8.1"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3Z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.9-5.8 5.1-6C9.5 14.8 12 13 13 12"/>',
    sparkles: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"/><path d="M19 15l.9 2.4 2.1.6-2.1.9L19 21l-.9-2.1-2.1-.9 2.1-.6L19 15Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>'
  };

  function icon(name, size, extraClass) {
    const path = ICONS[name] || ICONS.sparkles;
    return (
      '<svg class="icon ' +
      (extraClass || "") +
      '" width="' +
      (size || 18) +
      '" height="' +
      (size || 18) +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      path +
      "</svg>"
    );
  }

  /* ------------------------- Google Drive utils ------------------------- */

  function driveFileId(url) {
    if (!url) return "";
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /\/folders\/([a-zA-Z0-9_-]+)/,
      /\/document\/d\/([a-zA-Z0-9_-]+)/,
      /\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/,
      /\/presentation\/d\/([a-zA-Z0-9_-]+)/,
      /[?&]id=([a-zA-Z0-9_-]+)/,
      /^([a-zA-Z0-9_-]{20,})$/
    ];
    for (let i = 0; i < patterns.length; i++) {
      const m = String(url).match(patterns[i]);
      if (m) return m[1];
    }
    return "";
  }

  function driveThumb(url, size) {
    const id = driveFileId(url);
    if (!id) return "";
    return "https://drive.google.com/thumbnail?id=" + id + "&sz=w" + (size || 1200);
  }

  function youtubeId(url) {
    if (!url) return "";
    const patterns = [
      /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{6,})/,
      /youtu\.be\/([a-zA-Z0-9_-]{6,})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    for (let i = 0; i < patterns.length; i++) {
      const m = String(url).match(patterns[i]);
      if (m) return m[1];
    }
    return "";
  }

  window.PortfolioStore = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_PASSCODE: DEFAULT_PASSCODE,
    DEFAULT_DATA: DEFAULT_DATA,
    load: load,
    save: save,
    reset: reset,
    exportJSON: exportJSON,
    importJSON: importJSON,
    uid: uid,
    clone: clone,
    merge: merge,
    escapeHTML: escapeHTML,
    paragraphs: paragraphs,
    lines: lines,
    formatDate: formatDate,
    getPath: getPath,
    setPath: setPath,
    driveFileId: driveFileId,
    driveThumb: driveThumb,
    youtubeId: youtubeId,
    icon: icon,
    icons: ICONS
  };
})();
