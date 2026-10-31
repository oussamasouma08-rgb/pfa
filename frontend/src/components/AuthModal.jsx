import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess 
}) {
  if (!isOpen) return null;

  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+216 ');
  const [birthDate, setBirthDate] = useState('1995-05-15');
  const [numeroPermis, setNumeroPermis] = useState('TN-854129');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Veuillez renseigner votre email.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      setSuccessMsg(res.message || 'Un email de réinitialisation vous a été envoyé.');
    } catch (err) {
      setErrorMsg(err.message || 'Impossible d\'envoyer l\'email.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const data = await api.login(email, password);
      localStorage.setItem('qantra_token', data.token);
      localStorage.setItem('qantra_user', JSON.stringify(data.user));
      setSuccessMsg('Connexion réussie !');
      setTimeout(() => {
        onLoginSuccess(data.user);
        onClose();
      }, 700);
    } catch (err) {
      if (err.status === 401 || err.message?.includes('incorrect')) {
        setErrorMsg('Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.');
      } else if (err.status === 400) {
        setErrorMsg('Veuillez renseigner un email et un mot de passe valides.');
      } else {
        setErrorMsg(err.message || 'Impossible de se connecter au serveur.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const parts = name.trim().split(/\s+/);
      if (parts.length < 2) {
        throw new Error('Veuillez saisir votre prénom et votre nom.');
      }

      const res = await api.register({
        name,
        email,
        password,
        phone,
        birth_date: birthDate,
        numeroPermis
      });

      setSuccessMsg('Compte client créé avec succès !');
      localStorage.setItem('qantra_token', res.token);
      localStorage.setItem('qantra_user', JSON.stringify(res.user));
      setTimeout(() => {
        onLoginSuccess(res.user);
        onClose();
      }, 800);
    } catch (err) {
      if (err.status === 409 || err.message?.includes('déjà utilisée') || err.message?.includes('409')) {
        setErrorMsg('Cette adresse email est déjà enregistrée. Veuillez vous connecter avec vos identifiants.');
      } else if (err.status === 400) {
        setErrorMsg(err.message || 'Informations d\'inscription invalides. Vérifiez que le mot de passe fait au moins 8 caractères.');
      } else {
        setErrorMsg(err.message || 'Erreur lors de la création du compte.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@9antra.tn');
      setPassword('admin123');
      setIsRegister(false);
      setErrorMsg('');
    } else {
      setEmail('client@9antra.tn');
      setPassword('password123');
      setIsRegister(false);
      setErrorMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-100 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
            {isRegister ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {isRegister ? 'Inscription Client' : 'Espace Membre'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isRegister 
              ? 'Créez votre compte client pour louer des véhicules rapidement' 
              : 'Connectez-vous pour gérer vos locations de véhicules'}
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TABS OU RETOUR */}
        {isForgot ? (
          <div className="mb-4">
            <h4 className="text-sm font-bold text-slate-800">Mot de passe oublié</h4>
            <p className="text-xs text-slate-500">Saisissez votre email pour recevoir le lien de réinitialisation.</p>
          </div>
        ) : (
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                !isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setErrorMsg(''); }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Inscription
            </button>
          </div>
        )}

        {/* FORGOT PASSWORD FORM */}
        {isForgot ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Votre Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/25 text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              <span>{loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setIsForgot(false); setErrorMsg(''); setSuccessMsg(''); }}
              className="w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 text-center block"
            >
              ← Retour à la connexion
            </button>
          </form>
        ) : !isRegister ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Mot de passe</label>
                <button
                  type="button"
                  onClick={() => { setIsForgot(true); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-[10px] font-semibold text-brand-600 hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/25 text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
            </button>

            {/* Quick Demo Accounts Buttons */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center mb-2">
                Comptes de test rapides
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillQuickDemo('client')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <User className="w-3.5 h-3.5 text-brand-600" />
                  <span>Compte Client</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillQuickDemo('admin')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Compte Admin</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* REGISTER FORM */
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Prénom et Nom</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Youssef Gharbi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Adresse Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@exemple.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">N° de Permis</label>
                <input
                  type="text"
                  value={numeroPermis}
                  onChange={(e) => setNumeroPermis(e.target.value)}
                  placeholder="TN-854129"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Date Naissance</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Mot de passe (8 car. min)</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/25 text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Création en cours...' : 'Créer mon compte client'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
