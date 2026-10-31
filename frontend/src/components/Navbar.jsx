import React, { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  Calendar, 
  User, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  user, 
  onOpenAuth, 
  onLogout, 
  onOpenProfile,
  currency, 
  setCurrency,
  backendOnline,
  reservationsCount = 0
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentTab('catalog')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-all">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-brand-700 bg-clip-text text-transparent">
                  9antra<span className="text-brand-600">Drive</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200">
                  Tunisie
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Location de voitures & utilitaires
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setCurrentTab('catalog')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'catalog'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Véhicules
            </button>
            <button
              onClick={() => setCurrentTab('services')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'services'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setCurrentTab('reviews')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'reviews'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Avis Clients
            </button>
            <button
              onClick={() => setCurrentTab('reservations')}
              className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentTab === 'reservations'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Mes Réservations
              {reservationsCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-brand-600 text-white font-bold rounded-full">
                  {reservationsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {/* Currency selector */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-1 text-xs font-bold text-slate-600 border border-slate-200">
              <button 
                onClick={() => setCurrency('TND')}
                className={`px-2 py-1 rounded-lg transition-all ${currency === 'TND' ? 'bg-white text-brand-700 shadow-sm' : 'hover:text-slate-900'}`}
              >
                TND (DT)
              </button>
              <button 
                onClick={() => setCurrency('EUR')}
                className={`px-2 py-1 rounded-lg transition-all ${currency === 'EUR' ? 'bg-white text-brand-700 shadow-sm' : 'hover:text-slate-900'}`}
              >
                EUR (€)
              </button>
            </div>

            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-100 pl-3 pr-1.5 py-1.5 rounded-2xl border border-slate-200">
                <button
                  onClick={onOpenProfile}
                  title="Gérer mon profil & voir mes points fidélité"
                  className="text-right hidden sm:block hover:opacity-80 transition-opacity"
                >
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-brand-600 font-semibold uppercase flex items-center gap-1 justify-end">
                    <span>{user.role === 'admin' ? 'Administrateur' : 'Membre Club'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </button>
                <button
                  onClick={onOpenProfile}
                  title="Mon Profil & Fidélité"
                  className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 hover:scale-105 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm transition-all"
                >
                  {user.name.charAt(0)}
                </button>
                <button
                  onClick={onLogout}
                  title="Déconnexion"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Connexion</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-lg px-4 pt-4 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => { setCurrentTab('catalog'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-sm font-bold text-left ${currentTab === 'catalog' ? 'bg-brand-50 text-brand-700' : 'bg-slate-50 text-slate-700'}`}
            >
              🚗 Véhicules
            </button>
            <button
              onClick={() => { setCurrentTab('reservations'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-sm font-bold text-left ${currentTab === 'reservations' ? 'bg-brand-50 text-brand-700' : 'bg-slate-50 text-slate-700'}`}
            >
              📅 Mes Réservations
            </button>
            <button
              onClick={() => { setCurrentTab('services'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-sm font-bold text-left ${currentTab === 'services' ? 'bg-brand-50 text-brand-700' : 'bg-slate-50 text-slate-700'}`}
            >
              ⭐ Services
            </button>
            <button
              onClick={() => { setCurrentTab('reviews'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-sm font-bold text-left ${currentTab === 'reviews' ? 'bg-brand-50 text-brand-700' : 'bg-slate-50 text-slate-700'}`}
            >
              💬 Avis Clients
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Devise :</span>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrency('TND')} 
                className={`px-3 py-1 rounded-lg font-bold ${currency === 'TND' ? 'bg-brand-600 text-white' : 'bg-slate-100'}`}
              >
                TND
              </button>
              <button 
                onClick={() => setCurrency('EUR')} 
                className={`px-3 py-1 rounded-lg font-bold ${currency === 'EUR' ? 'bg-brand-600 text-white' : 'bg-slate-100'}`}
              >
                EUR
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
