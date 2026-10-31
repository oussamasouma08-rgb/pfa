import React from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Gauge
} from 'lucide-react';

export default function Hero({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  categories = [], 
  onSearchSubmit,
  pickupDate,
  setPickupDate,
  returnDate,
  setReturnDate,
  pickupCity,
  setPickupCity
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-10 pb-20 sm:pb-24">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tag */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>N°1 de la location automobile en Tunisie</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            <span className="text-white/80">Livraison aéroport sans attente</span>
          </div>
        </div>

        {/* Main Headings */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none mb-6">
            Louez la voiture parfaite pour votre séjour en{' '}
            <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Tunisie
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg font-normal max-w-2xl mx-auto">
            Réservation instantanée de berlines, SUV et citadines récentes. Kilométrage illimité, assurance tous risques et assistance 24h/24 incluses.
          </p>
        </div>

        {/* Interactive Booking Search Bar */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/40 text-slate-800 border border-slate-100">
          <form 
            onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            {/* Ville de prise en charge */}
            <div className="flex flex-col gap-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                Lieu de retrait
              </label>
              <select
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                className="bg-transparent font-semibold text-sm text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="Tunis Carthage">Tunis (Aéroport Carthage)</option>
                <option value="Tunis Centre">Tunis Centre Ville</option>
                <option value="Sousse">Sousse / Port El Kantaoui</option>
                <option value="Monastir">Monastir (Aéroport Habib Bourguiba)</option>
                <option value="Hammamet">Hammamet / Nabeul</option>
                <option value="Djerba">Djerba (Aéroport Zarzis)</option>
                <option value="Sfax">Sfax</option>
              </select>
            </div>

            {/* Date début */}
            <div className="flex flex-col gap-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                Date de départ
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="bg-transparent font-semibold text-sm text-slate-900 focus:outline-none"
              />
            </div>

            {/* Date fin */}
            <div className="flex flex-col gap-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                Date de retour
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="bg-transparent font-semibold text-sm text-slate-900 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-full min-h-[52px] bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
              >
                <Search className="w-4 h-4" />
                <span>Voir les véhicules</span>
              </button>
            </div>
          </form>

          {/* Quick city tags */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Agences populaires :</span>
              <div className="flex flex-wrap gap-1.5">
                {['Aéroport Tunis', 'Sousse', 'Djerba', 'Hammamet'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setPickupCity(city)}
                    className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-700 transition-all font-medium"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Sans caution bloquée
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Annulation flexible
              </span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-slate-300">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Assurance Tout Risque</div>
              <div className="text-xs text-slate-400">Protection totale incluse</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Kilométrage Illimité</div>
              <div className="text-xs text-slate-400">Roulez sans contrainte</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Assistance 24/7</div>
              <div className="text-xs text-slate-400">Partout en Tunisie</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Flotte 2024 - 2026</div>
              <div className="text-xs text-slate-400">Véhicules neufs & nettoyés</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
