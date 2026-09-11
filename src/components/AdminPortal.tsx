import { useState, type FormEvent, type ChangeEvent } from 'react';
import {
  Settings,
  Image,
  Type,
  Users,
  HardDrive,
  Code,
  KeyRound,
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Save,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  UploadCloud,
  Eye,
  EyeOff,
  AlertTriangle,
  Sparkles,
  Layers,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  Menu,
  Database,
  ArrowRight,
  LogOut,
  FolderOpen,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import {
  SiteSettings,
  MarqueeSettings,
  HealthPostMitra,
  DriveFileItem,
  ServiceItem,
  DigitalSystemItem,
  NewsAnnouncement
} from '../types';
import { VILLAGES_KEPANJEN } from '../data/mockData';

interface AdminPortalProps {
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (newSettings: SiteSettings) => void;
  marqueeSettings: MarqueeSettings;
  onUpdateMarqueeSettings: (newMarquee: MarqueeSettings) => void;
  mitraList: HealthPostMitra[];
  onUpdateMitraList: (newList: HealthPostMitra[]) => void;
  driveGallery: DriveFileItem[];
  onUpdateDriveGallery: (newGallery: DriveFileItem[]) => void;
  services: ServiceItem[];
  onUpdateServices: (newServices: ServiceItem[]) => void;
  systems: DigitalSystemItem[];
  onUpdateSystems: (newSystems: DigitalSystemItem[]) => void;
  newsList: NewsAnnouncement[];
  onUpdateNewsList: (newNews: NewsAnnouncement[]) => void;
  adminPassword: string;
  onUpdateAdminPassword: (newPassword: string) => void;
  onExitAdmin: () => void;
}

export default function AdminPortal({
  siteSettings,
  onUpdateSiteSettings,
  marqueeSettings,
  onUpdateMarqueeSettings,
  mitraList,
  onUpdateMitraList,
  driveGallery,
  onUpdateDriveGallery,
  services,
  onUpdateServices,
  systems,
  onUpdateSystems,
  newsList,
  onUpdateNewsList,
  adminPassword,
  onUpdateAdminPassword,
  onExitAdmin
}: AdminPortalProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('sipandu_admin_auth') === 'true';
  });
  const [inputPassword, setInputPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showInputPassword, setShowInputPassword] = useState(false);

  // Active Menu Section
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'identity'
    | 'marquee'
    | 'gallery'
    | 'mitra'
    | 'services'
    | 'systems'
    | 'news'
    | 'appscript'
    | 'security'
  >('overview');

  // Mobile Sidebar Drawer
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Notification / Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // ----------------------------------------------------
  // Local Form States for Editing
  // ----------------------------------------------------
  // 1. Identity & Logo Form
  const [identForm, setIdentForm] = useState<SiteSettings>(siteSettings);

  // 2. Marquee Form
  const [marqForm, setMarqForm] = useState<MarqueeSettings>(marqueeSettings);

  // 3. Mitra Modal & Form
  const [isMitraModalOpen, setIsMitraModalOpen] = useState(false);
  const [editingMitraId, setEditingMitraId] = useState<string | null>(null);
  const [mitraForm, setMitraForm] = useState<HealthPostMitra>({
    id: '',
    name: '',
    type: 'Pustu',
    village: VILLAGES_KEPANJEN[0],
    address: '',
    pic: '',
    phone: '',
    operationalHours: 'Senin - Sabtu: 08.00 - 12.00 WIB'
  });

  // 4. Drive Upload Form State
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'logo' | 'banner' | 'dokumentasi' | 'berkas' | 'lainnya'>('logo');
  const [uploadDriveUrl, setUploadDriveUrl] = useState('');
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState('');
  const [selectedImagePreview, setSelectedImagePreview] = useState<DriveFileItem | null>(null);

  // 5. Password Change Form
  const [currentPwdInput, setCurrentPwdInput] = useState('');
  const [newPwdInput, setNewPwdInput] = useState('');
  const [confirmPwdInput, setConfirmPwdInput] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // 6. Apps Script Settings
  const [appScriptUrl, setAppScriptUrl] = useState(() => localStorage.getItem('sipandu_gas_url') || '');
  const [driveFolderId, setDriveFolderId] = useState(() => localStorage.getItem('sipandu_drive_folder_id') || '1kPnxxxxxxxxxxxxxxxxxxxxx');
  const [copiedScript, setCopiedScript] = useState(false);

  // ----------------------------------------------------
  // AUTHENTICATION HANDLERS
  // ----------------------------------------------------
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (inputPassword === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('sipandu_admin_auth', 'true');
      setAuthError('');
      showToast('Berhasil masuk ke Dashboard Admin CMS!');
    } else {
      setAuthError('Kata sandi salah! Password bawaan adalah: sipandu123');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sipandu_admin_auth');
    setInputPassword('');
    showToast('Telah keluar dari sesi Admin');
  };

  // ----------------------------------------------------
  // SAVE HANDLERS
  // ----------------------------------------------------
  const handleSaveIdentity = (e: FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings(identForm);
    showToast('Identitas dan Logo Puskesmas berhasil disimpan!');
  };

  const handleSaveMarquee = (e: FormEvent) => {
    e.preventDefault();
    onUpdateMarqueeSettings(marqForm);
    showToast('Pengaturan Teks Berjalan (Marquee) berhasil diperbarui!');
  };

  // Mitra Management
  const handleOpenAddMitra = () => {
    setEditingMitraId(null);
    setMitraForm({
      id: `mitra-${Date.now()}`,
      name: '',
      type: 'Pustu',
      village: VILLAGES_KEPANJEN[0],
      address: '',
      pic: '',
      phone: '08123456789',
      operationalHours: 'Senin - Sabtu: 08.00 - 12.00 WIB'
    });
    setIsMitraModalOpen(true);
  };

  const handleOpenEditMitra = (mitra: HealthPostMitra) => {
    setEditingMitraId(mitra.id);
    setMitraForm({ ...mitra });
    setIsMitraModalOpen(true);
  };

  const handleSaveMitra = (e: FormEvent) => {
    e.preventDefault();
    if (!mitraForm.name.trim()) return;

    if (editingMitraId) {
      const updated = mitraList.map((m) => (m.id === editingMitraId ? mitraForm : m));
      onUpdateMitraList(updated);
      showToast('Data mitra pelayanan berhasil diubah!');
    } else {
      onUpdateMitraList([mitraForm, ...mitraList]);
      showToast('Mitra pelayanan baru berhasil ditambahkan!');
    }
    setIsMitraModalOpen(false);
  };

  const handleDeleteMitra = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus mitra "${name}"?`)) {
      onUpdateMitraList(mitraList.filter((m) => m.id !== id));
      showToast('Mitra pelayanan telah dihapus');
    }
  };

  // Drive Gallery Handlers
  const handleFileUploadSim = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    // Convert to Base64 for instant preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setUploadPreviewUrl(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleAddDriveFile = (e: FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) {
      alert('Nama file wajib diisi');
      return;
    }

    const newDriveItem: DriveFileItem = {
      id: `drive-${Date.now()}`,
      name: uploadFileName.trim(),
      driveUrl: uploadDriveUrl.trim() || 'https://drive.google.com/drive/folders/' + driveFolderId,
      thumbnailUrl: uploadPreviewUrl.trim() || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
      mimeType: uploadFileName.endsWith('.png') ? 'image/png' : 'image/jpeg',
      size: '350 KB',
      category: uploadCategory,
      uploadedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };

    onUpdateDriveGallery([newDriveItem, ...driveGallery]);
    setUploadFileName('');
    setUploadDriveUrl('');
    setUploadPreviewUrl('');
    showToast('Berkas gambar berhasil didaftarkan ke Galeri Drive!');
  };

  const handleDeleteDriveFile = (id: string) => {
    if (window.confirm('Hapus berkas ini dari galeri visual?')) {
      onUpdateDriveGallery(driveGallery.filter((f) => f.id !== id));
      showToast('Berkas dihapus dari galeri');
    }
  };

  const handleSetAsActiveLogo = (item: DriveFileItem) => {
    const updatedSettings: SiteSettings = {
      ...identForm,
      logoUrl: item.thumbnailUrl
    };
    setIdentForm(updatedSettings);
    onUpdateSiteSettings(updatedSettings);
    showToast(`Logo resmi Puskesmas berhasil diganti dengan: ${item.name}!`);
  };

  // Password Change Handler
  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    setPwdError('');

    if (currentPwdInput !== adminPassword) {
      setPwdError('Kata sandi lama yang Anda masukkan salah!');
      return;
    }
    if (newPwdInput.length < 6) {
      setPwdError('Kata sandi baru minimal 6 karakter!');
      return;
    }
    if (newPwdInput !== confirmPwdInput) {
      setPwdError('Konfirmasi kata sandi baru tidak cocok!');
      return;
    }

    onUpdateAdminPassword(newPwdInput);
    setCurrentPwdInput('');
    setNewPwdInput('');
    setConfirmPwdInput('');
    showToast('Kata sandi admin berhasil diperbarui! Simpan baik-baik kata sandi baru Anda.');
  };

  // Reset to default settings
  const handleResetDefaults = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan semua teks dan pengaturan ke bawaan awal?')) {
      onUpdateAdminPassword('sipandu123');
      showToast('Kata sandi telah direset ke sipandu123');
    }
  };

  // ====================================================
  // GOOGLE APPS SCRIPT CODE TEMPLATE
  // ====================================================
  const googleAppsScriptCode = `/**
 * ============================================================================
 * GOOGLE APPS SCRIPT (GAS) - SIPANDU PEDULI UPTD PUSKESMAS KEPANJEN
 * ============================================================================
 * Fitur:
 * 1. Unggah Gambar / Logo langsung ke Google Drive & dapatkan URL Thumbnail
 * 2. Sinkronisasi Pengaturan Tampilan & Mitra ke Google Spreadsheet / Firebase
 * 3. Mengambil daftar thumbnail berkas gambar di folder Google Drive
 * 
 * PANDUAN DEPLOY:
 * 1. Buka https://script.google.com -> Buat Proyek Baru
 * 2. Hapus seluruh kode lama dan tempel (paste) kode ini
 * 3. Ganti FOLDER_ID dan SPREADSHEET_ID dengan ID Anda
 * 4. Klik menu 'Deploy' -> 'New Deployment' (Penerapan Baru)
 * 5. Pilih tipe 'Web App' (Aplikasi Web)
 * 6. Set 'Execute as': 'Me' (Saya) dan 'Who has access': 'Anyone' (Siapa saja)
 * 7. Salin URL Web App dan tempelkan di Dashboard Admin SIPANDU PEDULI
 * ============================================================================
 */

