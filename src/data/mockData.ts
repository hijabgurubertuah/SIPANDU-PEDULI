import {
  UserAccount,
  ServiceItem,
  DigitalSystemItem,
  IndicatorMetric,
  DocumentItem,
  ActivityLogItem,
  ComplaintItem,
  HealthPostMitra,
  NewsAnnouncement,
} from '../types';

export const PUSKESMAS_INFO = {
  name: 'UPTD Puskesmas Kepanjen',
  tagline: 'SIPANDU PEDULI — One Link, One Click Access',
  subtitle: 'Sistem Pantau Data Dukung Pelaksanaan, Dokumentasi, dan Evaluasi untuk Layanan Integratif',
  code: 'P3507080201',
  regency: 'Kabupaten Malang',
  address: 'Jl. Raya Jatirejoyoso No. 4, Kec. Kepanjen, Kab. Malang, Jawa Timur 65163',
  phone: '08889924444',
  whatsapp: '08889924444',
  whatsappUrl: 'https://wa.me/628889924444',
  email: 'puskesmaskepanjen@malangkab.go.id',
  instagram: '@pkm.kepanjen',
  instagramUrl: 'https://instagram.com/pkm.kepanjen',
  operationalHours: 'Senin – Kamis: 07.30 – 14.00 WIB | Jumat: 07.30 – 11.00 WIB | Sabtu: 07.30 – 12.30 WIB (UGD & Bersalin 24 Jam)',
  vision: 'Terwujudnya Masyarakat Kecamatan Kepanjen yang Sehat, Mandiri, dan Berdaya Saing Menuju Kabupaten Malang Makmur',
  mission: [
    'Meningkatkan mutu pelayanan kesehatan yang merata, terjangkau, dan paripurna berbasis integrasi layanan primer (ILP).',
    'Mendorong kemandirian masyarakat untuk hidup sehat melalui pemberdayaan dan promosi kesehatan aktif.',
    'Memperkuat pencegahan, pengendalian penyakit menular dan penyakit tidak menular serta penyehatan lingkungan.',
    'Mengembangkan tata kelola Puskesmas yang transparan, akuntabel, dan berbasis teknologi digital (Good Governance).'
  ],
  motto: 'Kepanjen PEDULI (Profesional, Empati, Disiplin, Unggul, Loyal, Inovatif)',
  maklumat: 'Dengan ini kami menyatakan sanggup menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditetapkan dan apabila tidak menepati janji ini, kami siap menerima sanksi sesuai peraturan perundang-undangan yang berlaku.'
};

export const MOCK_USERS: UserAccount[] = [
  {
    id: 'user-1',
    name: 'Ir. Ahmad Subagyo, S.Kom',
    email: 'admin.sipandu@puskesmaskepanjen.id',
    nip: '198403122008011005',
    role: 'super_admin',
    unit: 'all',
    unitName: 'Semua Unit & Administrator',
    roleLabel: 'Super Admin',
    status: 'active'
  },
  {
    id: 'user-2',
    name: 'drg. Hj. Rina Puspitasari, M.Kes',
    email: 'kapus.kepanjen@malangkab.go.id',
    nip: '197605152003122004',
    role: 'pimpinan',
    unit: 'all',
    unitName: 'Pimpinan / Kepala Puskesmas',
    roleLabel: 'Pimpinan Puskesmas',
    status: 'active'
  },
  {
    id: 'user-3',
    name: 'Bd. Siti Nurjanah, S.Tr.Keb',
    email: 'kia.kepanjen@malangkab.go.id',
    nip: '198811202010012014',
    role: 'koordinator',
    unit: 'kia',
    unitName: 'Klaster 2: Kesehatan Ibu & Anak',
    roleLabel: 'Koordinator Klaster KIA',
    status: 'active'
  },
  {
    id: 'user-4',
    name: 'dr. Hendra Wicaksono',
    email: 'dewasa.kepanjen@malangkab.go.id',
    nip: '199002142017041002',
    role: 'koordinator',
    unit: 'dewasa_lansia',
    unitName: 'Klaster 3: Dewasa & Lansia (PTM & CKG)',
    roleLabel: 'Koordinator Klaster Dewasa & Lansia',
    status: 'active'
  },
  {
    id: 'user-5',
    name: 'Dwi Retno Hastuti, A.Md.Kep',
    email: 'staf.p2m@puskesmaskepanjen.id',
    nip: '199407082020122009',
    role: 'petugas',
    unit: 'p2m_kesling',
    unitName: 'Klaster 4: P2M & Kesling',
    roleLabel: 'Petugas / Staf Teknis',
    status: 'active'
  },
  {
    id: 'user-6',
    name: 'Drs. Bambang Sudirman (Auditor Dinkes)',
    email: 'monev.dinkes@malangkab.go.id',
    nip: '197302011998031003',
    role: 'viewer',
    unit: 'all',
    unitName: 'Lintas Klaster / Monev Dinkes',
    roleLabel: 'Viewer / Tim Monev',
    status: 'active'
  }
];

