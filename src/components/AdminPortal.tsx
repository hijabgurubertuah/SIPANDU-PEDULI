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
  FileSpreadsheet,
  Smartphone,
  Activity,
  HeartPulse,
  MessageCircle,
  LayoutGrid,
  Info
} from 'lucide-react';
import {
  SiteSettings,
  MarqueeSettings,
  HealthPostMitra,
  DriveFileItem,
  ServiceItem,
  DigitalSystemItem,
  NewsAnnouncement,
  MobileDockConfig,
  MobileDockItem
} from '../types';
import { VILLAGES_KEPANJEN, DEFAULT_DOCK_CONFIG } from '../data/mockData';
import FirebaseStatusTab from './FirebaseStatusTab';
import { getSyncCachedImage } from '../lib/imageCache';
import {
  saveSiteSettingsToFirestore,
  saveMarqueeSettingsToFirestore,
  saveDockConfigToFirestore,
  saveMitraToFirestore,
  saveServicesToFirestore,
  saveSystemsToFirestore,
  saveNewsToFirestore,
  saveGalleryToFirestore
} from '../lib/firebase';

interface AdminPortalProps {
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (newSettings: SiteSettings) => void;
  marqueeSettings: MarqueeSettings;
  onUpdateMarqueeSettings: (newMarquee: MarqueeSettings) => void;
  dockConfig: MobileDockConfig;
  onUpdateDockConfig: (newDock: MobileDockConfig) => void;
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
  onOpenPegawaiPortal?: () => void;
  onRefreshData?: () => Promise<void>;
}