// GANTI DENGAN ID FOLDER GOOGLE DRIVE KHUSUS FOTO PUSKESMAS ANDA
var DRIVE_FOLDER_ID = "${driveFolderId || 'GANTI_DENGAN_ID_FOLDER_DRIVE'}";

// GANTI DENGAN ID SPREADSHEET MASTER PUSKESMAS KEPANJEN ANDA (JIKA MENGGUNAKAN SPREADSHEET)
var SPREADSHEET_ID = "GANTI_DENGAN_ID_SPREADSHEET";

/**
 * Handle POST request: Unggah gambar Base64 atau Simpan Konfigurasi
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    // 1. Aksi UNGGAH GAMBAR KE GOOGLE DRIVE
    if (action === "uploadImage") {
      var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      var base64Data = data.base64.split(",")[1] || data.base64;
      var decodedBytes = Utilities.base64Decode(base64Data);
      var blob = Utilities.newBlob(decodedBytes, data.mimeType || "image/png", data.fileName || "logo_puskesmas.png");
      
      // Simpan file ke Drive
      var file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      var fileId = file.getId();
      // Format URL Thumbnail resmi Google Drive yang bisa langsung tampil di web
      var directThumbnailUrl = "https://lh3.googleusercontent.com/d/" + fileId;
      var webViewLink = file.getUrl();

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Gambar berhasil diunggah ke Google Drive!",
        fileId: fileId,
        fileName: file.getName(),
        thumbnailUrl: directThumbnailUrl,
        driveUrl: webViewLink,
        size: file.getSize() + " bytes"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Aksi SIMPAN PENGATURAN / MITRA KE GOOGLE SHEETS
    if (action === "saveSettings") {
      var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      var sheet = ss.getSheetByName("CMS_SETTINGS") || ss.insertSheet("CMS_SETTINGS");
      sheet.clear();
      sheet.appendRow(["Key", "Value", "UpdatedAt"]);
      sheet.appendRow(["siteSettings", JSON.stringify(data.siteSettings), new Date().toISOString()]);
      sheet.appendRow(["marqueeSettings", JSON.stringify(data.marqueeSettings), new Date().toISOString()]);
      sheet.appendRow(["mitraList", JSON.stringify(data.mitraList), new Date().toISOString()]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Pengaturan berhasil disinkronkan ke Google Spreadsheet!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Action tidak dikenali"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET request: Ambil daftar gambar di folder Google Drive beserta thumbnail-nya
 */