export const MOCK_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Pelayanan Pemeriksaan Umum',
    category: 'Pelayanan Medis',
    schedule: 'Senin - Sabtu: 07.30 - 13.00 WIB',
    description: 'Pemeriksaan kesehatan umum, diagnosis medis, pengobatan penyakit akut dan kronis, serta rujukan berjenjang jika diperlukan.',
    requirements: ['Kartu Identitas (KTP/KK)', 'Kartu BPJS/KIS Faskes Kepanjen (Bagi peserta JKN)', 'Buku rekam medis / Nomor antrean online'],
    flow: ['Ambil Nomor Antrean di Mesin / Loket', 'Pendaftaran & Verifikasi Berkas', 'Pemeriksaan Tanda Vital & Skrining', 'Pemeriksaan Dokter di Ruang Pemeriksaan', 'Pengambilan Resep Obat / Lab / Pulang'],
    tariff: 'Gratis bagi peserta BPJS Kesehatan aktif; Pasien Umum sesuai Perbup Malang No. 12 Tahun 2023 (Rp 15.000)',
    room: 'Ruang Pemeriksaan Umum (Lantai 1)',
    doctorPic: 'dr. Muhammad Farhan & Tim Medis',
    bpjsCovered: true
  },
  {
    id: 'srv-2',
    name: 'Pelayanan Kesehatan Ibu, Anak & KB (KIA)',
    category: 'Klaster 2 (KIA)',
    schedule: 'Senin - Kamis: 07.30 - 13.00 WIB | Jumat - Sabtu: 07.30 - 11.30 WIB',
    description: 'Pemeriksaan kehamilan terpadu (ANC 6x + USG Dokter), nifas, imunisasi rutin balita, KB pasca persalinan, dan deteksi dini risiko tinggi kehamilan.',
    requirements: ['Buku KIA (Pink)', 'KTP / Kartu Keluarga', 'Kartu BPJS Kesehatan'],
    flow: ['Pendaftaran', 'Skrining Berat Badan & Tekanan Darah', 'Konsultasi Bidan & USG Dokter', 'Konseling Gizi / Gigi (ANC Terpadu)', 'Apotek'],
    tariff: 'Gratis (BPJS) / Sesuai Perbup',
    room: 'Ruang KIA-KB (Lantai 1)',
    doctorPic: 'Bd. Siti Nurjanah, S.Tr.Keb & dr. Spesialis Obgyn Konsulen',
    bpjsCovered: true
  },
  {
    id: 'srv-3',
    name: 'Pelayanan Kesehatan Gigi dan Mulut',
    category: 'Pelayanan Medis',
    schedule: 'Senin - Sabtu: 08.00 - 12.30 WIB',
    description: 'Pemeriksaan gigi, pencabutan gigi sulung dan tetap, penambalan komposit, scalling karang gigi dasar, dan edukasi kesehatan oral.',
    requirements: ['Identitas KTP/KK', 'Kartu BPJS Kesehatan'],
    flow: ['Pendaftaran', 'Anamnesis & Vital Sign', 'Tindakan Gigi oleh Dokter Gigi', 'Resep Obat'],
    tariff: 'Gratis (BPJS) / Sesuai Perbup',
    room: 'Poli Gigi (Lantai 1)',
    doctorPic: 'drg. Tri Wahyuni & Perawat Gigi',
    bpjsCovered: true
  },
  {
    id: 'srv-4',
    name: 'Pelayanan Lansia & Skrining PTM (CKG)',
    category: 'Klaster 3 (Dewasa & Lansia)',
    schedule: 'Senin - Sabtu: 07.30 - 13.00 WIB',
    description: 'Skrining kesehatan terpadu: Cek Kesehatan Gratis (CKG), gula darah, kolesterol, asam urat, tensi, serta konseling kesehatan geriatri dan PTM.',
    requirements: ['KTP Kepanjen / Kartu Lansia', 'Kartu BPJS'],
    flow: ['Pendaftaran Prioritas Lansia', 'Pengukuran Tekanan Darah & Antropometri', 'Pemeriksaan Lab Cepat CKG', 'Pemeriksaan Dokter & Konseling'],
    tariff: 'Gratis Program CKG / BPJS',
    room: 'Poli Ramah Lansia (Lantai 1 - Akses Khusus)',
    doctorPic: 'dr. Hendra Wicaksono',
    bpjsCovered: true
  },
  {
    id: 'srv-5',
    name: 'Pemeriksaan Balita Sakit (MTBS) & Tumbuh Kembang',
    category: 'Klaster 2 (KIA)',
    schedule: 'Senin - Sabtu: 08.00 - 12.00 WIB',
    description: 'Manajemen Terpadu Balita Sakit, pemantauan SDIDTK, pencegahan stunting, serta pemberian konseling gizi dan PMT balita gizi kurang.',
    requirements: ['Buku KIA', 'KTP Orang Tua / KK', 'Kartu BPJS'],
    flow: ['Pendaftaran', 'Penimbangan & Pengukuran Panjang Badan', 'Pemeriksaan MTBS', 'Konsultasi Gizi', 'Apotek'],
    tariff: 'Gratis (BPJS) / Perbup',
    room: 'Ruang MTBS & Pojok Tumbuh Kembang',
    doctorPic: 'Tim Perawat MTBS & Ahli Gizi',
    bpjsCovered: true
  },
  {
    id: 'srv-6',
    name: 'Unit Gawat Darurat (UGD) & Persalinan 24 Jam',
    category: 'Gawat Darurat',
    schedule: 'Buka 24 Jam Setiap Hari (Non-Stop)',
    description: 'Pertolongan pertama kasus kegawatdaruratan medik, kecelakaan lalu lintas, stabilisasi pasien, persalinan normal (PONED), dan ambulans siaga.',
    requirements: ['Dapat dilayani segera tanpa antrean registrasi di awal (prioritas triase keselamatan nyawa)'],
    flow: ['Triase Cepat di Pintu Masuk', 'Penanganan Darurat Dokter & Perawat', 'Penyelesaian Administrasi Keluarga', 'Observasi / Rujukan Ambulans'],
    tariff: 'Dijamin BPJS Gawat Darurat / Sesuai Tarif Tindakan Perbup',
    room: 'Gedung UGD 24 Jam Depan',
    doctorPic: 'Dokter Jaga UGD & Tim Siaga Ambulans',
    bpjsCovered: true
  },
  {
    id: 'srv-7',
    name: 'Laboratorium Klinik',
    category: 'Penunjang Medis',
    schedule: 'Senin - Sabtu: 07.30 - 13.00 WIB (UGD 24 Jam)',
    description: 'Pemeriksaan darah lengkap, urin rutin, gula darah, tes cepat HIV/Sifilis/Hepatitis B, TCM Dahak TB paru, dan malaria.',
    requirements: ['Pengantar Pemeriksaan dari Dokter Poliklinik'],
    flow: ['Penyerahan Formulir Lab', 'Pengambilan Sampel Darah/Urin/Dahak', 'Tunggu Hasil (15-45 Menit)', 'Hasil dikirim ke Ruang Dokter'],
    tariff: 'Ditanggung BPJS atas indikasi medis',
    room: 'Instalasi Laboratorium',
    doctorPic: 'Analis Kesehatan / Pranata Labkes',
    bpjsCovered: true
  },
  {
    id: 'srv-8',
    name: 'Farmasi & Apotek Pelayanan',
    category: 'Penunjang Medis',
    schedule: 'Senin - Sabtu: 07.45 - 14.00 WIB (24 Jam untuk UGD)',
    description: 'Pemberian obat sesuai resep dokter, Pelayanan Informasi Obat (PIO), dan konseling kepatuhan minum obat kronis (hipertensi, diabetes, TB).',
    requirements: ['Resep Resmi dari Poliklinik Puskesmas Kepanjen'],
    flow: ['Penyerahan Lembar Resep', 'Screening Resep & Peracikan Obat', 'Pemanggilan Nama Pasien & Verifikasi Identitas', 'Penjelasan Cara Pakai Obat'],
    tariff: 'Gratis sesuai formularium obat Puskesmas',
    room: 'Loket Apotek & Konseling Obat',
    doctorPic: 'Apt. Dewi Lestari, S.Farm & Tim Farmasi',
    bpjsCovered: true
  }
];

