import React from 'react';
import { 
  X, 
  Users, 
  Fuel, 
  Cog, 
  Calendar, 
  Gauge, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  MapPin,
  Check,
  FileText
} from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80';

export default function CarDetailModal({ 
  car, 
  isOpen, 
  onClose, 
  onProceedToBook,
  currency = 'TND' 
}) {
  if (!isOpen || !car) return null;

  const brand = car.brand || car.marque || 'Véhicule';
  const model = car.model || car.modele || '';
  const year = car.year || car.annee || 2023;
  const seats = car.seats || car.nbPlaces || 5;
  const fuel = car.fuel_type || car.typeCarburant || 'Essence';
  const transmission = car.transmission || 'Manuelle';
  const km = car.kilometrage !== undefined ? car.kilometrage : 15000;
  const immat = car.immatriculation || 'DEMO-TN-001';
  const available = car.available !== undefined ? car.available : (car.statut === 'disponible');

  const rawPrice = Number(car.price_per_day || car.tarifJournalier || 100);
  const formattedPrice = currency === 'EUR' ? (rawPrice / 3.35).toFixed(0) : rawPrice;
  const currencySymbol = currency === 'EUR' ? '€' : 'DT';

  const categoryName = typeof car.category === 'string'
    ? car.category
    : (car.categorie && car.categorie.nom ? car.categorie.nom : 'Tourisme');

  const equipmentList = [
    'Climatisation automatique bi-zone',
    'Système GPS & Écran tactile multimédia',
    'Bluetooth, Apple CarPlay & Android Auto',
    'Caméra de recul et capteurs d\'obstacle',
    'Régulateur et limiteur de vitesse',
    'Airbags frontaux et latéraux + ABS / ESP',
    'Fixations ISOFIX sièges bébé',
    'Phares LED adaptatifs'
  ];

  const includedServices = [
    'Assurance Tous Risques incluse (CDW)',
    'Kilométrage illimité sur toute la Tunisie',
    'Assistance technique & dépannage 24/7',
    'Livraison gratuite aux aéroports (Tunis, Monastir, Djerba)',
    'Nettoyage professionnel certifié avant remise des clés',
    'Second conducteur offert sans supplément'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Car Image */}
        <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
          <img
            src={car.image || car.urlImage || car.image_url || FALLBACK_IMAGE}
            alt={`${brand} ${model}`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-600 text-white shadow-sm">
                  {categoryName}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
                  Année {year}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-black/40 backdrop-blur-md">
                  {immat}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {brand} {model}
              </h2>
            </div>

            <div className="text-right bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
              <div className="text-xs text-slate-300 font-medium">Tarif journalier</div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {formattedPrice} {currencySymbol} <span className="text-xs font-normal">/ jour</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          
          {/* Key specs badge grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Capacité</div>
                <div className="text-sm font-bold text-slate-800">{seats} Places</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                <Cog className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Transmission</div>
                <div className="text-sm font-bold text-slate-800">{transmission}</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                <Fuel className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Carburant</div>
                <div className="text-sm font-bold text-slate-800">{fuel}</div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Kilométrage</div>
                <div className="text-sm font-bold text-slate-800">{km.toLocaleString()} km</div>
              </div>
            </div>
          </div>

          {/* Équipements inclus */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Équipements du véhicule</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {equipmentList.map((eq, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{eq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Services inclus */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Inclus avec votre réservation</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {includedServices.map((srv, i) => (
                <div key={i} className="flex items-center gap-2 bg-emerald-50/50 p-2 rounded-xl border border-emerald-100 text-emerald-950">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{srv}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">Statut actuel</div>
            <div className={`text-sm font-bold ${available ? 'text-emerald-600' : 'text-rose-600'}`}>
              {available ? '✓ Disponible à la réservation' : '✗ Actuellement indisponible'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-all"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose();
                onProceedToBook(car);
              }}
              disabled={!available}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
                available
                  ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>Réserver ce véhicule</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
