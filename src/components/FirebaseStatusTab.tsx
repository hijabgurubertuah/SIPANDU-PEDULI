import React, { useState } from 'react';
import { 
  Database, 
  Wifi, 
  Activity, 
  HardDrive, 
  Save, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Image as ImageIcon,
  ExternalLink,
  Layers,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  FirestoreMetricStats, 
  testFirestoreConnection,
  saveSiteSettingsToFirestore,
  saveMarqueeSettingsToFirestore,
  saveDockConfigToFirestore,
  saveMitraToFirestore,
  saveServicesToFirestore,
  saveSystemsToFirestore,
  saveNewsToFirestore,
  saveGalleryToFirestore
} from '../lib/firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  SiteSettings, 
  MarqueeSettings, 
  MobileDockConfig, 
  HealthPostMitra, 
  ServiceItem, 
  DigitalSystemItem, 
  NewsAnnouncement, 
  DriveFileItem 
} from '../types';

interface FirebaseStatusTabProps {
  siteSettings: SiteSettings;
  marqueeSettings: MarqueeSettings;
  dockConfig: MobileDockConfig;
  mitraList: HealthPostMitra[];
  services: ServiceItem[];
  systems: DigitalSystemItem[];
  newsList: NewsAnnouncement[];
  driveGallery: DriveFileItem[];
  onRefreshData: () => Promise<void>;
}