export const MOCK_DIGITAL_SYSTEMS: DigitalSystemItem[] = [
  {
    id: 'sys-1',
    name: 'SP4N LAPOR!',
    category: 'pemerintah',
    categoryLabel: 'Sistem Pemerintah Pusat',
    description: 'Layanan aspirasi dan pengaduan online rakyat yang terhubung langsung dengan KemenPAN-RB, Kemendagri, dan Ombudsman RI.',
    url: 'https://www.lapor.go.id',
    iconName: 'ShieldAlert',
    badge: 'Nasional',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-2',
    name: 'SIPPN MENPAN RB',
    category: 'pemerintah',
    categoryLabel: 'Sistem Pemerintah Pusat',
    description: 'Sistem Informasi Pelayanan Publik Nasional untuk melihat standar pelayanan, maklumat, tarif, dan kepatuhan instansi pemerintah.',
    url: 'https://sippn.menpan.go.id',
    iconName: 'Building2',
    badge: 'Nasional',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-3',
    name: 'SATUSEHAT Kemenkes',
    category: 'pemerintah',
    categoryLabel: 'Kementerian Kesehatan',
    description: 'Platform integrasi data rekam medis elektronik (RME) nasional yang menghubungkan faskes dengan aplikasi mobile masyarakat.',
    url: 'https://satusehat.kemkes.go.id',
    iconName: 'HeartPulse',
    badge: 'Kemenkes',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-4',
    name: 'Mobile JKN (BPJS Kesehatan)',
    category: 'pemerintah',
    categoryLabel: 'BPJS Kesehatan',
    description: 'Pendaftaran antrean online, cek status kepesertaan, perubahan faskes, serta riwayat pelayanan tanpa antre lama.',
    url: 'https://bpjs-kesehatan.go.id',
    iconName: 'Smartphone',
    badge: 'Antrean Online',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-5',
    name: 'Portal Resmi Pemkab Malang',
    category: 'pemerintah',
    categoryLabel: 'Pemerintah Daerah',
    description: 'Pusat informasi publik terintegrasi dan layanan publik digital Kabupaten Malang.',
    url: 'https://malangkab.go.id',
    iconName: 'Globe',
    badge: 'Pemkab Malang',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-6',
    name: 'PINTAR ASIK (Pencatatan Imunisasi)',
    category: 'internal',
    categoryLabel: 'Aplikasi Program Puskesmas',
    description: 'Sistem digital pencatatan terpadu imunisasi, pemantauan status gizi balita, dan pelacakan drop-out imunisasi desa se-Kepanjen.',
    url: 'https://asik.kemkes.go.id',
    iconName: 'Baby',
    badge: 'Program KIA',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-7',
    name: 'Dashboard CKG Kepanjen',
    category: 'internal',
    categoryLabel: 'Program Prioritas',
    description: 'Dashboard pemantauan capaian Cek Kesehatan Gratis (CKG) usia produktif dan lansia per desa se-Kecamatan Kepanjen.',
    url: 'https://docs.google.com/spreadsheets/d/1_mock_ckg_kepanjen/edit',
    iconName: 'Activity',
    badge: 'CKG 2026',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-8',
    name: 'E-Kinerja BKN / Pemkab Malang',
    category: 'internal',
    categoryLabel: 'Manajemen Kepegawaian',
    description: 'Sistem pengelolaan dan evaluasi Sasaran Kinerja Pegawai (SKP) Aparatur Sipil Negara UPTD Puskesmas Kepanjen.',
    url: 'https://kinerja.bkn.go.id',
    iconName: 'Briefcase',
    badge: 'Pegawai ASN',
    isExternal: true,
    status: 'Online'
  },
  {
    id: 'sys-9',
    name: 'E-SAKIP Akuntabilitas Kinerja',
    category: 'internal',
    categoryLabel: 'Tata Kelola Pemerintahan',
    description: 'Sistem Akuntabilitas Kinerja Instansi Pemerintah untuk pemantauan target perjanjian kinerja tahunan Puskesmas.',
    url: 'https://esakip.malangkab.go.id',
    iconName: 'Award',
    badge: 'Akuntabilitas',
    isExternal: true,
    status: 'Online'
  }
];

