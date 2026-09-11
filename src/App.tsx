import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PublicArea from './components/PublicArea';
import PortalPegawai from './components/PortalPegawai';
import Footer from './components/Footer';
import DocumentModal from './components/DocumentModal';
import AddDocumentModal from './components/AddDocumentModal';
import SearchModal from './components/SearchModal';
import {
  UserAccount,
  DocumentItem,
  IndicatorMetric,
  ActivityLogItem,
  ComplaintItem
} from './types';
import {
  MOCK_USERS,
  MOCK_SERVICES,
  MOCK_DIGITAL_SYSTEMS,
  MOCK_INDICATORS,
  MOCK_DOCUMENTS,
  MOCK_ACTIVITY_LOGS,
  MOCK_COMPLAINTS,
  MOCK_MITRA,
  MOCK_NEWS
} from './data/mockData';

export default function App() {
  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sipandu_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sipandu_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sipandu_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // View state: 'public' or 'pegawai'
  const [currentView, setCurrentView] = useState<'public' | 'pegawai'>('public');

  // Navigation tab for Public area
  const [activePublicTab, setActivePublicTab] = useState<string>('beranda');

  // Navigation tab for Pegawai area
  const [activePegawaiTab, setActivePegawaiTab] = useState<string>('dashboard');

  // Active User for RBAC simulation
  const [currentUser, setCurrentUser] = useState<UserAccount>(MOCK_USERS[0]); // Default Super Admin

  // Data states with persistence
  const [documents, setDocuments] = useState<DocumentItem[]>(MOCK_DOCUMENTS);
  const [indicators, setIndicators] = useState<IndicatorMetric[]>(MOCK_INDICATORS);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(MOCK_ACTIVITY_LOGS);
  const [complaints, setComplaints] = useState<ComplaintItem[]>(MOCK_COMPLAINTS);

  // Modals state
  const [selectedDocModal, setSelectedDocModal] = useState<DocumentItem | null>(null);
  const [isAddDocOpen, setIsAddDocOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Handlers
  const handleAddDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);

    // Add activity log
    const newLog: ActivityLogItem = {
      id: `log-${Date.now()}`,
      userName: currentUser.name,
      role: currentUser.roleLabel,
      action: 'Penambahan Tautan Berkas Gateway',
      target: newDoc.title,
      timestamp: new Date().toLocaleString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' WIB',
      ipAddress: '192.168.1.104',
      type: 'document'
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const handleVerifyDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, verificationStatus: 'Terverifikasi' } : doc
      )
    );

    const doc = documents.find((d) => d.id === id);
    if (doc) {
      const newLog: ActivityLogItem = {
        id: `log-${Date.now()}`,
        userName: currentUser.name,
        role: currentUser.roleLabel,
        action: 'Verifikasi Dokumen Resmi',
        target: doc.title,
        timestamp: new Date().toLocaleString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) + ' WIB',
        ipAddress: '192.168.1.104',
        type: 'verification'
      };
      setActivityLogs((prev) => [newLog, ...prev]);
    }

    if (selectedDocModal && selectedDocModal.id === id) {
      setSelectedDocModal((prev) =>
        prev ? { ...prev, verificationStatus: 'Terverifikasi' } : null
      );
    }
  };

  const handleVerifyIndicator = (id: string) => {
    setIndicators((prev) =>
      prev.map((ind) =>
        ind.id === id ? { ...ind, verificationStatus: 'Terverifikasi' } : ind
      )
    );

    const ind = indicators.find((i) => i.id === id);
    if (ind) {
      const newLog: ActivityLogItem = {
        id: `log-${Date.now()}`,
        userName: currentUser.name,
        role: currentUser.roleLabel,
        action: 'Verifikasi Capaian Indikator',
        target: ind.title,
        timestamp: new Date().toLocaleString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) + ' WIB',
        ipAddress: '192.168.1.104',
        type: 'verification'
      };
      setActivityLogs((prev) => [newLog, ...prev]);
    }
  };

  const handleSubmitComplaint = (newComplaint: ComplaintItem) => {
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white font-sans transition-colors duration-200">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        activePublicTab={activePublicTab}
        onSelectPublicTab={(t) => {
          setActivePublicTab(t);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activePegawaiTab={activePegawaiTab}
        onSelectPegawaiTab={(t) => {
          setActivePegawaiTab(t);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="grow">
        {currentView === 'public' ? (
          <PublicArea
            activeTab={activePublicTab}
            onSelectTab={(tab) => {
              setActivePublicTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            services={MOCK_SERVICES}
            systems={MOCK_DIGITAL_SYSTEMS}
            indicators={indicators}
            documents={documents}
            mitraList={MOCK_MITRA}
            newsList={MOCK_NEWS}
            complaints={complaints}
            onSubmitComplaint={handleSubmitComplaint}
            onSelectDocument={setSelectedDocModal}
            onOpenPegawaiPortal={() => {
              setCurrentView('pegawai');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <PortalPegawai
            currentUser={currentUser}
            documents={documents}
            indicators={indicators}
            activityLogs={activityLogs}
            complaints={complaints}
            onOpenAddDocument={() => setIsAddDocOpen(true)}
            onSelectDocument={setSelectedDocModal}
            onVerifyDocument={handleVerifyDocument}
            onVerifyIndicator={handleVerifyIndicator}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          setActivePublicTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectView={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Document Gateway Detail Modal */}
      <DocumentModal
        document={selectedDocModal}
        onClose={() => setSelectedDocModal(null)}
        onVerify={handleVerifyDocument}
        canVerify={
          currentUser.role === 'super_admin' ||
          currentUser.role === 'admin' ||
          currentUser.role === 'pimpinan' ||
          currentUser.role === 'koordinator'
        }
      />

      {/* Add Document Gateway Modal */}
      <AddDocumentModal
        isOpen={isAddDocOpen}
        onClose={() => setIsAddDocOpen(false)}
        onAdd={handleAddDocument}
        currentUser={currentUser}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        documents={documents}
        services={MOCK_SERVICES}
        systems={MOCK_DIGITAL_SYSTEMS}
        onSelectDocument={setSelectedDocModal}
      />

    </div>
  );
}
