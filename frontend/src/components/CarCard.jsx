import React, { useState } from 'react';
import { 
  Users, 
  Fuel, 
  Gauge, 
  Cog, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Shield, 
  Eye,
  Heart
} from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80';

export default function CarCard({ 
  car, 
  onBook, 
  onDetail, 
  currency = 'TND' 
}) {
  const [imgSrc, setImgSrc] = useState(
    car.image || car.urlImage || car.image_url || FALLBACK_IMAGE
  );

  const carId = car.id || car._id;
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('qantra_favorites') || '[]');
      return favs.includes(carId);
    } catch {
      return false;
    }
  });

  const toggleFavorite = (e) => {
    e.stopPropagation();
    try {
      const favs = JSON.parse(localStorage.getItem('qantra_favorites') || '[]');
      let updated;
      if (favs.includes(carId)) {
        updated = favs.filter(id => id !== carId);
        setIsFavorite(false);
      } else {
        updated = [...favs, carId];
        setIsFavorite(true);
      }
      localStorage.setItem('qantra_favorites', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('favorites-updated'));
    } catch (err) {
      console.warn(err);
    }
  };

  // Currency calculation
  const rawPrice = Number(car.price_per_day || car.tarifJournalier || 100);
  const formattedPrice = currency === 'EUR' 
    ? (rawPrice / 3.35).toFixed(0) 
    : rawPrice;

  const currencySymbol = currency === 'EUR' ? '€' : 'DT';

  const brand = car.brand || car.marque || 'Véhicule';
  const model = car.model || car.modele || '';
  const year = car.year || car.annee || 2023;
  const seats = car.seats || car.nbPlaces || 5;
  const fuel = car.fuel_type || car.typeCarburant || 'Essence';
  const transmission = car.transmission || 'Manuelle';
  const available = car.available !== undefined 
    ? car.available 
    : (car.statut === 'disponible');

  const categoryName = typeof car.category === 'string'
    ? car.category
    : (car.categorie && car.categorie.nom ? car.categorie.nom : 'Tourisme');

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* Car Image with Badge Overlay */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={imgSrc}
            alt={`${brand} ${model}`}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 group-hover:opacity-30 transition-opacity" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-slate-800 shadow-sm border border-slate-100">
              {categoryName}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-md">
              {year}
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              onClick={toggleFavorite}
              title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all group/btn"
            >
              <Heart 
                className={`w-4 h-4 transition-all ${
                  isFavorite 
                    ? 'fill-rose-500 text-rose-500 scale-110' 
                    : 'text-white group-hover/btn:text-rose-300'
                }`} 
              />
            </button>
            <span 
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-sm ${
                available
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-rose-500/90 text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              {available ? 'Disponible' : 'Réservée'}
            </span>
          </div>

          {/* Immatriculation badge on bottom corner */}
          {car.immatriculation && (
            <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-white/90">
              {car.immatriculation}
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-5">
          {/* Header Title */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                {brand} <span className="font-semibold text-slate-700">{model}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Garantie confort & sécurité
              </p>
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
              <Users className="w-3.5 h-3.5 text-brand-600" />
              <span>{seats} places</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
              <Cog className="w-3.5 h-3.5 text-brand-600" />
              <span className="truncate">{transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
              <Fuel className="w-3.5 h-3.5 text-brand-600" />
              <span className="truncate">{fuel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Price & Actions */}
      <div className="px-5 pb-5 pt-2">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-2xl font-black text-brand-700">
              {formattedPrice} {currencySymbol}
            </span>
            <span className="text-xs font-semibold text-slate-500 ml-1">/ jour</span>
          </div>
          <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Km illimité
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => onDetail(car)}
            className="col-span-2 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:text-brand-700 hover:border-brand-300 hover:bg-brand-50/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            title="Voir les détails complets"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Détails</span>
          </button>
          
          <button
            onClick={() => onBook(car)}
            disabled={!available}
            className={`col-span-3 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
              available
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>{available ? 'Réserver' : 'Indisponible'}</span>
            {available && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