export const MOCK_INDICATORS: IndicatorMetric[] = [
  {
    id: 'ind-1',
    program: 'CKG',
    title: 'Cakupan Cek Kesehatan Gratis (Usia 15-59 Tahun)',
    target: 14500,
    current: 11230,
    unit: 'Jiwa',
    period: 'Januari - September 2026',
    status: 'On Track',
    cluster: 'dewasa_lansia',
    verificationStatus: 'Terverifikasi',
    lastUpdated: '08 September 2026'
  },
  {
    id: 'ind-2',
    program: 'CKG',
    title: 'Cakupan Skrining Lansia (Usia 60+ Tahun)',
    target: 5200,
    current: 4350,
    unit: 'Jiwa',
    period: 'Tahun 2026',
    status: 'Tercapai',
    cluster: 'dewasa_lansia',
    verificationStatus: 'Terverifikasi',
    lastUpdated: '09 September 2026'
  },
  {
    id: 'ind-3',
    program: 'SPM',
    title: 'Pelayanan Kesehatan Ibu Hamil Sesuai Standar (K4 & K6)',
    target: 100,
    current: 94.8,
    unit: '%',
    period: 'Triwulan III 2026',
    status: 'On Track',
    cluster: 'kia',
    verificationStatus: 'Terverifikasi',
    lastUpdated: '05 September 2026'
  },
  {
    id: 'ind-4',
    program: 'SPM',
    title: 'Pelayanan Kesehatan Penderita Hipertensi',
    target: 100,
    current: 82.4,
    unit: '%',
    period: 'Triwulan III 2026',
    status: 'Perlu Perhatian',
    cluster: 'dewasa_lansia',
    verificationStatus: 'Menunggu Review',
    lastUpdated: '04 September 2026'
  },
  {
    id: 'ind-5',
    program: 'SPM',
    title: 'Pelayanan Terduga Tuberkulosis (TB)',
    target: 100,
    current: 89.2,
    unit: '%',
    period: 'Triwulan III 2026',
    status: 'On Track',
    cluster: 'p2m_kesling',
    verificationStatus: 'Terverifikasi',
    lastUpdated: '07 September 2026'
  },
  {
    id: 'ind-6',
    program: 'PKP',
    title: 'Penilaian Kinerja Puskesmas (UKM Esensial)',
    target: 95.0,
    current: 96.2,
    unit: 'Skor Mutu (%)',
    period: 'Rekap Semester I 2026',
    status: 'Tercapai',
    cluster: 'manajemen',
    verificationStatus: 'Terverifikasi',
    lastUpdated: '01 September 2026'
  },
  {
    id: 'ind-7',
    program: 'PKP',
    title: 'Penilaian Kinerja Puskesmas (UKP & Farmasi)',
    target: 90.0,
    current: 91.5,
    unit: 'Skor Mutu (%)',
    period: 'Rekap Semester I 2026',
    status: 'Tercapai',
    cluster: 'lintas_klaster',
    verificationStatus: 'Terverifikasi',
    lastUpdated: '01 September 2026'
  },
  {
    id: 'ind-8',
    program: 'KIA',
    title: 'Balita Ditimbang Berat Badannya (D/S Posyandu)',
    target: 85.0,
    current: 86.7,
    unit: '%',
    period: 'Bulan Penimbangan Balita 2026',
    status: 'Tercapai',
    cluster: 'kia',
    verificationStatus: 'Terverifikasi',
    lastUpdated: '06 September 2026'
  }
];

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Rencana Pelaksanaan Kegiatan (RPK) Tahunan Puskesmas Kepanjen 2026',
    category: 'perencanaan',
    categoryLabel: 'Perencanaan',
    year: 2026,
    cluster: 'manajemen',
    clusterLabel: 'Klaster 1: Manajemen',
    driveUrl: 'https://drive.google.com/file/d/1_RPK_Puskesmas_Kepanjen_2026/view',
    fileType: 'sheet',
    size: '4.2 MB',
    uploaderName: 'Tim Manajemen Puskesmas',
    verificationStatus: 'Terverifikasi',
    updatedAt: '15 Januari 2026',
    isPublicDownload: false,
    description: 'Matriks alokasi anggaran, jadwal kegiatan per bulan, penanggung jawab program, dan target luaran tahun 2026.'
  },
  {
    id: 'doc-2',
    title: 'Rencana Usulan Kegiatan (RUK) Puskesmas Kepanjen Tahun Anggaran 2027',
    category: 'perencanaan',
    categoryLabel: 'Perencanaan',
    year: 2027,
    cluster: 'manajemen',
    clusterLabel: 'Klaster 1: Manajemen',
    driveUrl: 'https://drive.google.com/file/d/1_RUK_Puskesmas_Kepanjen_2027/view',
    fileType: 'doc',
    size: '3.8 MB',
    uploaderName: 'Tim Perencanaan (drg. Rina P)',
    verificationStatus: 'Terverifikasi',
    updatedAt: '28 Juli 2026',
    isPublicDownload: false,
    description: 'Analisis kebutuhan masyarakat, rekapitulasi SMD/MMD, serta usulan anggaran BOK dan BLUD 2027.'
  },
  {
    id: 'doc-3',
    title: 'Master Data Sasaran Penduduk & Program Puskesmas Kepanjen Tahun 2026',
    category: 'sasaran',
    categoryLabel: 'Data Sasaran',
    year: 2026,
    cluster: 'manajemen',
    clusterLabel: 'Semua Klaster',
    driveUrl: 'https://docs.google.com/spreadsheets/d/1_Data_Sasaran_Kepanjen_2026/edit',
    fileType: 'sheet',
    size: '8.5 MB',
    uploaderName: 'Koordinator SP2TP (Siti N)',
    verificationStatus: 'Terverifikasi',
    updatedAt: '02 Februari 2026',
    isPublicDownload: false,
    description: 'Breakdown proyeksi jumlah penduduk, sasaran bumil, bayi, balita, usia produktif, dan lansia per desa se-Kepanjen.'
  },
  {
    id: 'doc-4',
    title: 'Rekapitulasi Capaian Bulanan Penilaian Kinerja Puskesmas (PKP) 2026',
    category: 'pkp',
    categoryLabel: 'Program PKP',
    year: 2026,
    cluster: 'manajemen',
    clusterLabel: 'Klaster 1: Manajemen',
    driveUrl: 'https://docs.google.com/spreadsheets/d/1_PKP_Rekap_Bulanan_2026/edit',
    fileType: 'sheet',
    size: '5.1 MB',
    uploaderName: 'Tim Mutu & PKP',
    verificationStatus: 'Terverifikasi',
    updatedAt: '04 September 2026',
    isPublicDownload: false,
    description: 'Lembar telusur PKP bulanan, verifikasi dokumen eviden, dan capaian kumulatif per indikator pelayanan UKM dan UKP.'
  },
  {
    id: 'doc-5',
    title: 'Data Dukung & Rekapitulasi Cek Kesehatan Gratis (CKG) Semester I 2026',
    category: 'ckg',
    categoryLabel: 'Program CKG',
    year: 2026,
    cluster: 'dewasa_lansia',
    clusterLabel: 'Klaster 3: Dewasa & Lansia',
    driveUrl: 'https://docs.google.com/spreadsheets/d/1_CKG_Data_Dukung_2026/edit',
    fileType: 'sheet',
    size: '6.7 MB',
    uploaderName: 'dr. Hendra Wicaksono',
    verificationStatus: 'Terverifikasi',
    updatedAt: '05 September 2026',
    isPublicDownload: false,
    description: 'Hasil skrining 14 desa/kelurahan, deteksi dini hipertensi, diabetes, dan tindak lanjut rujukan faskes.'
  },
  {
    id: 'doc-6',
    title: 'Instrumen & Bukti Telusur Akreditasi Puskesmas (Bab 1 - 5)',
    category: 'akreditasi',
    categoryLabel: 'Akreditasi',
    year: 2026,
    cluster: 'all',
    clusterLabel: 'Lintas Klaster / Tim Mutu',
    driveUrl: 'https://drive.google.com/drive/folders/1_Folder_Akreditasi_Kepanjen',
    fileType: 'folder',
    size: '128 MB',
    uploaderName: 'Pokja Akreditasi Puskesmas',
    verificationStatus: 'Terverifikasi',
    updatedAt: '12 Agustus 2026',
    isPublicDownload: false,
    description: 'SK Kepala Puskesmas, SOP layanan klinis, Pedoman Tata Kelola (KMP), UKM, UKP, PMP, dan PPN.'
  },
  {
    id: 'doc-7',
    title: 'Laporan Monitoring & Evaluasi Bimtek Pembinaan Dinas Kesehatan Malang 2026',
    category: 'bimtek',
    categoryLabel: 'Bimtek • Desk • Monev',
    year: 2026,
    cluster: 'manajemen',
    clusterLabel: 'Manajemen & Lintas Klaster',
    driveUrl: 'https://drive.google.com/file/d/1_Monev_Bimtek_Dinkes_2026/view',
    fileType: 'pdf',
    size: '2.9 MB',
    uploaderName: 'Tim Manajemen (Ir. Ahmad S)',
    verificationStatus: 'Terverifikasi',
    updatedAt: '20 Agustus 2026',
    isPublicDownload: false,
    description: 'Notula desk monev indikator SPM dan tindak lanjut rekomendasi supervisi fasilitatif Dinkes Kab. Malang.'
  },
  {
    id: 'doc-8',
    title: 'Buku Saku Standar Pelayanan & Alur Pasien UPTD Puskesmas Kepanjen 2026',
    category: 'publik',
    categoryLabel: 'Unduhan Publik',
    year: 2026,
    cluster: 'all',
    clusterLabel: 'Area Publik',
    driveUrl: 'https://drive.google.com/file/d/1_Buku_Saku_Standar_Pelayanan_Publik/view',
    fileType: 'pdf',
    size: '3.4 MB',
    uploaderName: 'Humas & Tim Mutu',
    verificationStatus: 'Terverifikasi',
    updatedAt: '10 Februari 2026',
    isPublicDownload: true,
    description: 'Panduan resmi hak & kewajiban pasien, persyaratan loket, alur rujukan BPJS, dan tarif retribusi daerah.'
  },
  {
    id: 'doc-9',
    title: 'Jadwal Dokter & Petugas Jaga UGD / Bersalin Puskesmas Kepanjen Periode September 2026',
    category: 'publik',
    categoryLabel: 'Unduhan Publik',
    year: 2026,
    cluster: 'lintas_klaster',
    clusterLabel: 'Area Publik',
    driveUrl: 'https://drive.google.com/file/d/1_Jadwal_Dokter_September_2026/view',
    fileType: 'pdf',
    size: '1.1 MB',
    uploaderName: 'Subbag Tata Usaha',
    verificationStatus: 'Terverifikasi',
    updatedAt: '01 September 2026',
    isPublicDownload: true,
    description: 'Jadwal dinas harian dokter umum, dokter gigi, bidan siaga, dan paramedis UGD 24 jam.'
  }
];