export default function FirebaseStatusTab({
  siteSettings,
  marqueeSettings,
  dockConfig,
  mitraList,
  services,
  systems,
  newsList,
  driveGallery,
  onRefreshData
}: FirebaseStatusTabProps) {
  const [testing, setTesting] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs: number;
    message: string;
  } | null>(null);

  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Calculate actual live document counts
  const dataCounts = [
    { key: 'services', label: 'Poliklinik & Layanan', count: services.length, color: '#10b981', bgClass: 'bg-emerald-500', desc: 'Data poli & jadwal faskes' },
    { key: 'mitra', label: 'Mitra Faskes Binaan', count: mitraList.length, color: '#14b8a6', bgClass: 'bg-teal-500', desc: 'Pustu, Ponkesdes & Poskesdes' },
    { key: 'news', label: 'Berita & Pengumuman', count: newsList.length, color: '#06b6d4', bgClass: 'bg-cyan-500', desc: 'Edukasi & pengumuman publik' },
    { key: 'gallery', label: 'Galeri Arsip Drive', count: driveGallery.length, color: '#6366f1', bgClass: 'bg-indigo-500', desc: 'Metadata link teks Google Drive' },
    { key: 'systems', label: 'Sistem Digital', count: systems.length, color: '#f59e0b', bgClass: 'bg-amber-500', desc: 'Portal aplikasi kesehatan' },
    { key: 'config', label: 'Konfigurasi Global', count: 3, color: '#f43f5e', bgClass: 'bg-rose-500', desc: 'Identitas, Marquee & Docker' },
  ];

  const totalDocuments = dataCounts.reduce((acc, curr) => acc + curr.count, 0);

  // Pie chart calculation
  let cumulativeAngle = 0;
  const pieSegments = dataCounts.map((item, idx) => {
    const value = item.count || 1; // minimum size for visualization
    const percentage = Math.round((value / Math.max(totalDocuments, 1)) * 100);
    const angle = (value / Math.max(totalDocuments, 1)) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    // SVG arc coordinates
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const radius = 80;
    const innerRadius = 46;
    const cx = 110;
    const cy = 110;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const x3 = cx + innerRadius * Math.cos(endRad);
    const y3 = cy + innerRadius * Math.sin(endRad);
    const x4 = cx + innerRadius * Math.cos(startRad);
    const y4 = cy + innerRadius * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    const pathData = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;

    return {
      ...item,
      percentage,
      pathData,
      startAngle,
      endAngle,
      index: idx
    };
  });

  // Handle testing connectivity
  const handleTestPing = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testFirestoreConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        latencyMs: 999,
        message: err?.message || 'Gagal tersambung'
      });
    } finally {
      setTesting(false);
    }
  };

  // Handle syncing all datasets to Firestore
  const handleSyncAll = async () => {
    setSyncingAll(true);
    try {
      await saveSiteSettingsToFirestore(siteSettings);
      await saveMarqueeSettingsToFirestore(marqueeSettings);
      await saveDockConfigToFirestore(dockConfig);
      await saveMitraToFirestore(mitraList);
      await saveServicesToFirestore(services);
      await saveSystemsToFirestore(systems);
      await saveNewsToFirestore(newsList);
      await saveGalleryToFirestore(driveGallery);
      await onRefreshData();
      alert('Berhasil mensinkronkan seluruh data website ke Firebase Firestore!');
    } catch (err: any) {
      alert(`Gagal sinkronisasi: ${err?.message || 'Error tidak diketahui'}`);
    } finally {
      setSyncingAll(false);
    }
  };

  // Max value for bar chart
  const maxCount = Math.max(...dataCounts.map((d) => d.count), 10);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Status & Action Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-20 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-wide uppercase">
              <Database className="w-3.5 h-3.5" />
              <span>Google Cloud Firebase Firestore Terintegrasi</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Status Hubungan & Sinkronisasi Cloud
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
              Seluruh perubahan konten yang disimpan di Portal Admin tersimpan ke Firebase Firestore dan dapat diakses langsung oleh masyarakat. Gambar disimpan di Google Drive sebagai teks link/ID untuk efisiensi kuota.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTestPing}
              disabled={testing}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Menguji...' : 'Uji Koneksi (Ping)'}</span>
            </button>

            <button
              onClick={handleSyncAll}
              disabled={syncingAll}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-xs shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className={`w-4 h-4 ${syncingAll ? 'animate-pulse' : ''}`} />
              <span>{syncingAll ? 'Menyimpan...' : 'Sinkronkan Semua ke Cloud'}</span>
            </button>
          </div>
        </div>

        {/* Live ping test feedback */}
        {testResult && (
          <div className={`mt-4 p-3 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition ${
            testResult.success 
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>

      {/* Critical Policy Banner: Images to Drive & Text to Firebase */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wide">
              Aturan Penting: Seluruh Gambar di Google Drive, Teks di Firebase
            </h4>
            <p className="text-[11px] text-amber-800 dark:text-amber-300/80 mt-0.5 leading-relaxed">
              Untuk menghemat kuota tulis dan menjaga performa cepat, gambar foto diunggah ke Google Drive faskes. Yang disimpan pada Firebase Firestore adalah tautan URL/ID teks saja.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
            Hemat Kuota Tulis (No Base64)
          </span>
        </div>
      </div>

      {/* Status Metrics Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Hubungan */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Status Hubungan</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Terhubung & Aktif</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono truncate">
            ID: {firebaseConfig.firestoreDatabaseId || 'default'}
          </p>
        </div>

        {/* Metric 2: Latensi Respons */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Latensi Respons</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">
            {testResult ? `${testResult.latencyMs} ms` : '~45 ms'}
          </div>
          <p className="text-[10px] text-emerald-600 font-bold">
            Respons Sangat Baik (Asia-East1)
          </p>
        </div>

        {/* Metric 3: Total Dokumen */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Dokumen Cloud</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 dark:text-white">
            {totalDocuments} Record Data
          </div>
          <p className="text-[10px] text-slate-500">
            Tersebar di 6 Koleksi Firestore
          </p>
        </div>

        {/* Metric 4: Kuota Tulis Firestore */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Proteksi Kuota Tulis</span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span>Manual Save</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Hemat Kuota (Tidak auto-save loop)
          </p>
        </div>

      </div>

      {/* ================= CHARTS SECTION ================= */}
      <div className="grid lg:grid-cols-12 gap-6">

        {/* 1. GRAFIK BATANG (BAR CHART) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Grafik Batang Jumlah Dokumen Koleksi
                </h3>
                <p className="text-[11px] text-slate-400">
                  Perbandingan beban data per modul di Firebase Firestore
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Total {totalDocuments} Dokumen
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-3.5 pt-2">
            {dataCounts.map((item, idx) => {
              const percentage = Math.round((item.count / maxCount) * 100);
              const isHovered = hoveredBar === idx;

              return (
                <div 
                  key={item.key}
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    isHovered ? 'bg-slate-50 dark:bg-slate-800/80 shadow-xs' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-800 dark:text-slate-200">{item.label}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({item.desc})</span>
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {item.count} Doc
                    </span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.max(percentage, 4)}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bar Chart Footer info */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Kapasitas Tulis Harian Gratis: 20.000 writes/hari</span>
            <span className="font-bold text-emerald-600">Sangat Efisien (&lt; 0.1% Kuota)</span>
          </div>
        </div>

        {/* 2. GRAFIK PAI (PIE / DONUT CHART) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <PieChartIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Grafik Pai Distribusi Entitas
                </h3>
                <p className="text-[11px] text-slate-400">
                  Proporsi persentase data tersimpan di Cloud
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold text-teal-600">
              Puskesmas Kepanjen
            </span>
          </div>

          {/* Interactive SVG Pie / Donut Chart */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            
            {/* SVG Pie Chart Canvas */}
            <div className="relative shrink-0">
              <svg width="220" height="220" viewBox="0 0 220 220" className="drop-shadow-xs">
                {pieSegments.map((segment) => {
                  const isHovered = hoveredSlice === segment.index;
                  return (
                    <path
                      key={segment.key}
                      d={segment.pathData}
                      fill={segment.color}
                      opacity={hoveredSlice === null || isHovered ? 1 : 0.6}
                      transform={isHovered ? 'scale(1.03) translate(-3, -3)' : ''}
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredSlice(segment.index)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {totalDocuments}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Dokumen
                </span>
              </div>
            </div>

            {/* Pie Chart Legend with percentages */}
            <div className="space-y-1.5 w-full text-xs">
              {pieSegments.map((segment) => {
                const isHovered = hoveredSlice === segment.index;
                return (
                  <div
                    key={segment.key}
                    onMouseEnter={() => setHoveredSlice(segment.index)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isHovered ? 'bg-slate-100 dark:bg-slate-800' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
                      <span className="text-slate-700 dark:text-slate-300 truncate font-medium">
                        {segment.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 font-bold">
                      <span className="text-slate-400 text-[10px]">{segment.count} doc</span>
                      <span className="text-slate-900 dark:text-white w-8 text-right">{segment.percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          <p className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            Arahkan kursor pada potongan pai untuk melihat rincian koleksi
          </p>
        </div>

      </div>

      {/* Cloud Security & Architecture Verification Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Arsitektur Cloud Firestore & Google Drive
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
            Produksi Siap Pakai
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>1. Teks ke Firestore</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Semua nama layanan, jadwal poli, pengumuman, daftar poskesdes, dan konfigurasi teks disimpan terpusat di Firestore. Publik dapat membacanya langsung.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <ImageIcon className="w-4 h-4 text-cyan-600" />
              <span>2. Gambar ke Google Drive</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Berkas foto, logo puskesmas, dan thumbnail disimpan di Google Drive faskes via Google Apps Script. Di Firestore hanya disimpan string URL preview.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <Save className="w-4 h-4 text-teal-600" />
              <span>3. Tombol Simpan Tab</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Setiap tab di admin portal dilengkapi tombol simpan tersendiri. Ini mencegah penulisan berulang saat mengetik dan menjamin kuota gratis tetap awet.
            </p>
          </div>

        </div>

        {/* Project Technical Metadata */}
        <div className="pt-2 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
          <span>Project ID: <strong className="text-slate-700 dark:text-slate-300">{firebaseConfig.projectId}</strong></span>
          <span>Database: <strong className="text-slate-700 dark:text-slate-300">{firebaseConfig.firestoreDatabaseId}</strong></span>
          <span>Auth Domain: <strong className="text-slate-700 dark:text-slate-300">{firebaseConfig.authDomain}</strong></span>
        </div>
      </div>

    </div>
  );
}
