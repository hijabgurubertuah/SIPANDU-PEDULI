import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  FileText,
  Code,
  Sparkles,
  Image as ImageIcon,
  Link2,
  HardDrive,
  Upload,
  Eye,
  Edit3,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Smile,
  Check,
  Globe,
  Save,
  Send,
  Trash2,
  CloudUpload
} from 'lucide-react';
import type { NewsAnnouncement } from '../types';

export interface GalleryPhotoItem {
  id: string;
  title: string;
  url: string;
}

interface NewsEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: NewsAnnouncement | null;
  onSave: (news: NewsAnnouncement, isPublishToCloud: boolean) => Promise<void> | void;
  galleryPhotos?: GalleryPhotoItem[];
}

export default function NewsEditorModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  galleryPhotos = []
}: NewsEditorModalProps) {
  const [mode, setMode] = useState<'berita' | 'embed'>('berita');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Prestasi');
  const [customCategory, setCustomCategory] = useState('');
  const [author, setAuthor] = useState('Humas Instansi');
  const [date, setDate] = useState(() =>
    new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
  );
  const [coverType, setCoverType] = useState<'drive' | 'galeri' | 'webp' | 'link'>('drive');
  const [imageUrl, setImageUrl] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'editor' | 'preview'>('editor');
  const [fontSize, setFontSize] = useState<number>(14);
  const [selectedColor, setSelectedColor] = useState<string>('#1e293b');
  const [highlightColor, setHighlightColor] = useState<string>('transparent');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset form when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      const standardCategories = ['Prestasi', 'Layanan', 'Kesehatan', 'Pengumuman', 'Edukasi Kesehatan', 'Promosi Kesehatan', 'Akademik', 'Kegiatan', 'Inovasi', 'Umum'];
      if (standardCategories.includes(initialData.category)) {
        setCategory(initialData.category);
        setCustomCategory('');
      } else {
        setCategory('Lainnya');
        setCustomCategory(initialData.category || '');
      }
      setAuthor(initialData.author || 'Humas Instansi');
      setDate(initialData.date || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }));
      setImageUrl(initialData.imageUrl || '');
      setExcerpt(initialData.excerpt || '');
      setContent(initialData.content || '');
      setEmbedCode(initialData.embedCode || '');
      setMode(initialData.isEmbed ? 'embed' : 'berita');
      setCoverType(initialData.coverType || 'drive');
    } else {
      setTitle('');
      setCategory('Prestasi');
      setCustomCategory('');
      setAuthor('Humas Instansi');
      setDate(new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }));
      setImageUrl('');
      setExcerpt('');
      setContent('');
      setEmbedCode('');
      setMode('berita');
      setCoverType('drive');
    }
    setActiveSubTab('editor');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Insert formatting or wrap selection in textarea
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const replacement = prefix + (selectedText || 'Teks') + suffix;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText ? selectedText.length : 4));
    }, 0);
  };

  // Quick Emoji Picker list
  const emojis = ['🏥', '🩺', '💊', '📢', '🏆', '⭐', '📅', '📌', '✨', '💉', '❤️', '👨‍⚕️', '👩‍⚕️', '🔬', '🚑', '📊', '✅', '💡'];

  // Color options
  const colorOptions = [
    { name: 'Hitam / Gelap', value: '#1e293b' },
    { name: 'Biru Utama', value: '#2563eb' },
    { name: 'Hijau Emerald', value: '#059669' },
    { name: 'Amber / Oranye', value: '#d97706' },
    { name: 'Merah Rose', value: '#e11d48' },
    { name: 'Ungu Indigo', value: '#7c3aed' }
  ];

  const highlightOptions = [
    { name: 'Tanpa Stabilo', value: 'transparent' },
    { name: 'Kuning Terang', value: '#fef08a' },
    { name: 'Hijau Muda', value: '#bbf7d0' },
    { name: 'Biru Lembut', value: '#bfdbfe' },
    { name: 'Merah Muda', value: '#fbcfe8' }
  ];

  // Handle local file image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImageUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  // Handle Save
  const handleSubmit = async (publishToCloud: boolean) => {
    if (!title.trim()) {
      alert('Mohon masukkan Judul Berita.');
      return;
    }

    setIsSubmitting(true);
    try {
      const finalCategory = initialData?.category || 'Berita';
      const finalExcerpt = excerpt.trim() || (content.slice(0, 120).replace(/[#*`_]/g, '') + '...');

      const newsItem: NewsAnnouncement = {
        id: initialData?.id || `news-${Date.now()}`,
        title: title.trim(),
        category: finalCategory,
        date: date.trim() || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
        excerpt: finalExcerpt,
        content: mode === 'embed' ? (embedCode || content) : content,
        author: initialData?.author || 'Humas Instansi',
        imageUrl: imageUrl.trim() || undefined,
        status: publishToCloud ? 'Published' : 'Draft',
        storageType: publishToCloud ? 'Cloud' : 'Lokal',
        coverType,
        embedCode: mode === 'embed' ? embedCode : undefined,
        isEmbed: mode === 'embed',
        isBookmarked: initialData?.isBookmarked || false
      };

      await onSave(newsItem, publishToCloud);
      onClose();
    } catch (error) {
      console.error('Error saving news:', error);
      alert('Gagal menyimpan berita. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* ================= MODAL HEADER ================= */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-slate-900 sticky top-0 z-20">
          
          {/* Mode Switcher Pills (Berita vs Embed) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setMode('berita')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                mode === 'berita'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Berita</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('embed')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                mode === 'embed'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code className="w-4 h-4 text-slate-500" />
              <span>Embed</span>
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= FORM BODY ================= */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200">
          
          {/* JUDUL BERITA */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black tracking-wider text-slate-700 dark:text-slate-300 uppercase">
              Judul Berita <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul berita yang jelas dan menarik..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm sm:text-base font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* TANGGAL PUBLIKASI ROW */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black tracking-wider text-slate-700 dark:text-slate-300 uppercase">
              Tanggal Publikasi
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="12 September 2026"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ================= COVER IMAGE SELECTOR ================= */}
          <div className="space-y-2">
            <label className="block text-xs font-black tracking-wider text-slate-700 dark:text-slate-300 uppercase">
              Cover Image
            </label>

            {/* Sub-tab pills for Cover Image */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
              <button
                type="button"
                onClick={() => setCoverType('drive')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  coverType === 'drive'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>Drive</span>
              </button>
              <button
                type="button"
                onClick={() => setCoverType('galeri')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  coverType === 'galeri'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Galeri</span>
              </button>
              <button
                type="button"
                onClick={() => setCoverType('webp')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  coverType === 'webp'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>WebP</span>
              </button>
              <button
                type="button"
                onClick={() => setCoverType('link')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  coverType === 'link'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Link</span>
              </button>
            </div>

            {/* Dropzone / Upload / Link Form */}
            <div className="p-4 bg-slate-50/60 dark:bg-slate-800/40 border-2 border-dashed border-blue-200 dark:border-blue-900/60 rounded-2xl flex flex-col items-center justify-center min-h-[100px] transition text-center relative group">
              {imageUrl ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                  <img
                    src={imageUrl}
                    alt="Preview Cover"
                    className="w-24 h-20 sm:w-32 sm:h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-500" /> Cover Berhasil Dipasang
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md mt-0.5">
                      {imageUrl.startsWith('data:') ? 'Gambar lokal terunggah' : imageUrl}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-100 transition cursor-pointer"
                      >
                        Ganti Gambar
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg hover:bg-rose-100 transition cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ) : coverType === 'link' ? (
                <div className="w-full space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... atau URL gambar langsung"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Tempelkan link gambar eksternal yang dapat diakses publik.</p>
                </div>
              ) : coverType === 'galeri' && galleryPhotos.length > 0 ? (
                <div className="w-full space-y-3 text-left">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Pilih dari Galeri Puskesmas:</p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1">
                    {galleryPhotos.map((photo) => (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => setImageUrl(photo.url)}
                        className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition relative group cursor-pointer"
                      >
                        <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-1.5 cursor-pointer py-2 w-full"
                >
                  <CloudUpload className="w-7 h-7 text-blue-500 animate-bounce" />
                  <p className="text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400">
                    Pilih Gambar ke Google Drive <span className="font-normal text-slate-500 dark:text-slate-400">atau seret ke sini</span>
                  </p>
                  <p className="text-[10px] text-slate-400">Format: PNG, JPG, JPEG, WebP (Maks 5MB)</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* ================= RINGKASAN BERITA ================= */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black tracking-wider text-slate-700 dark:text-slate-300 uppercase">
              Ringkasan Berita
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Ringkasan singkat 1–2 kalimat yang tampil di kartu berita..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>

          {/* ================= ISI POSTINGAN / EMBED ================= */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black tracking-wider text-slate-700 dark:text-slate-300 uppercase">
                {mode === 'embed' ? 'Kode Embed HTML' : 'Isi Postingan'}
              </label>

              {/* Sub-tab Editor vs Pratinjau */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveSubTab('editor')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    activeSubTab === 'editor'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editor</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('preview')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    activeSubTab === 'preview'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Pratinjau</span>
                </button>
              </div>
            </div>

            {mode === 'embed' ? (
              /* Embed Code Editor */
              <div className="space-y-3">
                <textarea
                  rows={8}
                  value={embedCode}
                  onChange={(e) => setEmbedCode(e.target.value)}
                  placeholder="<iframe src='https://...' width='100%' height='450' frameborder='0'></iframe>"
                  className="w-full font-mono text-xs px-4 py-3 bg-slate-950 text-emerald-400 border border-slate-800 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500">Mendukung embed Google Forms, Canva, YouTube, Google Maps, dan Dokumen Drive.</p>
              </div>
            ) : activeSubTab === 'editor' ? (
              /* Rich Post Editor */
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/90 shadow-2xs">
                
                {/* TOOLBAR */}
                <div className="p-2 border-b border-slate-100 dark:border-slate-700/80 bg-slate-50/90 dark:bg-slate-850 flex flex-wrap items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  
                  {/* Basic Formatting: B, I, U */}
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded font-bold text-xs cursor-pointer"
                      title="Tebal (Bold)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*', '*')}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs cursor-pointer"
                      title="Miring (Italic)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('<u>', '</u>')}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs cursor-pointer"
                      title="Garis Bawah (Underline)"
                    >
                      <Underline className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Heading / Style dropdown */}
                  <div className="flex items-center">
                    <select
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'h1') insertFormatting('\n# ', '\n');
                        if (val === 'h2') insertFormatting('\n## ', '\n');
                        if (val === 'h3') insertFormatting('\n### ', '\n');
                        if (val === 'p') insertFormatting('\n', '\n');
                        e.target.value = 'default';
                      }}
                      defaultValue="default"
                      className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      <option value="default" disabled>T Default</option>
                      <option value="h1">Judul Utama (H1)</option>
                      <option value="h2">Subjudul (H2)</option>
                      <option value="h3">Heading 3 (H3)</option>
                      <option value="p">Paragraf Normal</option>
                    </select>
                  </div>

                  {/* Font Size Selector: A- 14 A+ */}
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                      className="px-1.5 py-1 text-[11px] font-bold hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                      title="Perkecil Ukuran Teks"
                    >
                      A-
                    </button>
                    <span className="px-2 text-xs font-extrabold text-blue-600 dark:text-blue-400">{fontSize}</span>
                    <button
                      type="button"
                      onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                      className="px-1.5 py-1 text-[11px] font-bold hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                      title="Perbesar Ukuran Teks"
                    >
                      A+
                    </button>
                  </div>

                  {/* Text Color Picker */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowColorPicker(!showColorPicker);
                        setShowHighlightPicker(false);
                      }}
                      className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                      title="Warna Teks"
                    >
                      <span>🎨</span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedColor }} />
                    </button>

                    {showColorPicker && (
                      <div className="absolute left-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl shadow-lg z-30 grid grid-cols-3 gap-1.5 w-40">
                        {colorOptions.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => {
                              setSelectedColor(c.value);
                              insertFormatting(`<span style="color: ${c.value}">`, '</span>');
                              setShowColorPicker(false);
                            }}
                            className="flex items-center gap-1.5 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-[11px]"
                          >
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.value }} />
                            <span className="truncate">{c.name.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Highlight Color */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowHighlightPicker(!showHighlightPicker);
                        setShowColorPicker(false);
                      }}
                      className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                      title="Stabilo / Highlight"
                    >
                      <span>🖌️</span>
                      <span className="w-2.5 h-2.5 rounded-full border border-slate-400" style={{ backgroundColor: highlightColor === 'transparent' ? '#ffffff' : highlightColor }} />
                    </button>

                    {showHighlightPicker && (
                      <div className="absolute left-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl shadow-lg z-30 space-y-1 w-36">
                        {highlightOptions.map((h) => (
                          <button
                            key={h.value}
                            type="button"
                            onClick={() => {
                              setHighlightColor(h.value);
                              if (h.value !== 'transparent') {
                                insertFormatting(`<mark style="background-color: ${h.value}">`, '</mark>');
                              }
                              setShowHighlightPicker(false);
                            }}
                            className="w-full flex items-center gap-2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-left text-[11px]"
                          >
                            <span className="w-3 h-3 rounded-full border border-slate-300" style={{ backgroundColor: h.value === 'transparent' ? '#ffffff' : h.value }} />
                            <span>{h.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Alignment */}
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setTextAlign('left')}
                      className={`p-1.5 rounded ${textAlign === 'left' ? 'bg-slate-100 dark:bg-slate-700 text-blue-600' : ''}`}
                      title="Rata Kiri"
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextAlign('center')}
                      className={`p-1.5 rounded ${textAlign === 'center' ? 'bg-slate-100 dark:bg-slate-700 text-blue-600' : ''}`}
                      title="Rata Tengah"
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextAlign('right')}
                      className={`p-1.5 rounded ${textAlign === 'right' ? 'bg-slate-100 dark:bg-slate-700 text-blue-600' : ''}`}
                      title="Rata Kanan"
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setTextAlign('justify')}
                      className={`p-1.5 rounded ${textAlign === 'justify' ? 'bg-slate-100 dark:bg-slate-700 text-blue-600' : ''}`}
                      title="Rata Kanan Kiri"
                    >
                      <AlignJustify className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Lists & Quote */}
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n- ', '')}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs"
                      title="Bullet List"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n1. ', '')}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n> ', '\n')}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs"
                      title="Kutipan (Quote)"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Link, Emoji, Image */}
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Masukkan URL Tautan:', 'https://');
                        if (url) insertFormatting(`[`, `](${url})`);
                      }}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs"
                      title="Sisipkan Tautan (Link)"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs"
                        title="Sisipkan Emoji"
                      >
                        <Smile className="w-3.5 h-3.5" />
                      </button>

                      {showEmojiPicker && (
                        <div className="absolute left-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-xl shadow-lg z-30 grid grid-cols-6 gap-1 w-48">
                          {emojis.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                insertFormatting(emoji, '');
                                setShowEmojiPicker(false);
                              }}
                              className="text-base p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-center"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const imgUrl = prompt('Masukkan URL Gambar:', 'https://');
                        if (imgUrl) insertFormatting(`\n![Gambar](${imgUrl})\n`);
                      }}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-xs"
                      title="Sisipkan Gambar Inline"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

                {/* TEXTAREA WRAPPER */}
                <textarea
                  ref={textareaRef}
                  rows={10}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan isi berita lengkap di sini... Anda dapat menggunakan toolbar di atas untuk format teks, kutipan, list, dan menyisipkan media."
                  style={{
                    fontSize: `${fontSize}px`,
                    textAlign: textAlign,
                    color: selectedColor
                  }}
                  className="w-full p-4 bg-transparent border-0 focus:outline-hidden focus:ring-0 leading-relaxed font-sans placeholder-slate-400 resize-y min-h-[220px]"
                />
              </div>
            ) : (
              /* LIVE PREVIEW MODE */
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-slate-50 dark:bg-slate-850 space-y-4 max-h-[400px] overflow-y-auto">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full max-h-64 object-cover rounded-xl shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">📅 {date}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
                    {title || 'Judul Berita'}
                  </h2>
                  {excerpt && (
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 italic border-l-4 border-blue-500 pl-3">
                      {excerpt}
                    </p>
                  )}
                </div>
                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed pt-2 border-t border-slate-200 dark:border-slate-700">
                  {content || 'Belum ada konten berita.'}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ================= MODAL FOOTER ACTIONS ================= */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky bottom-0 z-20">
          
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Mode: <strong>{mode === 'berita' ? 'Posting Berita Reguler' : 'Embed Media / Iframe'}</strong></span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span>Simpan Draf (Lokal)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Memproses...' : 'Publikasikan Berita'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