export const MOCK_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'log-1',
    userName: 'Ir. Ahmad Subagyo, S.Kom (Super Admin)',
    role: 'Super Admin',
    action: 'Verifikasi Dokumen & Metadata',
    target: 'Data Dukung CKG Semester I 2026 (Klaster 3)',
    timestamp: '11 September 2026, 09:14 WIB',
    ipAddress: '192.168.1.104',
    type: 'verification'
  },
  {
    id: 'log-2',
    userName: 'Bd. Siti Nurjanah, S.Tr.Keb',
    role: 'Koordinator KIA',
    action: 'Pembaruan Tautan Gateway Data',
    target: 'Capaian SPM Ibu Hamil Triwulan III 2026',
    timestamp: '10 September 2026, 15:42 WIB',
    ipAddress: '192.168.1.118',
    type: 'document'
  },
  {
    id: 'log-3',
    userName: 'drg. Hj. Rina Puspitasari, M.Kes',
    role: 'Pimpinan Puskesmas',
    action: 'Tinjauan Dashboard Eksekutif',
    target: 'Monitoring PKP UKM & UKP Semester I 2026',
    timestamp: '10 September 2026, 11:20 WIB',
    ipAddress: '192.168.1.101',
    type: 'system'
  },
  {
    id: 'log-4',
    userName: 'Dwi Retno Hastuti, A.Md.Kep',
    role: 'Petugas / Staf',
    action: 'Unggah Berkas Pendukung',
    target: 'Notula Evaluasi Klaster P2M & Sanitasi Agustus 2026',
    timestamp: '09 September 2026, 14:05 WIB',
    ipAddress: '192.168.1.125',
    type: 'document'
  },
  {
    id: 'log-5',
    userName: 'Ir. Ahmad Subagyo, S.Kom (Super Admin)',
    role: 'Super Admin',
    action: 'Login Berhasil (Autentikasi SSO)',
    target: 'Portal Pegawai SIPANDU PEDULI',
    timestamp: '09 September 2026, 07:45 WIB',
    ipAddress: '192.168.1.104',
    type: 'auth'
  }
];

