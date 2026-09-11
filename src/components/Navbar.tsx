import { useState } from 'react';
import {
  Activity,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  LogIn,
  LogOut,
  UserCheck,
  ChevronDown,
  Building2,
  Lock
} from 'lucide-react';
import { UserAccount } from '../types';
import { PUSKESMAS_INFO, MOCK_USERS } from '../data/mockData';

interface NavbarProps {
  currentView: 'public' | 'pegawai';
  onSelectView: (view: 'public' | 'pegawai') => void;
  currentUser: UserAccount;
  onSelectUser: (user: UserAccount) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  activePublicTab: string;
  onSelectPublicTab: (tab: string) => void;
  activePegawaiTab: string;
  onSelectPegawaiTab: (tab: string) => void;
}

export default function Navbar({
  currentView,
  onSelectView,
  currentUser,
  onSelectUser,
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  activePublicTab,
  onSelectPublicTab,
  activePegawaiTab,
  onSelectPegawaiTab
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const publicNavItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'pelayanan', label: 'Pelayanan' },
    { id: 'informasi', label: 'Informasi & Publik' },
    { id: 'sistem', label: 'Sistem Digital' },
    { id: 'monitoring', label: 'Data & Monitoring' },
    { id: 'mitra', label: 'Mitra Faskes' },
    { id: 'pengaduan', label: 'Pengaduan' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Top Banner Notice */}
      <div className="bg-emerald-700 dark:bg-emerald-950 text-white text-[11px] py-1 px-4 text-center font-medium flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
          <span>UPTD Puskesmas Kepanjen — Pelayanan Terintegrasi Layanan Primer (ILP)</span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-4 text-[11px]">
          <span>Hotline UGD 24 Jam: <strong>(0341) 395-xxx / 08889924444</strong></span>
          <span className="hidden md:inline text-emerald-200">|</span>
          <span className="hidden md:inline text-emerald-100">Jl. Raya Jatirejoyoso No. 4 Kepanjen</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectView('public')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  SIPANDU
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white tracking-wider">
                  PEDULI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px] sm:max-w-xs">
                Portal Digital Puskesmas Kepanjen
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          {currentView === 'public' ? (
            <nav className="hidden lg:flex items-center space-x-1">
              {publicNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectPublicTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activePublicTab === item.id
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-300/60 dark:border-emerald-800">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Mode Portal Pegawai
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser.unitName}
              </span>
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              title="Cari Dokumen, Layanan atau Sistem"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Cari Dokumen"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'Beralih ke Terang' : 'Beralih ke Gelap'}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Ubah Tema Gelap Terang"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Role Switcher / Simulator Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-xs font-medium transition"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.role[0].toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
                    {currentUser.roleLabel}
                  </div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400">
                    {currentView === 'pegawai' ? 'Internal' : 'Area Publik'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
              </button>

              {/* Role selector dropdown */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Simulasi Hak Akses (RBAC)
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Pilih role untuk menguji tampilan & izin akses:
                    </p>
                  </div>
                  <div className="space-y-1">
                    {MOCK_USERS.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSelectUser(user);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition flex items-center justify-between ${
                          currentUser.id === user.id
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {user.roleLabel} • {user.unitName}
                          </div>
                        </div>
                        {currentUser.id === user.id && (
                          <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Portal Switcher CTA Button */}
            {currentView === 'public' ? (
              <button
                onClick={() => onSelectView('pegawai')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Portal Pegawai</span>
              </button>
            ) : (
              <button
                onClick={() => onSelectView('public')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lihat Area Publik</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
              Navigasi Halaman
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onSelectView(currentView === 'public' ? 'pegawai' : 'public');
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-600 text-white"
              >
                {currentView === 'public' ? 'Masuk Portal Pegawai' : 'Kembali ke Area Publik'}
              </button>
            </div>
          </div>

          {currentView === 'public' ? (
            <div className="grid grid-cols-2 gap-1 pt-1">
              {publicNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectPublicTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-semibold ${
                    activePublicTab === item.id
                      ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-1 text-xs text-slate-700 dark:text-slate-300 pt-1">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <span className="block text-[10px] text-slate-400">Pengguna Login:</span>
                <span className="font-bold">{currentUser.name}</span> ({currentUser.roleLabel})
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
