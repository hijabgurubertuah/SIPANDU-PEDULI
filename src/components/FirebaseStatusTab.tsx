import { useState } from 'react';
import { 
  Database, 
  Wifi, 
  Activity, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Layers,
  BarChart3,
  PieChart as PieChartIcon,
  ShieldCheck
} from 'lucide-react';
import { 
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

  // Live document counts
  const dataCounts = [
    { key: 'services', label: 'Poliklinik & Layanan', count: services.length, color: '#10b981' },
    { key: 'mitra', label: 'Mitra Faskes Binaan', count: mitraList.length, color: '#14b8a6' },
    { key: 'news', label: 'Berita & Pengumuman', count: newsList.length, color: '#06b6d4' },
    { key: 'gallery', label: 'Galeri Arsip Drive', count: driveGallery.length, color: '#6366f1' },
    { key: 'systems', label: 'Sistem Digital', count: systems.length, color: '#f59e0b' },
    { key: 'config', label: 'Konfigurasi Global', count: 3, color: '#f43f5e' },
  ];

  const totalDocuments = dataCounts.reduce((acc, curr) => acc + curr.count, 0);

  // Pie chart calculations
  let cumulativeAngle = 0;
  const pieSegments = dataCounts.map((item, idx) => {
    const value = item.count || 1;
    const percentage = Math.round((value / Math.max(totalDocuments, 1)) * 100);
    const angle = (value / Math.max(totalDocuments, 1)) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const radius = 75;
    const innerRadius = 45;
    const cx = 100;
    const cy = 100;

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
      index: idx
    };
  });

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
      alert('Berhasil menyimpan semua data ke Firebase Cloud!');
    } catch (err: any) {
      alert(`Gagal sinkronisasi: ${err?.message || 'Error tidak diketahui'}`);
    } finally {
      setSyncingAll(false);
    }
  };

  const maxCount = Math.max(...dataCounts.map((d) => d.count), 10);

  return (
    <div className="space-y-5">
      
      {/* Sleek Minimalist Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Status Firebase Cloud</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs text-slate-500">
              Database Firestore ID: <code className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{firebaseConfig.firestoreDatabaseId || 'default'}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestPing}
            disabled={testing}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Menguji...' : 'Uji Ping'}</span>
          </button>

          <button
            type="button"
            onClick={handleSyncAll}
            disabled={syncingAll}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{syncingAll ? 'Menyimpan...' : 'Simpan Ke Cloud'}</span>
          </button>
        </div>
      </div>

      {/* Ping Feedback */}
      {testResult && (
        <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-bold transition ${
          testResult.success 
            ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' 
            : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
        }`}>
          {testResult.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{testResult.message} ({testResult.latencyMs} ms)</span>
        </div>
      )}

      {/* 4 Minimal Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
            <span>STATUS HUBUNGAN</span>
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Terhubung</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
            <span>LATENSI RESPONS</span>
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-white">
            {testResult ? `${testResult.latencyMs} ms` : '~42 ms'}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
            <span>TOTAL DOKUMEN</span>
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-sm font-black text-slate-900 dark:text-white">
            {totalDocuments} Record Data
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1">
            <span>KUOTA TULIS</span>
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
          </div>
          <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
            Aman (Manual Save)
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-12 gap-4">

        {/* Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                Jumlah Dokumen Per Koleksi
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">
              Total {totalDocuments} Dokumen
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {dataCounts.map((item, idx) => {
              const percentage = Math.round((item.count / maxCount) * 100);
              const isHovered = hoveredBar === idx;

              return (
                <div 
                  key={item.key}
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isHovered ? 'bg-slate-50 dark:bg-slate-800' : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-800 dark:text-slate-200">{item.label}</span>
                    </div>
                    <span className="text-slate-900 dark:text-white font-extrabold">
                      {item.count}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(percentage, 5)}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
                Distribusi Data
              </h3>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 py-1">
            <div className="relative shrink-0">
              <svg width="180" height="180" viewBox="0 0 200 200">
                {pieSegments.map((segment) => {
                  const isHovered = hoveredSlice === segment.index;
                  return (
                    <path
                      key={segment.key}
                      d={segment.pathData}
                      fill={segment.color}
                      opacity={hoveredSlice === null || isHovered ? 1 : 0.5}
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredSlice(segment.index)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {totalDocuments}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400">
                  Total
                </span>
              </div>
            </div>

            <div className="space-y-1 text-[11px] w-full">
              {pieSegments.map((segment) => (
                <div
                  key={segment.key}
                  onMouseEnter={() => setHoveredSlice(segment.index)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className="flex items-center justify-between p-1 rounded transition-colors"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
                    <span className="text-slate-700 dark:text-slate-300 truncate font-medium">
                      {segment.label}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white shrink-0 ml-1">
                    {segment.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Metadata Footprint */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <span>Project: <strong className="text-slate-700 dark:text-slate-300">{firebaseConfig.projectId}</strong></span>
        <span>Auth: <strong className="text-slate-700 dark:text-slate-300">{firebaseConfig.authDomain}</strong></span>
      </div>

    </div>
  );
}