export const MOCK_COMPLAINTS: ComplaintItem[] = [
  {
    id: 'cmp-1',
    ticketId: 'KPJ-2026-0901',
    reporterName: 'Suryanto Hendro',
    reporterContact: '08123344xxxx',
    serviceTarget: 'Poli Umum',
    category: 'Waktu Tunggu & Antrean',
    content: 'Pagi tadi nomor antrean poli umum bergerak agak lama sekitar 40 menit setelah pendaftaran, mohon info apakah ada penambahan dokter di jam padat.',
    date: '03 September 2026',
    status: 'Selesai',
    response: 'Terima kasih atas masukannya Bapak Suryanto. Pada pukul 08.00-09.00 satu dokter sedang mendampingi kasus gawat darurat di UGD. Saat ini kami telah menyiagakan dokter pengganti cadangan di poli umum pada jam puncak.'
  },
  {
    id: 'cmp-2',
    ticketId: 'KPJ-2026-0902',
    reporterName: 'Ibu Ratna Dewi',
    reporterContact: '08571234xxxx',
    serviceTarget: 'Poli KIA-KB',
    category: 'Fasilitas & Ruang Tunggu',
    content: 'Ruang tunggu KIA sangat sejuk dan ramah anak, namun mohon ditambah kursi tunggu khusus ibu hamil trimester akhir.',
    date: '07 September 2026',
    status: 'Diproses',
    response: 'Terima kasih Ibu Ratna. Usulan penambahan 4 unit kursi prioritas dengan bantalan empuk telah diajukan ke bagian sarana prasarana dan dijadwalkan dipasang pekan ini.'
  }
];