export default function AdminPortal({
  siteSettings,
  onUpdateSiteSettings,
  marqueeSettings,
  onUpdateMarqueeSettings,
  dockConfig,
  onUpdateDockConfig,
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
  onExitAdmin,
  onOpenPegawaiPortal,
  onRefreshData
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
    | 'dock'
    | 'gallery'
    | 'mitra'
    | 'services'
    | 'systems'
    | 'news'
    | 'appscript'
    | 'security'
    | 'firebase'
    | 'pegawai'
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

  // 2b. Mobile Dock Settings Form
  const [dockForm, setDockForm] = useState<MobileDockConfig>(dockConfig);

  // Gallery Filter State
  const [galleryFilter, setGalleryFilter] = useState<string>('all');

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
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);

  // 5. Password Change Form
  const [currentPwdInput, setCurrentPwdInput] = useState('');
  const [newPwdInput, setNewPwdInput] = useState('');
  const [confirmPwdInput, setConfirmPwdInput] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // 6. Apps Script Settings
  const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlnTOpIX84wHErTrqXRV9lFMCxCoxwcwWKQEMUb988UrB3FERMdi_HceZM5P3yh9bUKQ/exec';
  const [appScriptUrl, setAppScriptUrl] = useState(() => localStorage.getItem('sipandu_gas_url') || DEFAULT_APPS_SCRIPT_URL);
  const [driveFolderId, setDriveFolderId] = useState(() => localStorage.getItem('sipandu_drive_folder_id') || '');
  const [copiedScript, setCopiedScript] = useState(false);

  // 7. Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceForm, setServiceForm] = useState<ServiceItem>({
    id: '',
    name: '',
    category: 'Pemeriksaan Umum',
    schedule: 'Senin - Sabtu: 07.30 - 14.00 WIB',
    description: '',
    requirements: ['Kartu Identitas (KTP / KK)', 'Kartu BPJS Kesehatan (jika ada)'],
    flow: ['Ambil Nomor Antrean', 'Pendaftaran di Loket', 'Pemeriksaan di Poli', 'Pengambilan Obat / Kasir'],
    tariff: 'Gratis (Peserta BPJS) / Retribusi Rp 10.000 (Umum)',
    room: 'Lantai 1 - Ruang Poli',
    doctorPic: 'dr. Petugas Medis',
    bpjsCovered: true
  });

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
  // SAVE HANDLERS (Simpan ke Firebase Firestore & Lokal)
  // ----------------------------------------------------
  const [isSavingCloud, setIsSavingCloud] = useState(false);

  const handleSaveIdentity = async (e: FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings(identForm);
    setIsSavingCloud(true);
    try {
      await saveSiteSettingsToFirestore(identForm);
      showToast('Identitas & Logo berhasil disimpan ke Firebase Firestore!');
    } catch (err: any) {
      showToast('Disimpan lokal. Status Cloud: ' + (err.message || 'Offline'));
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleSaveMarquee = async (e: FormEvent) => {
    e.preventDefault();
    onUpdateMarqueeSettings(marqForm);
    setIsSavingCloud(true);
    try {
      await saveMarqueeSettingsToFirestore(marqForm);
      showToast('Pengaturan Teks Berjalan berhasil disimpan ke Firebase Firestore!');
    } catch (err: any) {
      showToast('Disimpan lokal. Status Cloud: ' + (err.message || 'Offline'));
    } finally {
      setIsSavingCloud(false);
    }
  };

  // Docker Mobile Management Handlers
  const handleSaveDock = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    onUpdateDockConfig(dockForm);
    setIsSavingCloud(true);
    try {
      await saveDockConfigToFirestore(dockForm);
      showToast('Konfigurasi Docker Mobile berhasil disimpan ke Firebase Firestore!');
    } catch (err: any) {
      showToast('Disimpan lokal. Status Cloud: ' + (err.message || 'Offline'));
    } finally {
      setIsSavingCloud(false);
    }
  };

  // Explicit Save Handlers for remaining tabs to prevent unwanted quota usage
  const handleSyncMitraToFirestore = async () => {
    setIsSavingCloud(true);
    try {
      await saveMitraToFirestore(mitraList);
      showToast('Daftar seluruh Mitra Pelayanan Faskes berhasil disimpan ke Firebase Firestore!');
    } catch (err: any) {
      showToast('Gagal simpan ke Firebase: ' + (err.message || 'Error'));
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleSyncServicesToFirestore = async () => {
    setIsSavingCloud(true);
    try {
      await saveServicesToFirestore(services);
      showToast('Daftar Poliklinik & Layanan berhasil disimpan ke Firebase Firestore!');
    } catch (err: any) {
      showToast('Gagal simpan ke Firebase: ' + (err.message || 'Error'));
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleSyncSystemsToFirestore = async () => {
    setIsSavingCloud(true);
    try {
      await saveSystemsToFirestore(systems);
      showToast('Daftar Gateway Sistem Digital berhasil disimpan ke Firebase Firestore!');
    } catch (err: any) {
      showToast('Gagal simpan ke Firebase: ' + (err.message || 'Error'));
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleSyncNewsToFirestore = async () => {
    setIsSavingCloud(true);
    try {
      await saveNewsToFirestore(newsList);
      showToast('Daftar Berita & Pengumuman berhasil disimpan ke Firebase Firestore!');
    } catch (err: any) {
      showToast('Gagal simpan ke Firebase: ' + (err.message || 'Error'));
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleSyncGalleryToFirestore = async () => {
    setIsSavingCloud(true);
    try {
      await saveGalleryToFirestore(driveGallery);
      showToast('Daftar Galeri & Tautan Drive berhasil disimpan ke Firebase Firestore!');
    } catch (err: any) {
      showToast('Gagal simpan ke Firebase: ' + (err.message || 'Error'));
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleUpdateDockItem = (id: string, updates: Partial<MobileDockItem>) => {
    setDockForm((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    }));
  };

  const handleToggleDockItem = (id: string) => {
    setDockForm((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, isEnabled: !item.isEnabled } : item))
    }));
  };

  const handleDeleteDockItem = (id: string) => {
    if (id === 'dock-menu') {
      alert('Tombol Menu Sidebar (paling kiri) wajib ada agar pengunjung HP dapat membuka menu!');
      return;
    }
    setDockForm((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id)
    }));
    showToast('Tombol docker berhasil dihapus.');
  };

  const handleAddDockItem = () => {
    const newItem: MobileDockItem = {
      id: `dock-custom-${Date.now()}`,
      label: 'Menu Baru',
      icon: 'document',
      actionType: 'tab',
      target: 'dokumen',
      isEnabled: true
    };
    setDockForm((prev) => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    showToast('Tombol baru ditambahkan ke docker.');
  };

  const handleResetDock = () => {
    if (window.confirm('Kembalikan konfigurasi Docker Mobile ke pengaturan bawaan?')) {
      setDockForm(DEFAULT_DOCK_CONFIG);
      onUpdateDockConfig(DEFAULT_DOCK_CONFIG);
      showToast('Docker mobile dikembalikan ke pengaturan bawaan.');
    }
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

  // Services & Poliklinik Handlers
  const handleOpenAddService = () => {
    setEditingServiceId(null);
    setServiceForm({
      id: `svc-${Date.now()}`,
      name: '',
      category: 'Pemeriksaan Umum',
      schedule: 'Senin - Sabtu: 07.30 - 14.00 WIB',
      description: '',
      requirements: ['Kartu Identitas (KTP / KK)', 'Kartu BPJS Kesehatan (jika ada)'],
      flow: ['Ambil Nomor Antrean', 'Pendaftaran di Loket', 'Pemeriksaan di Poli', 'Pengambilan Obat / Kasir'],
      tariff: 'Gratis (Peserta BPJS) / Retribusi Rp 10.000 (Umum)',
      room: 'Lantai 1 - Ruang Poli',
      doctorPic: 'dr. Petugas Medis',
      bpjsCovered: true
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (svc: ServiceItem) => {
    setEditingServiceId(svc.id);
    setServiceForm({ ...svc });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name.trim()) {
      showToast('Nama poliklinik tidak boleh kosong!');
      return;
    }

    let updatedList: ServiceItem[];
    if (editingServiceId) {
      updatedList = services.map((s) => (s.id === editingServiceId ? serviceForm : s));
      showToast(`Data poliklinik "${serviceForm.name}" berhasil diubah!`);
    } else {
      updatedList = [...services, serviceForm];
      showToast(`Poliklinik baru "${serviceForm.name}" berhasil ditambahkan!`);
    }

    onUpdateServices(updatedList);
    setIsServiceModalOpen(false);

    setIsSavingCloud(true);
    try {
      await saveServicesToFirestore(updatedList);
    } catch (err) {
      // offline silent
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus poliklinik "${name}"?`)) {
      const updatedList = services.filter((s) => s.id !== id);
      onUpdateServices(updatedList);
      showToast(`Poliklinik "${name}" telah dihapus.`);

      setIsSavingCloud(true);
      try {
        await saveServicesToFirestore(updatedList);
      } catch (err) {
        // offline silent
      } finally {
        setIsSavingCloud(false);
      }
    }
  };

  // Drive Gallery Handlers
  const handleFileUploadSim = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileObj(file);
    setUploadFileName(file.name);
    // Convert to Base64 for instant preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = reader.result as string;
      setUploadPreviewUrl(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleAddDriveFile = async (e: FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) {
      showToast('Nama file wajib diisi');
      return;
    }

    setIsUploadingToDrive(true);
    let driveFileUrl = uploadDriveUrl.trim();
    let finalThumbnail = uploadPreviewUrl.trim() || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80';
    let detectedFolderId = driveFolderId;

    // Direct upload to Google Apps Script endpoint if configured
    if (appScriptUrl && uploadPreviewUrl && uploadPreviewUrl.startsWith('data:')) {
      try {
        const base64Content = uploadPreviewUrl.split(',')[1] || uploadPreviewUrl;
        const res = await fetch(appScriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'uploadImage',
            fileName: uploadFileName,
            mimeType: selectedFileObj?.type || (uploadFileName.endsWith('.png') ? 'image/png' : 'image/jpeg'),
            base64: base64Content,
            category: uploadCategory,
            folderId: driveFolderId || undefined
          })
        });
        
        if (res.ok) {
          const result = await res.json();
          if (result.status === 'success' || result.thumbnailUrl || result.fileId) {
            if (result.thumbnailUrl) finalThumbnail = result.thumbnailUrl;
            if (result.driveUrl) driveFileUrl = result.driveUrl;
            if (result.folderId) {
              detectedFolderId = result.folderId;
              setDriveFolderId(result.folderId);
              localStorage.setItem('sipandu_drive_folder_id', result.folderId);
            }
          }
        }
      } catch (gasErr) {
        console.warn('Apps Script upload note:', gasErr);
      }
    }

    const newDriveItem: DriveFileItem = {
      id: `drive-${Date.now()}`,
      name: uploadFileName.trim(),
      driveUrl: driveFileUrl || (detectedFolderId ? `https://drive.google.com/drive/folders/${detectedFolderId}` : 'https://drive.google.com'),
      thumbnailUrl: finalThumbnail,
      mimeType: uploadFileName.endsWith('.png') ? 'image/png' : 'image/jpeg',
      size: selectedFileObj ? `${Math.round(selectedFileObj.size / 1024)} KB` : '350 KB',
      category: uploadCategory,
      uploadedAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };

    const updatedGallery = [newDriveItem, ...driveGallery];
    onUpdateDriveGallery(updatedGallery);
    try {
      await saveGalleryToFirestore(updatedGallery);
    } catch (_) {}

    setUploadFileName('');
    setUploadDriveUrl('');
    setUploadPreviewUrl('');
    setSelectedFileObj(null);
    setIsUploadingToDrive(false);
    showToast('Gambar berhasil diunggah ke Galeri Drive & Firebase!');
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
  // LOGIN SCREEN (Minimalist with 3D Rotate-Y Uploaded Logo)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    const cachedLogo = getSyncCachedImage(siteSettings.logoUrl) || siteSettings.logoUrl;

    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-5">
          
          <div className="text-center space-y-2">
            {/* 3D Rotate-Y Uploaded Puskesmas Logo */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white dark:bg-slate-800/90 flex items-center justify-center p-2 shadow-lg shadow-emerald-600/15 border border-emerald-100 dark:border-emerald-900/40 perspective-500">
              {cachedLogo ? (
                <img
                  src={cachedLogo}
                  alt={siteSettings.name || 'Logo Puskesmas'}
                  className="w-12 h-12 object-contain animate-rotate-y select-none pointer-events-none drop-shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center animate-rotate-y shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              )}
            </div>

            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Portal Admin
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {siteSettings.name || 'Puskesmas Kepanjen'}
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
              <div className="relative">
                <input
                  type={showInputPassword ? 'text' : 'password'}
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Kata Sandi Admin..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden pr-10 transition"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowInputPassword(!showInputPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showInputPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExitAdmin}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // NAVIGATION MENU ITEMS (Colorful & Distinct Archetype)
  // ----------------------------------------------------
  const navMenuItems = [
    { id: 'overview', label: 'Ringkasan & Status', icon: LayoutGrid, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'pegawai', label: 'Portal Pegawai Internal', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
    { id: 'firebase', label: 'Status Firebase Cloud', icon: Database, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'identity', label: 'Identitas & Logo', icon: Image, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { id: 'marquee', label: 'Teks Berjalan (Marquee)', icon: Type, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { id: 'dock', label: 'Docker Mobile HP', icon: Smartphone, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
    { id: 'gallery', label: 'Galeri Drive & Thumbnail', icon: HardDrive, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { id: 'mitra', label: 'Mitra Pelayanan Faskes', icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: 'services', label: 'Poliklinik & Layanan', icon: HeartPulse, color: 'text-blue-500', bg: 'bg-blue-500/10' },
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
      {/* TOMBOL KIRI TENGAH UNTUK MEMUNCULKAN SIDEBAR             */}
      {/* Ukuran: Tinggi 120px, Lebar 30px, Rounded, Logo Rotate-Y */}
      {/* ======================================================== */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          title="Buka / Tutup Sidebar Menu CMS"
          aria-label="Buka Sidebar Menu CMS"
          className="w-[30px] h-[120px] bg-gradient-to-b from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white rounded-r-2xl shadow-2xl border-y border-r border-emerald-400/60 flex flex-col items-center justify-between py-3 active:scale-95 transition-all group overflow-hidden cursor-pointer"
        >
          {/* Top grip indicator */}
          <div className="flex flex-col gap-1 items-center opacity-80">
            <span className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-xs" />
            <span className="w-1 h-1 rounded-full bg-emerald-200/80" />
          </div>

          {/* Centered logo with Rotate-Y 3D animation */}
          <div className="w-5 h-5 flex items-center justify-center animate-rotate-y [transform-style:preserve-3d]">
            {siteSettings.logoUrl ? (
              <img
                src={siteSettings.logoUrl}
                alt="Logo Puskesmas"
                className="w-full h-full object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
              />
            ) : (
              <Activity className="w-4 h-4 text-white drop-shadow-xs" />
            )}
          </div>

          {/* Bottom grip indicator */}
          <div className="flex flex-col gap-1 items-center opacity-80">
            <span className="w-1 h-1 rounded-full bg-emerald-200/80" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/90 shadow-xs" />
          </div>
        </button>
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

          {/* Quick Actions (Kembali ke Publik & Keluar Sesi) */}
          <div className="space-y-2 pt-1">
            <button
              onClick={onExitAdmin}
              className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              <span>Lihat Halaman Publik</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950 text-rose-600 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Sesi CMS</span>
            </button>
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

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    onExitAdmin();
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-600" />
                  <span>Lihat Tampilan Publik</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Sesi CMS</span>
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
              
              {/* Colorful Professional Action Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
                
                {/* 1. Logo Puskesmas */}
                <button
                  type="button"
                  onClick={() => setActiveTab('identity')}
                  className="p-4 rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-gradient-to-br from-teal-50 to-emerald-50/50 dark:from-teal-950/40 dark:to-emerald-950/20 hover:from-teal-100 hover:to-emerald-100 dark:hover:from-teal-900/60 text-left transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <Image className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800 dark:bg-teal-900/80 dark:text-teal-200">
                      {siteSettings.logoUrl ? 'Kustom' : 'Default'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors">
                      Logo Puskesmas
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Atur logo & identitas web
                    </p>
                  </div>
                </button>

                {/* 2. Running Text (Marquee) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('marquee')}
                  className="p-4 rounded-2xl border border-cyan-200 dark:border-cyan-900/60 bg-gradient-to-br from-cyan-50 to-blue-50/50 dark:from-cyan-950/40 dark:to-blue-950/20 hover:from-cyan-100 hover:to-blue-100 dark:hover:from-cyan-900/60 text-left transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <Type className="w-5 h-5" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${marqueeSettings.enabled ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {marqueeSettings.enabled ? 'Aktif' : 'Off'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-cyan-600 transition-colors">
                      Running Text
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Teks pengumuman berjalan
                    </p>
                  </div>
                </button>

                {/* 3. Docker Mobile HP */}
                <button
                  type="button"
                  onClick={() => setActiveTab('dock')}
                  className="p-4 rounded-2xl border border-fuchsia-200 dark:border-fuchsia-900/60 bg-gradient-to-br from-fuchsia-50 to-pink-50/50 dark:from-fuchsia-950/40 dark:to-pink-950/20 hover:from-fuchsia-100 hover:to-pink-100 dark:hover:from-fuchsia-900/60 text-left transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-fuchsia-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/80 dark:text-fuchsia-200">
                      {dockConfig.enabled ? `${dockConfig.items.filter(i => i.isEnabled).length} Tombol` : 'Off'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-fuchsia-600 transition-colors">
                      Docker Mobile HP
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Navigasi bawah smartphone
                    </p>
                  </div>
                </button>

                {/* 4. Poliklinik & Layanan */}
                <button
                  type="button"
                  onClick={() => setActiveTab('services')}
                  className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/20 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/60 text-left transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-200">
                      {services.length} Poli
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      Jadwal & Layanan Poli
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Ubah jadwal & dokter poli
                    </p>
                  </div>
                </button>

                {/* 5. Mitra Pelayanan */}
                <button
                  type="button"
                  onClick={() => setActiveTab('mitra')}
                  className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/40 dark:to-orange-950/20 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/60 text-left transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200">
                      {mitraList.length} Mitra
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                      Mitra Faskes & Posyandu
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Pustu, Posyandu ILP & TPMD
                    </p>
                  </div>
                </button>

                {/* 6. Gateway Sistem Digital */}
                <button
                  type="button"
                  onClick={() => setActiveTab('systems')}
                  className="p-4 rounded-2xl border border-violet-200 dark:border-violet-900/60 bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-950/40 dark:to-purple-950/20 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/60 text-left transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-violet-100 text-violet-800 dark:bg-violet-900/80 dark:text-violet-200">
                      {systems.length} Aplikasi
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">
                      Gateway Sistem Digital
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Tautan SIMPUS, BPJS, e-Kinerja
                    </p>
                  </div>
                </button>

                {/* 7. Galeri Drive */}
                <button
                  type="button"
                  onClick={() => setActiveTab('gallery')}
                  className="p-4 rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-gradient-to-br from-sky-50 to-blue-50/50 dark:from-sky-950/40 dark:to-blue-950/20 hover:from-sky-100 hover:to-blue-100 dark:hover:from-sky-900/60 text-left transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 dark:bg-sky-900/80 dark:text-sky-200">
                      {driveGallery.length} Berkas
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
                      Galeri & Drive
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Kelola gambar & dokumen
                    </p>
                  </div>
                </button>

                {/* 8. Berita & Pengumuman */}
                <button
                  type="button"
                  onClick={() => setActiveTab('news')}
                  className="p-4 rounded-2xl border border-orange-200 dark:border-orange-900/60 bg-gradient-to-br from-orange-50 to-amber-50/50 dark:from-orange-950/40 dark:to-amber-950/20 hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-900/60 text-left transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-800 dark:bg-orange-900/80 dark:text-orange-200">
                      {newsList.length} Item
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                      Berita & Pengumuman
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Kabar kesehatan & edukasi
                    </p>
                  </div>
                </button>

                {/* 9. Portal Pegawai Internal */}
                <button
                  type="button"
                  onClick={() => setActiveTab('pegawai')}
                  className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-teal-950/20 hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/60 text-left transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200">
                      Pegawai
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                      Portal Pegawai Internal
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      E-Kinerja, SOP & Logbook
                    </p>
                  </div>
                </button>

                {/* 10. Status Firebase Cloud */}
                <button
                  type="button"
                  onClick={() => setActiveTab('firebase')}
                  className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-gradient-to-br from-rose-50 to-red-50/50 dark:from-rose-950/40 dark:to-red-950/20 hover:from-rose-100 hover:to-red-100 dark:hover:from-rose-900/60 text-left transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <Database className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-200">
                      Cloud
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                      Status Firebase Cloud
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Database & real-time sync
                    </p>
                  </div>
                </button>

                {/* 11. Kode Apps Script */}
                <button
                  type="button"
                  onClick={() => setActiveTab('appscript')}
                  className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50 to-violet-50/50 dark:from-indigo-950/40 dark:to-violet-950/20 hover:from-indigo-100 hover:to-violet-100 dark:hover:from-indigo-900/60 text-left transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <Code className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 dark:bg-indigo-900/80 dark:text-indigo-200">
                      Sync
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      Apps Script & Drive
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Kode automasi backend
                    </p>
                  </div>
                </button>

                {/* 12. Keamanan & Sandi */}
                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-800 text-left transition shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-slate-700 dark:bg-slate-800 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      Sandi
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                      Ganti Sandi Admin
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Keamanan akun CMS
                    </p>
                  </div>
                </button>

              </div>

              {/* Prominent Save Button at Bottom */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-center">
                <button
                  type="button"
                  onClick={handleSyncServicesToFirestore}
                  disabled={isSavingCloud}
                  className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-w-[220px]"
                >
                  <Save className="w-5 h-5" />
                  <span>{isSavingCloud ? 'Menyimpan...' : 'Simpan'}</span>
                </button>
              </div>

            </div>
          )}

          {/* ================= TAB: PORTAL PEGAWAI INTERNAL ================= */}
          {activeTab === 'pegawai' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-6 text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-xs">
                <Building2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Portal Pegawai Internal
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Ruang kerja digital untuk staf dan tenaga kesehatan Puskesmas Kepanjen: manajemen SOP, data indikator mutu faskes, logbook, e-kinerja, dan pengajuan cuti terpadu.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenPegawaiPortal) {
                      onOpenPegawaiPortal();
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Buka Portal Pegawai Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  Kembali ke Ringkasan
                </button>
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
                    disabled={isSavingCloud}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingCloud ? 'Menyimpan ke Cloud...' : 'Simpan Identitas ke Firebase Firestore'}</span>
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
                  disabled={isSavingCloud}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 self-start sm:self-auto cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingCloud ? 'Menyimpan...' : 'Simpan Marquee ke Firebase Firestore'}</span>
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

          {/* ================= TAB 3B: DOCKER MOBILE (HP) ================= */}
          {activeTab === 'dock' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-fuchsia-600" />
                    <span>Pengaturan Tombol Navigasi Docker Mobile</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola menu navigasi bawah ponsel. Setiap menu dapat ditambah, diubah ikon dan tujuannya, atau dihapus.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleResetDock}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
                  >
                    Reset Bawaan
                  </button>
                  <button
                    type="button"
                    onClick={handleAddDockItem}
                    className="px-3.5 py-2 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/50 text-fuchsia-700 dark:text-fuchsia-300 hover:bg-fuchsia-100 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Menu</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDock}
                    disabled={isSavingCloud}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingCloud ? 'Menyimpan...' : 'Simpan'}</span>
                  </button>
                </div>
              </div>

              {/* Minimalist Options Strip */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 grid sm:grid-cols-3 gap-3">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Aktifkan Docker HP
                  </span>
                  <input
                    type="checkbox"
                    checked={dockForm.enabled}
                    onChange={(e) => setDockForm({ ...dockForm, enabled: e.target.checked })}
                    className="w-4 h-4 accent-fuchsia-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Glassmorphism Blur
                  </span>
                  <input
                    type="checkbox"
                    checked={dockForm.blurEffect}
                    onChange={(e) => setDockForm({ ...dockForm, blurEffect: e.target.checked })}
                    className="w-4 h-4 accent-fuchsia-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Tampilkan Label Teks
                  </span>
                  <input
                    type="checkbox"
                    checked={dockForm.showLabels}
                    onChange={(e) => setDockForm({ ...dockForm, showLabels: e.target.checked })}
                    className="w-4 h-4 accent-fuchsia-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Clean List of Dock Items (Tab Formats) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Daftar Tab Menu Docker ({dockForm.items.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Urutan navigasi dari kiri ke kanan di layar ponsel
                  </span>
                </div>

                <div className="grid gap-3">
                  {dockForm.items.map((item, index) => {
                    const isFirstMenu = item.id === 'dock-menu';
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          item.isEnabled
                            ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'
                        }`}
                      >
                        {/* Tab Header */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-xl bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300 text-xs font-black flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>

                            {/* Icon Visual Badge */}
                            <div className={`p-1.5 rounded-lg ${item.isHighlight ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-fuchsia-600 dark:text-fuchsia-400'}`}>
                              {item.icon === 'menu' && <Menu className="w-4 h-4" />}
                              {item.icon === 'home' && <Activity className="w-4 h-4" />}
                              {item.icon === 'services' && <Building2 className="w-4 h-4" />}
                              {item.icon === 'document' && <FileSpreadsheet className="w-4 h-4" />}
                              {item.icon === 'mitra' && <Users className="w-4 h-4" />}
                              {item.icon === 'complaint' && <MessageCircle className="w-4 h-4" />}
                              {item.icon === 'phone' && <Phone className="w-4 h-4" />}
                              {item.icon === 'whatsapp' && <MessageCircle className="w-4 h-4 text-emerald-500" />}
                              {item.icon === 'emergency' && <Phone className="w-4 h-4 text-rose-500" />}
                              {item.icon === 'info' && <Info className="w-4 h-4 text-sky-500" />}
                            </div>

                            <div>
                              <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <span>{isFirstMenu ? 'Pemicu Sidebar Mobile' : item.label || 'Tombol Menu'}</span>
                                {item.isHighlight && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-100 text-rose-700 uppercase">
                                    Highlight Merah
                                  </span>
                                )}
                              </h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer">
                              <span>{item.isEnabled ? 'Aktif' : 'Nonaktif'}</span>
                              <input
                                type="checkbox"
                                checked={item.isEnabled}
                                onChange={() => handleToggleDockItem(item.id)}
                                className="w-4 h-4 accent-fuchsia-600 rounded cursor-pointer"
                              />
                            </label>

                            {!isFirstMenu && (
                              <button
                                type="button"
                                onClick={() => handleDeleteDockItem(item.id)}
                                title="Hapus Menu Docker Ini"
                                className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Config Form Grid */}
                        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                          {/* Label */}
                          <div className="md:col-span-1">
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">
                              Label Teks
                            </label>
                            <input
                              type="text"
                              value={item.label}
                              onChange={(e) => handleUpdateDockItem(item.id, { label: e.target.value })}
                              placeholder="Label Menu"
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                            />
                          </div>

                          {/* Icon Selector */}
                          <div className="md:col-span-1">
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">
                              Pilihan Ikon
                            </label>
                            <select
                              value={item.icon}
                              onChange={(e) => handleUpdateDockItem(item.id, { icon: e.target.value as any })}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                            >
                              <option value="menu">Garis 3 (Menu)</option>
                              <option value="home">Beranda (Home)</option>
                              <option value="services">Poli & Layanan</option>
                              <option value="document">Informasi / SPO</option>
                              <option value="mitra">Mitra Faskes</option>
                              <option value="complaint">Aduan Warga</option>
                              <option value="phone">Telepon UGD</option>
                              <option value="whatsapp">Chat WhatsApp</option>
                              <option value="emergency">Panggilan Emergency</option>
                              <option value="info">Info Puskesmas</option>
                            </select>
                          </div>

                          {/* Action Type */}
                          <div className="md:col-span-1">
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">
                              Tipe Aksi
                            </label>
                            <select
                              value={item.actionType}
                              onChange={(e) => handleUpdateDockItem(item.id, { actionType: e.target.value as any })}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                            >
                              <option value="sidebar">Buka Sidebar</option>
                              <option value="tab">Pindah Tab Publik</option>
                              <option value="url">Buka Link URL</option>
                              <option value="tel">Panggil Telepon</option>
                              <option value="scroll">Scroll ke Footer (Info)</option>
                            </select>
                          </div>

                          {/* Target */}
                          <div className="md:col-span-1">
                            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">
                              Target Aksi
                            </label>
                            {item.actionType === 'tab' ? (
                              <select
                                value={item.target || 'beranda'}
                                onChange={(e) => handleUpdateDockItem(item.id, { target: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                              >
                                <option value="beranda">Tab Beranda</option>
                                <option value="layanan">Tab Poliklinik & Layanan</option>
                                <option value="dokumen">Tab Informasi Publik & SPO</option>
                                <option value="mitra">Tab Mitra Faskes</option>
                                <option value="pengaduan">Tab Suara Warga / Aduan</option>
                              </select>
                            ) : item.actionType === 'sidebar' ? (
                              <input
                                type="text"
                                disabled
                                value="Buka Sidebar"
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-400 italic"
                              />
                            ) : (
                              <input
                                type="text"
                                value={item.target || ''}
                                onChange={(e) => handleUpdateDockItem(item.id, { target: e.target.value })}
                                placeholder={item.actionType === 'tel' ? '0341395990' : 'https://...'}
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                              />
                            )}
                          </div>

                          {/* Badge / Highlight */}
                          <div className="md:col-span-1 flex items-center gap-2 pt-4 sm:pt-0">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={item.badge || ''}
                                onChange={(e) => handleUpdateDockItem(item.id, { badge: e.target.value })}
                                placeholder="Badge (e.g. 24h)"
                                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                              />
                            </div>
                            <label className="flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 cursor-pointer shrink-0" title="Tombol Menonjol Merah">
                              <input
                                type="checkbox"
                                checked={!!item.isHighlight}
                                onChange={(e) => handleUpdateDockItem(item.id, { isHighlight: e.target.checked })}
                                className="w-3.5 h-3.5 accent-rose-600 rounded cursor-pointer"
                              />
                              <span>Merah</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleAddDockItem}
                  className="px-4 py-2.5 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-300 hover:bg-fuchsia-100 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Tab Menu Docker Baru</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveDock}
                  disabled={isSavingCloud}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingCloud ? 'Menyimpan...' : 'Simpan Docker ke Firebase'}</span>
                </button>
              </div>

            </div>
          )}

          {/* ================= TAB 4: GALERI DRIVE & THUMBNAIL ORGANIZER ================= */}
          {activeTab === 'gallery' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-indigo-600" />
                    <span>Galeri Drive & Thumbnail Organizer</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola gambar Google Drive dan thumbnail visual secara efisien.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {driveGallery.length} Berkas
                  </span>
                  <button
                    type="button"
                    onClick={handleSyncGalleryToFirestore}
                    disabled={isSavingCloud}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingCloud ? 'Menyimpan...' : 'Simpan'}</span>
                  </button>
                </div>
              </div>

              {/* Minimalist Upload Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-indigo-600" />
                    <span>Unggah Berkas Baru:</span>
                  </div>
                  {appScriptUrl ? (
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Google Apps Script Aktif
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-normal">
                      Penyimpanan lokal & Drive
                    </span>
                  )}
                </div>

                <form onSubmit={handleAddDriveFile} className="grid sm:grid-cols-12 gap-3 text-xs">
                  <div className="sm:col-span-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUploadSim}
                      className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={uploadFileName}
                      onChange={(e) => setUploadFileName(e.target.value)}
                      placeholder="Nama Berkas (e.g. Logo.png)"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                      required
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value as any)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="logo">Logo Puskesmas</option>
                      <option value="banner">Banner & Header</option>
                      <option value="dokumentasi">Dokumentasi Kegiatan</option>
                      <option value="berkas">Sertifikat / Berkas</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={isUploadingToDrive}
                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isUploadingToDrive ? (
                        <span>Unggah...</span>
                      ) : (
                        <>
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Unggah</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Minimalist Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'Semua', count: driveGallery.length },
                  { id: 'logo', label: 'Logo', count: driveGallery.filter(i => i.category === 'logo').length },
                  { id: 'banner', label: 'Banner', count: driveGallery.filter(i => i.category === 'banner').length },
                  { id: 'dokumentasi', label: 'Dokumentasi', count: driveGallery.filter(i => i.category === 'dokumentasi').length },
                  { id: 'berkas', label: 'Berkas', count: driveGallery.filter(i => i.category === 'berkas').length },
                  { id: 'lainnya', label: 'Lainnya', count: driveGallery.filter(i => i.category === 'lainnya').length },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setGalleryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      galleryFilter === cat.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      galleryFilter === cat.id ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Visual Thumbnail Gallery Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {driveGallery
                  .filter(item => galleryFilter === 'all' || item.category === galleryFilter)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="group bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden flex flex-col justify-between hover:border-indigo-500 transition-all duration-200 shadow-xs"
                    >
                      {/* Thumbnail Image Container */}
                      <div className="relative aspect-video w-full bg-slate-200 dark:bg-slate-900 overflow-hidden">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
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
                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={item.name}>
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {item.uploadedAt}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex items-center gap-1.5">
                          {/* Set As Logo Button */}
                          <button
                            type="button"
                            onClick={() => handleSetAsActiveLogo(item)}
                            className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition text-center truncate cursor-pointer"
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
                            className="p-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white rounded-lg text-slate-600 dark:text-slate-300 transition cursor-pointer"
                            title="Salin Link Thumbnail"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteDriveFile(item.id)}
                            className="p-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition cursor-pointer"
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
                    Kelola Pustu (Puskesmas Pembantu), UPKDK, 108 Posyandu, Klinik Pratama, dan TPMD di 18 Desa/Kelurahan
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleSyncMitraToFirestore}
                    disabled={isSavingCloud}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingCloud ? 'Menyimpan...' : 'Simpan Mitra ke Firebase'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddMitra}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Mitra Faskes</span>
                  </button>
                </div>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-blue-600" />
                    <span>Daftar Poliklinik & Layanan Rawat Jalan</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sesuaikan jadwal operasional, ruangan, dokter penanggung jawab, dan jaminan BPJS setiap poliklinik
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleOpenAddService}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Poliklinik Baru</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSyncServicesToFirestore}
                    disabled={isSavingCloud}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingCloud ? 'Menyimpan...' : 'Simpan Ke Firebase'}</span>
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-4 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            {svc.category} • {svc.room}
                          </span>
                          <h3 className="text-sm font-black text-slate-900 dark:text-white">
                            {svc.name}
                          </h3>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${svc.bpjsCovered ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                          {svc.bpjsCovered ? 'Gratis BPJS' : 'Umum'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {svc.description}
                      </p>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1 text-xs">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{svc.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>PIC Medis: <strong>{svc.doctorPic}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <button
                        type="button"
                        onClick={() => handleDeleteService(svc.id, svc.name)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold transition cursor-pointer"
                      >
                        Hapus
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditService(svc)}
                        className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Ubah Jadwal & Detail</span>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-violet-600" />
                    <span>Gateway Sistem Digital & Tautan Eksternal</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Kelola tautan SP4N LAPOR, SATUSEHAT, Mobile JKN, dan sistem lainnya
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSyncSystemsToFirestore}
                  disabled={isSavingCloud}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingCloud ? 'Menyimpan...' : 'Simpan Sistem ke Firebase'}</span>
                </button>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-orange-600" />
                    <span>Daftar Berita & Pengumuman Publik</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Informasi kegiatan, penyuluhan, dan edukasi kesehatan untuk masyarakat
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleSyncNewsToFirestore}
                    disabled={isSavingCloud}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingCloud ? 'Menyimpan...' : 'Simpan Berita ke Firebase'}</span>
                  </button>
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
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Berita</span>
                  </button>
                </div>
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
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-rose-600" />
                    <span>Pengaturan Integrasi Google Apps Script & Drive</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Konfigurasi endpoint Web App untuk unggah gambar dan sinkronisasi
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyScriptToClipboard}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                >
                  {copiedScript ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedScript ? 'Kode Tersalin' : 'Salin Code.gs'}</span>
                </button>
              </div>

              {/* Minimalist GAS Settings Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    URL Web App Google Apps Script
                  </label>
                  <input
                    type="url"
                    value={appScriptUrl}
                    onChange={(e) => {
                      setAppScriptUrl(e.target.value);
                      localStorage.setItem('sipandu_gas_url', e.target.value);
                    }}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    ID Folder Google Drive (Opsional / Otomatis)
                  </label>
                  <input
                    type="text"
                    value={driveFolderId}
                    onChange={(e) => {
                      setDriveFolderId(e.target.value);
                      localStorage.setItem('sipandu_drive_folder_id', e.target.value);
                    }}
                    placeholder="ID folder Google Drive (terisi otomatis saat unggahan pertama)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Endpoint aktif digunakan untuk mengunggah logo dan dokumen ke Drive.
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('sipandu_gas_url', appScriptUrl);
                      localStorage.setItem('sipandu_drive_folder_id', driveFolderId);
                      showToast('Pengaturan Google Apps Script berhasil disimpan!');
                    }}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan</span>
                  </button>
                </div>
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

          {/* ================= TAB: STATUS FIREBASE FIRESTORE ================= */}
          {activeTab === 'firebase' && (
            <FirebaseStatusTab
              siteSettings={siteSettings}
              marqueeSettings={marqueeSettings}
              dockConfig={dockConfig}
              mitraList={mitraList}
              services={services}
              systems={systems}
              newsList={newsList}
              driveGallery={driveGallery}
              onRefreshData={onRefreshData || (async () => {})}
            />
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL EDIT / ADD MITRA                                   */}
      {/* ======================================================== */}
      {isMitraModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            {/* Sticky Header with Close Button Always Visible */}
            <div className="sticky top-0 z-10 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 gap-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {editingMitraId ? 'Ubah Data Mitra Faskes' : 'Tambah Mitra Pelayanan Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsMitraModalOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0 transition cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMitra} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
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
              </div>

              <div className="sticky bottom-0 z-10 shrink-0 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-xs p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMitraModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Simpan Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL EDIT / TAMBAH POLIKLINIK & LAYANAN                 */}
      {/* ======================================================== */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            {/* Sticky Header with Close Button Always Visible */}
            <div className="sticky top-0 z-10 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 gap-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-blue-600" />
                <span>{editingServiceId ? 'Ubah Jadwal & Detail Poliklinik' : 'Tambah Poliklinik Baru'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0 transition cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Poliklinik / Layanan:
                  </label>
                  <input
                    type="text"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    placeholder="Contoh: Poli Pemeriksaan Umum / Poli KIA"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Kategori:
                    </label>
                    <input
                      type="text"
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                      placeholder="Pemeriksaan Umum, KIA, dll"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Ruangan / Lokasi:
                    </label>
                    <input
                      type="text"
                      value={serviceForm.room}
                      onChange={(e) => setServiceForm({ ...serviceForm, room: e.target.value })}
                      placeholder="Lantai 1 - Ruang 02"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jadwal & Jam Operasional:
                  </label>
                  <input
                    type="text"
                    value={serviceForm.schedule}
                    onChange={(e) => setServiceForm({ ...serviceForm, schedule: e.target.value })}
                    placeholder="Contoh: Senin - Sabtu: 07.30 - 14.00 WIB"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Dokter / PIC Medis:
                    </label>
                    <input
                      type="text"
                      value={serviceForm.doctorPic}
                      onChange={(e) => setServiceForm({ ...serviceForm, doctorPic: e.target.value })}
                      placeholder="dr. Anita / Tim Medis"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Status BPJS:
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer text-xs font-bold">
                      <input
                        type="checkbox"
                        checked={serviceForm.bpjsCovered}
                        onChange={(e) => setServiceForm({ ...serviceForm, bpjsCovered: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span>Gratis BPJS Kesehatan</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tarif Retribusi / Biaya:
                  </label>
                  <input
                    type="text"
                    value={serviceForm.tariff}
                    onChange={(e) => setServiceForm({ ...serviceForm, tariff: e.target.value })}
                    placeholder="Gratis (BPJS) / Rp 10.000 (Umum)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Deskripsi Ringkas Layanan:
                  </label>
                  <textarea
                    rows={2}
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    placeholder="Penjelasan singkat mengenai layanan poliklinik..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 z-10 shrink-0 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-xs p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Simpan Poliklinik
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