function doGet(e) {
  try {
    var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    var files = folder.getFiles();
    var fileList = [];

    while (files.hasNext()) {
      var file = files.next();
      var mime = file.getMimeType();
      
      // Ambil file bertipe gambar
      if (mime.indexOf("image/") !== -1) {
        var id = file.getId();
        fileList.push({
          id: id,
          name: file.getName(),
          mimeType: mime,
          driveUrl: file.getUrl(),
          thumbnailUrl: "https://lh3.googleusercontent.com/d/" + id,
          size: Math.round(file.getSize() / 1024) + " KB",
          uploadedAt: Utilities.formatDate(file.getDateCreated(), "Asia/Jakarta", "dd MMMM yyyy, HH:mm 'WIB'")
        });
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      total: fileList.length,
      files: fileList
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(googleAppsScriptCode);
    setCopiedScript(true);
    showToast('Kode Apps Script berhasil disalin ke clipboard!');
    setTimeout(() => setCopiedScript(false), 3000);
  };

  // ----------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-6 relative overflow-hidden">
          
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
              {siteSettings.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt="Logo Puskesmas"
                  className="w-12 h-12 object-contain rounded-xl"
                />
              ) : (
                <Building2 className="w-8 h-8" />
              )}
            </div>

            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              Portal Admin CMS Tampilan
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {siteSettings.name}
            </p>
          </div>

          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
            <p className="font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Autentikasi Pengelola Tampilan</span>
            </p>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-1">
              Gunakan kata sandi admin untuk mengedit identitas, logo, teks berjalan, dan mitra.
              <span className="block mt-0.5 font-mono text-[10px] text-emerald-700 dark:text-emerald-400">
                (Kata sandi awal: <strong>sipandu123</strong>)
              </span>
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 rounded-xl border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Kata Sandi Admin CMS
              </label>
              <div className="relative">
                <input
                  type={showInputPassword ? 'text' : 'password'}
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Masukkan password admin..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden pr-10 transition"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowInputPassword(!showInputPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showInputPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2"
            >
              <span>Buka Dashboard CMS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onExitAdmin}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-medium"
            >
              &larr; Kembali ke Tampilan Depan Publik
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // NAVIGATION MENU ITEMS (Colorful & Distinct Archetype)
  // ----------------------------------------------------
  const navMenuItems = [
    { id: 'overview', label: 'Ringkasan & Status', icon: LayoutGridIcon, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'identity', label: 'Identitas & Logo', icon: Image, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { id: 'marquee', label: 'Teks Berjalan (Marquee)', icon: Type, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { id: 'gallery', label: 'Galeri Drive & Thumbnail', icon: HardDrive, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { id: 'mitra', label: 'Mitra Pelayanan Faskes', icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'services', label: 'Poliklinik & Layanan', icon: Building2, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: 'systems', label: 'Gateway Sistem Digital', icon: SlidersHorizontal, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { id: 'news', label: 'Berita & Pengumuman', icon: FolderOpen, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { id: 'appscript', label: 'Kode Apps Script & Sync', icon: Code, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { id: 'security', label: 'Ganti Kata Sandi', icon: KeyRound, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-emerald-600 shadow-xl flex items-center gap-3 border border-slate-700 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-white shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FLOATING BUTTON ON MOBILE (KIRI TENGAH LAYAR HP)         */}
      {/* "pada tampilan hp sidebarnya tersembunyi, dan bisa        */}
      {/* dimunculkan dengan tombol yang ada di kiri tengah layar hp,*/}
      {/* tombol itu ada logo puskesmas yang akan di unggah nanti"   */}
      {/* ======================================================== */}
      <div className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          title="Buka Menu Admin CMS"
          className="group flex items-center bg-gradient-to-r from-emerald-600 to-teal-700 text-white pl-2 pr-3 py-2.5 rounded-r-2xl shadow-2xl border-y border-r border-emerald-400/40 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 p-1 flex items-center justify-center overflow-hidden mr-2 ring-1 ring-white/50">
            {siteSettings.logoUrl ? (
              <img
                src={siteSettings.logoUrl}
                alt="Logo Puskesmas"
                className="w-full h-full object-contain"
              />
            ) : (
              <Building2 className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black uppercase tracking-wider leading-none text-emerald-200">
              Menu CMS
            </span>
            <span className="text-[11px] font-extrabold leading-tight">
              Admin
            </span>
          </div>
        </button>
      </div>

      {/* Top Bar for Admin */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-16 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md">
              {siteSettings.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt="Logo"
                  className="w-7 h-7 object-contain rounded-lg"
                />
              ) : (
                <Settings className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Dashboard Pengelola Tampilan (CMS)
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Aktif
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {siteSettings.name} • One Link, One Click Access
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onExitAdmin}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Lihat Halaman Publik</span>
          </button>

          <button
            onClick={handleLogout}
            title="Keluar Sesi Admin"
            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950 text-rose-600 text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Container with Left Sidebar & Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        
        {/* ======================================================== */}
        {/* DESKTOP SIDEBAR                                          */}
        {/* ======================================================== */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-6">
          
          {/* Logo Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-dashed border-emerald-400/40 p-2 flex items-center justify-center overflow-hidden">
              {siteSettings.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt="Logo Puskesmas"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-10 h-10 text-emerald-600" />
              )}
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                Logo Resmi Puskesmas
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {siteSettings.logoUrl ? 'Tersedia & Aktif' : 'Belum diunggah (Default icon)'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('identity')}
              className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-xs"
            >
              Ubah / Unggah Logo
            </button>
          </div>

          {/* Sidebar Nav List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 shadow-xs space-y-1">
            <span className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Menu Pengaturan Tampilan
            </span>
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-3 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-700/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : `${item.bg} ${item.color}`}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-4 shadow-xs space-y-2 text-xs">
            <div className="font-bold flex items-center gap-1.5 text-emerald-300">
              <Sparkles className="w-4 h-4" />
              <span>Sinkronisasi Otomatis</span>
            </div>
            <p className="text-[11px] text-emerald-100/80 leading-relaxed">
              Semua perubahan yang disimpan langsung berefek pada area publik dan portal pegawai.
            </p>
          </div>

        </aside>

        {/* ======================================================== */}
        {/* MOBILE SIDEBAR DRAWER (Can be opened via Floating Button)*/}
        {/* ======================================================== */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />

            {/* Drawer Content */}
            <div className="relative w-80 max-w-[85vw] bg-white dark:bg-slate-900 h-full p-5 shadow-2xl overflow-y-auto flex flex-col justify-between border-r border-slate-200 dark:border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                      {siteSettings.logoUrl ? (
                        <img src={siteSettings.logoUrl} alt="Logo" className="w-6 h-6 object-contain" />
                      ) : (
                        <Building2 className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-xs font-black text-slate-900 dark:text-white">Admin CMS</h2>
                      <p className="text-[10px] text-slate-400">Puskesmas Kepanjen</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Nav Links */}
                <div className="space-y-1">
                  {navMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-3 ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : `${item.bg} ${item.color}`}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    onExitAdmin();
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Lihat Tampilan Publik</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MAIN CONTENT AREA                                        */}
        {/* ======================================================== */}
        <main className="flex-1 min-w-0 space-y-6">

          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Top Banner Overview */}
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-white/20 uppercase tracking-wider backdrop-blur-xs">
                      Pusat Kendali Tampilan Web
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black">
                      Selamat Datang di Portal Admin CMS
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
                      Kelola logo resmi, teks berjalan, daftar mitra pelayanan kesehatan, dokumen, dan tautan sistem secara real-time tanpa perlu mengubah kode sumber.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setActiveTab('identity')}
                    className="px-5 py-3 rounded-2xl bg-white text-emerald-900 font-extrabold text-xs shadow-md hover:bg-emerald-50 transition shrink-0"
                  >
                    Mulai Ubah Tampilan &rarr;
                  </button>
                </div>
              </div>

              {/* Status Metrics Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Logo Status */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Logo Puskesmas</span>
                    <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                      <Image className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-lg font-black text-slate-900 dark:text-white truncate">
                    {siteSettings.logoUrl ? 'Logo Kustom Aktif' : 'Default Puskesmas'}
                  </div>
                  <button
                    onClick={() => setActiveTab('identity')}
                    className="text-[11px] font-bold text-teal-600 hover:underline"
                  >
                    Atur Logo &rarr;
                  </button>
                </div>

                {/* Marquee Status */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Teks Berjalan</span>
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                      <Type className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${marqueeSettings.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span>{marqueeSettings.enabled ? 'Aktif' : 'Non-Aktif'}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('marquee')}
                    className="text-[11px] font-bold text-cyan-600 hover:underline"
                  >
                    Atur Running Text &rarr;
                  </button>
                </div>

                {/* Mitra Count */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Mitra Pelayanan</span>
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {mitraList.length} Faskes
                  </div>
                  <button
                    onClick={() => setActiveTab('mitra')}
                    className="text-[11px] font-bold text-amber-600 hover:underline"
                  >
                    Kelola Mitra &rarr;
                  </button>
                </div>

                {/* Drive Files */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Berkas di Drive</span>
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                      <HardDrive className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {driveGallery.length} Berkas
                  </div>
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className="text-[11px] font-bold text-indigo-600 hover:underline"
                  >
                    Buka Galeri Drive &rarr;
                  </button>
                </div>

              </div>

              {/* Action Cards Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600">
                      <Image className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Identitas, Nama & Logo
                      </h3>
                      <p className="text-xs text-slate-500">
                        Sesuaikan nama puskesmas, alamat, visi misi, dan logo
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Logo yang diunggah akan otomatis terpasang pada navbar, footer, surat tanda terima aduan, serta tombol floating menu di smartphone.
                  </p>
                  <button
                    onClick={() => setActiveTab('identity')}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    Buka Pengaturan Identitas
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600">
                      <Type className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Teks Berjalan & Pengumuman Atas
                      </h3>
                      <p className="text-xs text-slate-500">
                        Running text untuk informasi mendesak / jadwal posyandu
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Teks berjalan muncul di bagian paling atas halaman web, memudahkan penyampaian pengumuman imunisasi, CKG, atau perubahan jadwal poli.
                  </p>
                  <button
                    onClick={() => setActiveTab('marquee')}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    Atur Teks Berjalan
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Daftar Mitra Jaringan & Posyandu
                      </h3>
                      <p className="text-xs text-slate-500">
                        Kelola Pustu Curungrejo, Mangunrejo, Posyandu & TPMD
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Tambahkan pustu baru, ubah jam pelayanan, nomor kontak penanggung jawab desa, dan alamat faskes jejaring.
                  </p>
                  <button
                    onClick={() => setActiveTab('mitra')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    Kelola Mitra Faskes
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Integrasi Google Apps Script & Drive
                      </h3>
                      <p className="text-xs text-slate-500">
                        Kode backend siap pakai untuk upload & sinkronisasi
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Salin script Google Apps Script untuk otomatisasi unggah foto logo ke folder Google Drive dan sinkronisasi ke Google Spreadsheet / Firebase.
                  </p>
                  <button
                    onClick={() => setActiveTab('appscript')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    Buka Kode Apps Script
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ================= TAB 2: IDENTITAS & LOGO ================= */}
          {activeTab === 'identity' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Image className="w-5 h-5 text-teal-600" />
                    <span>Identitas Resmi & Logo Puskesmas</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ubah logo yang akan tampil di seluruh aplikasi serta informasi faskes
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveIdentity}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-700/20 transition flex items-center gap-2 self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Identitas</span>
                </button>
              </div>

              {/* Logo Section */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 block">
                  1. Logo Puskesmas Utama
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Logo Preview */}
                  <div className="w-28 h-28 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/40 p-3 flex items-center justify-center overflow-hidden shadow-md shrink-0">
                    {identForm.logoUrl ? (
                      <img
                        src={identForm.logoUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-slate-400 text-xs">
                        <Building2 className="w-10 h-10 mx-auto text-emerald-600 mb-1" />
                        <span>Default Icon</span>
                      </div>
                    )}
                  </div>

                  {/* Logo Input Options */}
                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        URL Gambar Logo (Direct Link / Google Drive):
                      </label>
                      <input
                        type="url"
                        value={identForm.logoUrl}
                        onChange={(e) => setIdentForm({ ...identForm, logoUrl: e.target.value })}
                        placeholder="https://... atau pilih dari Galeri Drive di bawah"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('gallery')}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>Pilih dari Galeri Drive</span>
                      </button>

                      {identForm.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setIdentForm({ ...identForm, logoUrl: '' })}
                          className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-600 hover:text-white text-xs font-bold transition"
                        >
                          Hapus & Gunakan Icon Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* General Form Fields */}
              <form onSubmit={handleSaveIdentity} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nama Fasilitas Kesehatan
                    </label>
                    <input
                      type="text"
                      value={identForm.name}
                      onChange={(e) => setIdentForm({ ...identForm, name: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kode Puskesmas Kemenkes
                    </label>
                    <input
                      type="text"
                      value={identForm.code}
                      onChange={(e) => setIdentForm({ ...identForm, code: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Slogan / Tagline
                    </label>
                    <input
                      type="text"
                      value={identForm.tagline}
                      onChange={(e) => setIdentForm({ ...identForm, tagline: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kabupaten / Wilayah
                    </label>
                    <input
                      type="text"
                      value={identForm.regency}
                      onChange={(e) => setIdentForm({ ...identForm, regency: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Alamat Lengkap Puskesmas
                    </label>
                    <input
                      type="text"
                      value={identForm.address}
                      onChange={(e) => setIdentForm({ ...identForm, address: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nomor WhatsApp Resmi
                    </label>
                    <input
                      type="text"
                      value={identForm.whatsapp}
                      onChange={(e) => setIdentForm({ ...identForm, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Resmi
                    </label>
                    <input
                      type="email"
                      value={identForm.email}
                      onChange={(e) => setIdentForm({ ...identForm, email: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Akun Instagram
                    </label>
                    <input
                      type="text"
                      value={identForm.instagram}
                      onChange={(e) => setIdentForm({ ...identForm, instagram: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Jam Layanan Operasional
                    </label>
                    <input
                      type="text"
                      value={identForm.operationalHours}
                      onChange={(e) => setIdentForm({ ...identForm, operationalHours: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Visi Puskesmas
                    </label>
                    <textarea
                      rows={2}
                      value={identForm.vision}
                      onChange={(e) => setIdentForm({ ...identForm, vision: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Motto Pelayanan
                    </label>
                    <input
                      type="text"
                      value={identForm.motto}
                      onChange={(e) => setIdentForm({ ...identForm, motto: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= TAB 3: TEKS BERJALAN (MARQUEE) ================= */}
          {activeTab === 'marquee' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Type className="w-5 h-5 text-cyan-600" />
                    <span>Pengaturan Teks Berjalan (Running Text Marquee)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Teks berjalan di bilah teratas halaman untuk berita darurat, jadwal imunisasi, atau sosialisasi CKG
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveMarquee}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Teks Berjalan</span>
                </button>
              </div>

              {/* Live Preview Box of Marquee */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Pratinjau Langsung (Live Preview):
                </span>
                
                {marqForm.enabled ? (
                  <div className={`p-2.5 rounded-xl text-white text-xs overflow-hidden flex items-center shadow-xs ${
                    marqForm.variant === 'amber'
                      ? 'bg-amber-600'
                      : marqForm.variant === 'rose'
                      ? 'bg-rose-700'
                      : marqForm.variant === 'blue'
                      ? 'bg-blue-700'
                      : 'bg-emerald-700 dark:bg-emerald-950'
                  }`}>
                    <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-black shrink-0 mr-3 uppercase">
                      {marqForm.badge || 'INFO'}
                    </span>
                    <div className="whitespace-nowrap overflow-hidden flex-1">
                      <div className="inline-block animate-marquee font-medium">
                        {marqForm.text} • Hotline: {marqForm.hotline}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-400 text-center italic">
                    Teks berjalan saat ini dinonaktifkan
                  </div>
                )}
              </div>

              {/* Marquee Configuration Form */}
              <form onSubmit={handleSaveMarquee} className="space-y-4 pt-2">
                
                {/* Switch Enabled */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Aktifkan Teks Berjalan di Halaman Depan
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Tampilkan marquee pengumuman di header web secara otomatis
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marqForm.enabled}
                      onChange={(e) => setMarqForm({ ...marqForm, enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Isi Pesan Teks Berjalan Utama:
                  </label>
                  <textarea
                    rows={3}
                    value={marqForm.text}
                    onChange={(e) => setMarqForm({ ...marqForm, text: e.target.value })}
                    placeholder="Tuliskan pengumuman yang akan berjalan di atas..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Gunakan pemisah tanda titik tengah (•) untuk membedakan antar pengumuman.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Label Badge Teks:
                    </label>
                    <input
                      type="text"
                      value={marqForm.badge}
                      onChange={(e) => setMarqForm({ ...marqForm, badge: e.target.value })}
                      placeholder="PENGUMUMAN RESMI"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Nomor Hotline / Kontak Cepat:
                    </label>
                    <input
                      type="text"
                      value={marqForm.hotline}
                      onChange={(e) => setMarqForm({ ...marqForm, hotline: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Warna Tema Banner:
                    </label>
                    <select
                      value={marqForm.variant}
                      onChange={(e) => setMarqForm({ ...marqForm, variant: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="emerald">Hijau Emerald (Standar Kesehatan)</option>
                      <option value="cyan">Cyan / Biru Laut (Promosi / Informatif)</option>
                      <option value="amber">Amber / Oranye (Pemberitahuan Penting)</option>
                      <option value="rose">Merah Rose (Darurat / Tanggap Darurat)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Terapkan Teks Berjalan</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= TAB 4: GALERI DRIVE & THUMBNAIL ORGANIZER ================= */}
          {activeTab === 'gallery' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-indigo-600" />
                    <span>Galeri Penampil Isi Drive & Thumbnail Organizer</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lihat foto Google Drive langsung dengan thumbnail visual, kelola berkas, atau jadikan logo aktif
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {driveGallery.length} Foto Terdaftar
                  </span>
                </div>
              </div>

              {/* Upload Form to Drive */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Daftarkan / Tautkan Gambar Baru dari Drive:
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Mendukung upload lokal / link Google Drive
                  </span>
                </div>

                <form onSubmit={handleAddDriveFile} className="grid md:grid-cols-12 gap-3">
                  <div className="md:col-span-4">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Pilih Berkas dari Komputer/HP:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUploadSim}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Nama Berkas:
                    </label>
                    <input
                      type="text"
                      value={uploadFileName}
                      onChange={(e) => setUploadFileName(e.target.value)}
                      placeholder="Logo-Puskesmas-2026.png"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                      required
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                      Kategori:
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    >
                      <option value="logo">Logo Puskesmas</option>
                      <option value="banner">Banner & Header</option>
                      <option value="dokumentasi">Dokumentasi Kegiatan</option>
                      <option value="berkas">Sertifikat / Berkas</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Visual Thumbnail Gallery Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {driveGallery.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col justify-between hover:border-indigo-500 transition-all duration-200 shadow-xs"
                  >
                    {/* Thumbnail Image Container */}
                    <div className="relative aspect-video w-full bg-slate-200 dark:bg-slate-900 overflow-hidden">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to placeholder if broken
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
                        {item.category}
                      </span>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-white">
                        {item.size}
                      </span>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1" title={item.name}>
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Diunggah: {item.uploadedAt}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center gap-1.5">
                        
                        {/* Set As Logo Button */}
                        <button
                          type="button"
                          onClick={() => handleSetAsActiveLogo(item)}
                          className="flex-1 py-1.5 px-2 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold rounded-lg transition text-center truncate"
                        >
                          Set Logo
                        </button>

                        {/* Open in Drive */}
                        <a
                          href={item.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white rounded-lg text-slate-600 dark:text-slate-300 transition"
                          title="Buka File di Google Drive"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Copy Link */}
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(item.thumbnailUrl);
                            showToast('URL Gambar berhasil disalin!');
                          }}
                          className="p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white rounded-lg text-slate-600 dark:text-slate-300 transition"
                          title="Salin Link Thumbnail"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeleteDriveFile(item.id)}
                          className="p-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition"
                          title="Hapus dari Galeri"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 5: MITRA PELAYANAN (CRUD) ================= */}
          {activeTab === 'mitra' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-600" />
                    <span>Daftar Mitra Jaringan & Jejaring Pelayanan</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola Pustu (Puskesmas Pembantu), UPKDK, Posyandu, Klinik Pratama, dan TPMD di 14 Desa/Kelurahan
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddMitra}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Mitra Faskes</span>
                </button>
              </div>

              {/* Table of Mitra */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Nama Faskes / Mitra</th>
                      <th className="p-3">Tipe</th>
                      <th className="p-3">Desa / Kelurahan</th>
                      <th className="p-3">Penanggung Jawab (PIC)</th>
                      <th className="p-3">Jam Layanan</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {mitraList.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          <div>{m.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{m.address}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            m.type === 'Pustu'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : m.type === 'Posyandu'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}>
                            {m.type}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-300">{m.village}</td>
                        <td className="p-3">
                          <div className="font-medium text-slate-800 dark:text-slate-200">{m.pic}</div>
                          <div className="text-[10px] text-slate-400">{m.phone}</div>
                        </td>
                        <td className="p-3 text-slate-500">{m.operationalHours}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditMitra(m)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-600 hover:text-white transition"
                              title="Ubah Data Mitra"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMitra(m.id, m.name)}
                              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                              title="Hapus Mitra"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ================= TAB 6: POLIKLINIK & LAYANAN ================= */}
          {activeTab === 'services' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span>Daftar Poliklinik & Layanan Rawat Jalan</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sesuaikan jadwal, ruangan, dan dokter penanggung jawab setiap poli
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{svc.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          {svc.room}
                        </span>
                        {svc.bpjsCovered && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Gratis BPJS
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{svc.description}</p>
                      <div className="text-[10px] text-slate-400">
                        Jadwal: <strong>{svc.schedule}</strong> • PIC: {svc.doctorPic}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newSched = prompt(`Ubah jadwal untuk ${svc.name}:`, svc.schedule);
                          if (newSched !== null && newSched.trim()) {
                            onUpdateServices(services.map((s) => s.id === svc.id ? { ...s, schedule: newSched.trim() } : s));
                            showToast(`Jadwal ${svc.name} diperbarui!`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                      >
                        Ubah Jadwal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 7: GATEWAY SISTEM DIGITAL ================= */}
          {activeTab === 'systems' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-violet-600" />
                    <span>Gateway Sistem Digital & Tautan Eksternal</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola tautan SP4N LAPOR, SATUSEHAT, Mobile JKN, dan sistem lainnya
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {systems.map((sys) => (
                  <div
                    key={sys.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{sys.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {sys.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{sys.description}</p>
                      <div className="text-[10px] font-mono text-slate-400 mt-1 truncate">{sys.url}</div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <button
                        onClick={() => {
                          const newUrl = prompt(`Ubah URL untuk ${sys.name}:`, sys.url);
                          if (newUrl !== null && newUrl.trim()) {
                            onUpdateSystems(systems.map((s) => s.id === sys.id ? { ...s, url: newUrl.trim() } : s));
                            showToast(`URL ${sys.name} diperbarui!`);
                          }
                        }}
                        className="text-xs font-bold text-violet-600 hover:underline"
                      >
                        Ganti Tautan URL
                      </button>
                      <a
                        href={sys.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                      >
                        <span>Cek Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 8: BERITA & PENGUMUMAN ================= */}
          {activeTab === 'news' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-orange-600" />
                    <span>Daftar Berita & Pengumuman Publik</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Informasi kegiatan, penyuluhan, dan edukasi kesehatan untuk masyarakat
                  </p>
                </div>

                <button
                  onClick={() => {
                    const title = prompt('Judul Berita/Pengumuman:');
                    if (!title) return;
                    const content = prompt('Isi Ringkas:');
                    if (!content) return;
                    const newItem: NewsAnnouncement = {
                      id: `news-${Date.now()}`,
                      title,
                      category: 'Pengumuman',
                      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
                      excerpt: content.slice(0, 80) + '...',
                      content,
                      author: 'Admin Puskesmas'
                    };
                    onUpdateNewsList([newItem, ...newsList]);
                    showToast('Berita baru berhasil ditambahkan!');
                  }}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Berita</span>
                </button>
              </div>

              <div className="space-y-3">
                {newsList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.excerpt}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Hapus berita "${item.title}"?`)) {
                          onUpdateNewsList(newsList.filter((n) => n.id !== item.id));
                          showToast('Berita telah dihapus');
                        }
                      }}
                      className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs"
                      title="Hapus Berita"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 9: KODE GOOGLE APPS SCRIPT ================= */}
          {activeTab === 'appscript' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-rose-600" />
                    <span>Kode Google Apps Script (GAS) & Integrasi Drive / Spreadsheet</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gunakan kode ini di Google Apps Script untuk otomatisasi unggah foto ke Drive dan sinkronisasi data
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyScriptToClipboard}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 self-start sm:self-auto"
                >
                  {copiedScript ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedScript ? 'Tersalin!' : 'Salin Seluruh Kode'}</span>
                </button>
              </div>

              {/* Instructions Guide */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <span>Langkah-Langkah Pemasangan di Google Akun Puskesmas:</span>
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <li>Buka <strong>script.google.com</strong> dengan akun Google Puskesmas Kepanjen.</li>
                  <li>Buat folder baru di Google Drive bernama <em>"SIPANDU_LOGO_FOTO"</em>, lalu salin Folder ID dari URL browser.</li>
                  <li>Buat proyek baru di Google Apps Script, hapus semua kode bawaan, dan <strong>Paste kode di bawah ini</strong>.</li>
                  <li>Ganti variabel <code>DRIVE_FOLDER_ID</code> dengan ID folder Anda.</li>
                  <li>Klik <strong>Deploy &rarr; New Deployment &rarr; Pilih Web App</strong>. Atur: <em>Who has access</em> = <strong>Anyone (Siapa saja)</strong>.</li>
                  <li>Salin <strong>Web App URL</strong> yang dihasilkan dan simpan pada pengaturan sinkronisasi.</li>
                </ol>
              </div>

              {/* Code Snippet Box */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs">
                <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-slate-400">
                  <span className="font-bold text-slate-300">Code.gs (Google Apps Script Backend)</span>
                  <button
                    onClick={copyScriptToClipboard}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kode</span>
                  </button>
                </div>
                <pre className="p-4 text-emerald-400 overflow-x-auto max-h-[450px] leading-relaxed select-all">
                  {googleAppsScriptCode}
                </pre>
              </div>
            </div>
          )}

          {/* ================= TAB 10: GANTI PASSWORD & KEAMANAN ================= */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-emerald-600" />
                  <span>Keamanan & Ubah Kata Sandi Admin</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ganti password bawaan (<em>sipandu123</em>) dengan kata sandi yang lebih aman untuk tim administrator
                </p>
              </div>

              {pwdError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 rounded-xl border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{pwdError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kata Sandi Lama / Saat Ini:
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={currentPwdInput}
                      onChange={(e) => setCurrentPwdInput(e.target.value)}
                      placeholder="Masukkan kata sandi saat ini..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kata Sandi Baru:
                  </label>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={newPwdInput}
                    onChange={(e) => setNewPwdInput(e.target.value)}
                    placeholder="Minimal 6 karakter..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Konfirmasi Kata Sandi Baru:
                  </label>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={confirmPwdInput}
                    onChange={(e) => setConfirmPwdInput(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="text-xs text-slate-400 hover:text-rose-500 underline"
                  >
                    Reset ke sipandu123
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Perbarui Kata Sandi</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL EDIT / ADD MITRA                                   */}
      {/* ======================================================== */}
      {isMitraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {editingMitraId ? 'Ubah Data Mitra Faskes' : 'Tambah Mitra Pelayanan Baru'}
              </h3>
              <button
                onClick={() => setIsMitraModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMitra} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Fasilitas / Posyandu:
                </label>
                <input
                  type="text"
                  value={mitraForm.name}
                  onChange={(e) => setMitraForm({ ...mitraForm, name: e.target.value })}
                  placeholder="Contoh: Pustu Curungrejo atau Posyandu Melati"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipe Faskes:
                  </label>
                  <select
                    value={mitraForm.type}
                    onChange={(e) => setMitraForm({ ...mitraForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    <option value="Pustu">Pustu (Puskesmas Pembantu)</option>
                    <option value="Posyandu">Posyandu ILP Siklus Hidup</option>
                    <option value="UPKDK">UPKDK (Unit Pengelola Desa)</option>
                    <option value="Klinik">Klinik Pratama Swasta</option>
                    <option value="TPMD">TPMD (Dokter / Bidan Mandiri)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Desa / Kelurahan:
                  </label>
                  <select
                    value={mitraForm.village}
                    onChange={(e) => setMitraForm({ ...mitraForm, village: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  >
                    {VILLAGES_KEPANJEN.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alamat Lengkap:
                </label>
                <input
                  type="text"
                  value={mitraForm.address}
                  onChange={(e) => setMitraForm({ ...mitraForm, address: e.target.value })}
                  placeholder="Jl. Raya ..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Penanggung Jawab (PIC):
                  </label>
                  <input
                    type="text"
                    value={mitraForm.pic}
                    onChange={(e) => setMitraForm({ ...mitraForm, pic: e.target.value })}
                    placeholder="Bdn. Siti ..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Telepon / WhatsApp:
                  </label>
                  <input
                    type="text"
                    value={mitraForm.phone}
                    onChange={(e) => setMitraForm({ ...mitraForm, phone: e.target.value })}
                    placeholder="08123456789"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Jam Operasional:
                </label>
                <input
                  type="text"
                  value={mitraForm.operationalHours}
                  onChange={(e) => setMitraForm({ ...mitraForm, operationalHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMitraModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
                >
                  Simpan Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function LayoutGridIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