export const MOCK_MITRA: HealthPostMitra[] = [
  {
    id: 'mitra-1',
    name: 'Puskesmas Pembantu (Pustu) Curungrejo',
    type: 'Pustu',
    village: 'Desa Curungrejo',
    address: 'Jl. Melati No. 12, Curungrejo, Kec. Kepanjen',
    pic: 'Bd. Endang S., A.Md.Keb',
    phone: '085233112233',
    operationalHours: 'Senin - Kamis: 08.00 - 12.00 WIB'
  },
  {
    id: 'mitra-2',
    name: 'Puskesmas Pembantu (Pustu) Mangunrejo',
    type: 'Pustu',
    village: 'Desa Mangunrejo',
    address: 'Jl. Raya Mangunrejo RT 03 RW 02, Kepanjen',
    pic: 'Perawat Yulianto, A.Md.Kep',
    phone: '081334556677',
    operationalHours: 'Senin - Kamis: 08.00 - 12.00 WIB'
  },
  {
    id: 'mitra-3',
    name: 'Puskesmas Pembantu (Pustu) Sukoraharjo',
    type: 'Pustu',
    village: 'Desa Sukoraharjo',
    address: 'Jl. Kencana No. 5, Sukoraharjo, Kepanjen',
    pic: 'Bd. Anita Kusuma, S.ST',
    phone: '087855667788',
    operationalHours: 'Senin - Kamis: 08.00 - 12.00 WIB'
  },
  {
    id: 'mitra-4',
    name: 'UPKDK Kelurahan Ardirejo',
    type: 'UPKDK',
    village: 'Kelurahan Ardirejo',
    address: 'Balai Kelurahan Ardirejo, Kepanjen',
    pic: 'Tim Kader Kesehatan Mandiri',
    phone: '08889924444',
    operationalHours: 'Sesuai Jadwal Posyandu & Skrining'
  },
  {
    id: 'mitra-5',
    name: 'Klinik Pratama Rawat Jalan Kasih Ibu (Jejaring)',
    type: 'Klinik',
    village: 'Kelurahan Kepanjen',
    address: 'Jl. Kawi No. 18, Kepanjen',
    pic: 'dr. Satria Wibowo',
    phone: '0341-395xxx',
    operationalHours: '07.00 - 20.00 WIB'
  },
  {
    id: 'mitra-6',
    name: 'Tempat Praktik Mandiri Dokter (TPMD) dr. Anwar',
    type: 'TPMD',
    village: 'Desa Sengguruh',
    address: 'Jl. Diponegoro No. 44, Sengguruh, Kepanjen',
    pic: 'dr. M. Anwar',
    phone: '081234889900',
    operationalHours: '16.00 - 20.00 WIB'
  }
];

