import { X, ExternalLink, CheckCircle2, Clock, FileSpreadsheet, FileText, Folder, ShieldCheck } from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onVerify?: (id: string) => void;
  canVerify?: boolean;
}

export default function DocumentModal({ document, onClose, onVerify, canVerify }: DocumentModalProps) {
  if (!document) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'sheet':
        return <FileSpreadsheet className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />;
      case 'doc':
      case 'pdf':
        return <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />;
      case 'folder':
        return <Folder className="w-8 h-8 text-amber-600 dark:text-amber-400" />;
      default:
        return <FileText className="w-8 h-8 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {getIcon(document.fileType)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  {document.categoryLabel}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Tahun {document.year}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {document.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Arsitektur Gateway SIPANDU PEDULI:</strong> Dokumen ini bersumber resmi dari ekosistem Google Workspace UPTD Puskesmas Kepanjen. Sistem ini menghubungkan metadata dan kendali verifikasi tanpa menduplikasi data asli.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">Klaster / Penanggung Jawab</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{document.clusterLabel}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">Pengunggah / PIC</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{document.uploaderName}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">Status Verifikasi</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-xs">
                {document.verificationStatus === 'Terverifikasi' ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi
                  </span>
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5" /> Menunggu Verifikasi
                  </span>
                )}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">Terakhir Diperbarui</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{document.updatedAt}</span>
            </div>
          </div>

          {document.description && (
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Deskripsi Dokumen:</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">{document.description}</p>
            </div>
          )}

          {/* Simulated Sheet Preview / Link Box */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-100/70 dark:bg-slate-800/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Tautan Akses Gateway:</span>
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                {document.fileType === 'sheet' ? 'Google Sheets' : document.fileType === 'folder' ? 'Google Drive Folder' : 'Google Drive Doc/PDF'}
              </span>
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-300 break-all select-all">
              {document.driveUrl}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
          <div>
            {canVerify && document.verificationStatus !== 'Terverifikasi' && (
              <button
                onClick={() => onVerify && onVerify(document.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Verifikasi Dokumen Ini
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium rounded-lg transition"
            >
              Tutup
            </button>
            <a
              href={document.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs transition"
            >
              <span>Buka di Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
