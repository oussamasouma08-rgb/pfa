import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Award, 
  Phone, 
  Mail, 
  FileText, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Save,
  Gift
} from 'lucide-react';
import { api } from '../services/api';

export default function ProfileModal({ isOpen, onClose, user, onProfileUpdated }) {
  if (!isOpen || !user) return null;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [prenom, setPrenom] = useState(user.prenom || user.name?.split(' ')[0] || '');
  const [nom, setNom] = useState(user.nom || user.name?.split(' ').slice(1).join(' ') || '');
  const [telephone, setTelephone] = useState(user.telephone || user.phone || '+216 ');
  const [numeroPermis, setNumeroPermis] = useState(user.numeroPermis || 'TN-854721');
  const [adresse, setAdresse] = useState(user.adresse || 'Tunis, Tunisie');
  
  const [fidelityInfo, setFidelityInfo] = useState({
    tier: 'Bronze',
    discountPercent: 0,
    points: 0,
    nextTier: 'Argent',
    pointsNeeded: 100
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      setLoading(true);
      try {
        const data = await api.getMyProfile();
        if (data && isMounted) {
          if (data.prenom) setPrenom(data.prenom);
          if (data.nom) setNom(data.nom);
          if (data.telephone) setTelephone(data.telephone);
          if (data.numeroPermis) setNumeroPermis(data.numeroPermis);
          if (data.adresse) setAdresse(data.adresse);
          if (data.fidelity) {
            setFidelityInfo({
              tier: data.fidelity.tier || 'Bronze',
              discountPercent: data.fidelity.discountPercent || 0,
              points: data.pointsFidelite || 0,
              nextTier: data.fidelity.nextTier,
              pointsNeeded: data.fidelity.pointsNeeded || 0
            });
          }
        }
      } catch (e) {
        console.warn('Profile fetch:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProfile();
    return () => { isMounted = false; };
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const updated = await api.updateMyProfile({
        prenom,
        nom,
        telephone,
        numeroPermis,
        adresse
      });

      const updatedUser = {
        ...user,
        name: `${prenom} ${nom}`.trim(),
        prenom,
        nom,
        phone: telephone,
        telephone,
        numeroPermis,
        adresse
      };

      localStorage.setItem('qantra_user', JSON.stringify(updatedUser));
      setSuccessMsg('Profil mis à jour avec succès !');

      if (onProfileUpdated) {
        onProfileUpdated(updatedUser);
      }

      setTimeout(() => {
        setSuccessMsg('');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Impossible de mettre à jour le profil');
    } finally {
      setSaving(false);
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Platine': return 'from-slate-700 via-indigo-900 to-purple-900 text-purple-200 border-purple-500/30';
      case 'Or': return 'from-amber-500 via-yellow-600 to-amber-700 text-amber-100 border-yellow-400/40';
      case 'Argent': return 'from-slate-400 via-zinc-500 to-slate-600 text-slate-100 border-slate-300/40';
      default: return 'from-amber-700 via-amber-800 to-amber-900 text-amber-100 border-amber-600/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-600/30 border border-brand-400/30 flex items-center justify-center text-brand-300">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Mon Espace & Fidélité</h3>
              <p className="text-xs text-slate-300">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Carte Programme de Fidélité */}
          <div className={`p-5 rounded-2xl bg-gradient-to-br ${getTierColor(fidelityInfo.tier)} border shadow-md relative overflow-hidden`}>
            <div className="absolute right-3 top-3 opacity-15">
              <Award className="w-24 h-24" />
            </div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                  Programme Fidélité 9antra Club
                </span>
                <h4 className="text-2xl font-black mt-1 flex items-center gap-2">
                  Membre {fidelityInfo.tier}
                  {fidelityInfo.discountPercent > 0 && (
                    <span className="text-xs font-bold bg-white text-slate-900 px-2 py-0.5 rounded-lg">
                      -{fidelityInfo.discountPercent}% Réduction
                    </span>
                  )}
                </h4>
              </div>

              <div className="text-right">
                <div className="text-2xl font-extrabold">{fidelityInfo.points}</div>
                <div className="text-[11px] opacity-80">Points cumulés</div>
              </div>
            </div>

            {fidelityInfo.nextTier && (
              <div className="mt-4 pt-3 border-t border-white/20 relative z-10">
                <div className="flex justify-between text-xs mb-1.5 opacity-90">
                  <span>Prochain palier : <strong>{fidelityInfo.nextTier}</strong></span>
                  <span>Plus que {fidelityInfo.pointsNeeded} pts</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, Math.max(10, (fidelityInfo.points / (fidelityInfo.points + fidelityInfo.pointsNeeded)) * 100))}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Formulaire Informations Personnelles */}
          <form onSubmit={handleSave} className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Mes Informations Personnelles
            </h4>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {successMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Prénom</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Téléphone mobile</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">N° Permis de conduire</label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={numeroPermis}
                    onChange={(e) => setNumeroPermis(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Adresse en Tunisie</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
              >
                Fermer
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