export const MOCK_NEWS: NewsAnnouncement[] = [
  {
    id: 'news-1',
    title: 'Pelaksanaan Cek Kesehatan Gratis (CKG) Serentak di 14 Desa se-Kecamatan Kepanjen',
    category: 'Berita',
    date: '08 September 2026',
    excerpt: 'Puskesmas Kepanjen menggelar program CKG menyasar usia produktif dan lansia untuk deteksi dini risiko penyakit kardiovaskular.',
    content: 'Kepanjen — Dalam rangka percepatan program prioritas nasional dan peningkatan derajat kesehatan masyarakat, UPTD Puskesmas Kepanjen melaksanakan kegiatan Cek Kesehatan Gratis (CKG) serentak di 14 desa/kelurahan wilayah kerja. Skrining meliputi penimbangan antropometri, tensi darah, glukosa puasa, kolesterol, serta konsultasi gaya hidup sehat bersama dokter keluarga.',
    author: 'Tim Promkes Puskesmas Kepanjen',
    isImportant: true
  },
  {
    id: 'news-2',
    title: 'Jadwal Layanan Imunisasi Rutin & Vitamin A Bulan Penimbangan Balita 2026',
    category: 'Pengumuman',
    date: '05 September 2026',
    excerpt: 'Bunda dan Balita diimbau hadir tepat waktu di Posyandu terdekat untuk pemantauan tumbuh kembang serta vitamin A gratis.',
    content: 'Diberitahukan kepada seluruh warga masyarakat Kecamatan Kepanjen yang memiliki balita usia 6-59 bulan, pos pelayanan penimbangan balita dan pemberian vitamin A kapsul biru/merah serta imunisasi rutin antigen ganda tetap berjalan sesuai jadwal Posyandu desa masing-masing.',
    author: 'Koordinator KIA & Gizi',
    isImportant: true
  },
  {
    id: 'news-3',
    title: 'Edukasi 5 Langkah Cegah Demam Berdarah Dengue (DBD) Memasuki Musim Penghujan',
    category: 'Edukasi Kesehatan',
    date: '02 September 2026',
    excerpt: 'Lakukan Pemberantasan Sarang Nyamuk (PSN) 3M Plus secara rutin satu kali seminggu untuk melindungi keluarga dari gigitan nyamuk Aedes aegypti.',
    content: 'Pencegahan DBD yang paling efektif dan berkesinambungan adalah dengan gerakan 3M Plus: Menguras tempat penampungan air, Menutup rapat wadah air, serta Mendaur ulang barang bekas yang berpotensi menampung air hujan.',
    author: 'Sanitarian Puskesmas'
  }
];

export const VILLAGES_KEPANJEN = [
  'Ardirejo (Kelurahan)',
  'Cepokomulyo (Kelurahan)',
  'Kepanjen (Kelurahan)',
  'Penarukan (Kelurahan)',
  'Curungrejo',
  'Dilem',
  'Jatirejoyoso (Lokasi Induk Puskesmas)',
  'Jenggolo',
  'Kedungpedang',
  'Mangunrejo',
  'Ngadilangkung',
  'Panggungrejo',
  'Sengguruh',
  'Sukoraharjo',
  'Tegalsari'
];
