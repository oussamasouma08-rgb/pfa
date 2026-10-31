import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  SlidersHorizontal, 
  Sparkles, 
  Car,
  ChevronDown,
  Heart,
  ArrowUpDown,
  Fuel,
  Users
} from 'lucide-react';
import CarCard from './CarCard';

export default function CarCatalog({ 
  cars = [], 
  categories = [], 
  onBookCar, 
  onDetailCar,
  currency = 'TND',
  initialSearchQuery = '',
  initialCategory = ''
}) {
  const [search, setSearch] = useState(initialSearchQuery);
  const [selectedCat, setSelectedCat] = useState(initialCategory || 'all');
  const [maxPrice, setMaxPrice] = useState(400);
  const [transmissionFilter, setTransmissionFilter] = useState('all');
  const [fuelFilter, setFuelFilter] = useState('all');
  const [seatsFilter, setSeatsFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('qantra_favorites') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleFavChange = () => {
      try {
        setFavorites(JSON.parse(localStorage.getItem('qantra_favorites') || '[]'));
      } catch (e) {
        console.warn(e);
      }
    };
    window.addEventListener('favorites-updated', handleFavChange);
    return () => window.removeEventListener('favorites-updated', handleFavChange);
  }, []);

  // Available unique categories
  const categoryList = useMemo(() => {
    const names = new Set(categories.map(c => c.nom));
    return ['all', ...Array.from(names)];
  }, [categories]);

  // Filtering & Sorting logic
  const filteredCars = useMemo(() => {
    const result = cars.filter(car => {
      const carId = car.id || car._id;

      // Favoris filter
      if (favoritesOnly && !favorites.includes(carId)) {
        return false;
      }

      // Search text
      const brand = (car.brand || car.marque || '').toLowerCase();
      const model = (car.model || car.modele || '').toLowerCase();
      const q = search.toLowerCase().trim();
      const matchSearch = !q || brand.includes(q) || model.includes(q);

      // Category
      const catName = typeof car.category === 'string'
        ? car.category
        : (car.categorie?.nom || '');
      const matchCat = selectedCat === 'all' || catName.toLowerCase() === selectedCat.toLowerCase();

      // Price
      const price = Number(car.price_per_day || car.tarifJournalier || 0);
      const matchPrice = price <= maxPrice;

      // Transmission
      const trans = (car.transmission || '').toLowerCase();
      const matchTrans = transmissionFilter === 'all' || trans.includes(transmissionFilter.toLowerCase());

      // Fuel
      const fuel = (car.fuel_type || car.typeCarburant || '').toLowerCase();
      const matchFuel = fuelFilter === 'all' || fuel.includes(fuelFilter.toLowerCase());

      // Seats
      const seats = Number(car.seats || car.nbPlaces || 5);
      const matchSeats = seatsFilter === 'all' 
        ? true 
        : seatsFilter === '7' ? seats >= 7 : seats === Number(seatsFilter);

      // Availability
      const isAvail = car.available !== undefined ? car.available : (car.statut === 'disponible');
      const matchAvail = !availableOnly || isAvail;

      return matchSearch && matchCat && matchPrice && matchTrans && matchFuel && matchSeats && matchAvail;
    });

    // Sorting
    return result.sort((a, b) => {
      const priceA = Number(a.price_per_day || a.tarifJournalier || 0);
      const priceB = Number(b.price_per_day || b.tarifJournalier || 0);
      const yearA = Number(a.year || a.annee || 2020);
      const yearB = Number(b.year || b.annee || 2020);

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'year_desc') return yearB - yearA;
      return 0; // recommended
    });
  }, [cars, search, selectedCat, maxPrice, transmissionFilter, fuelFilter, seatsFilter, sortBy, availableOnly, favoritesOnly, favorites]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCat('all');
    setMaxPrice(400);
    setTransmissionFilter('all');
    setFuelFilter('all');
    setSeatsFilter('all');
    setSortBy('recommended');
    setAvailableOnly(false);
    setFavoritesOnly(false);
  };

  const hasActiveFilters = search || selectedCat !== 'all' || maxPrice < 400 || transmissionFilter !== 'all' || fuelFilter !== 'all' || seatsFilter !== 'all' || availableOnly || favoritesOnly;

  return (
    <section id="cars-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Notre Parc Automobile</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Choisissez votre véhicule de location
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Des véhicules récents, assurés tous risques et prêts à vous accompagner
          </p>
        </div>

        {/* Counter badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
              favoritesOnly 
                ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${favoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>Mes Favoris ({favorites.length})</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-2xl text-xs font-bold border border-slate-200">
            <Car className="w-4 h-4 text-brand-600" />
            <span>{filteredCars.length} sur {cars.length} affichés</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm mb-10 space-y-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoryList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCat === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'Toutes les catégories' : cat}
            </button>
          ))}
        </div>

        {/* Search & Main Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Marque, modèle (ex: Mercedes, Toyota)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Tri par */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Trier par</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommandé</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="year_desc">Véhicules les plus récents</option>
            </select>
          </div>

          {/* Transmission Select */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Boîte de vitesses</span>
            <select
              value={transmissionFilter}
              onChange={(e) => setTransmissionFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Toutes les boîtes</option>
              <option value="automatique">Automatique</option>
              <option value="manuelle">Manuelle</option>
            </select>
          </div>

          {/* Price Slider */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex flex-col justify-between">
            <div className="flex justify-between text-[10px] font-bold text-slate-500">
              <span>Tarif max :</span>
              <span className="text-brand-600 font-extrabold">{maxPrice} DT / jour</span>
            </div>
            <input
              type="range"
              min="60"
              max="450"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer h-1.5 mt-1"
            />
          </div>

        </div>

        {/* Secondary Row (Fuel, Seats, Available, Reset) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          
          {/* Carburant */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Carburant</span>
            <select
              value={fuelFilter}
              onChange={(e) => setFuelFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Tous carburants</option>
              <option value="essence">Essence</option>
              <option value="diesel">Diesel</option>
              <option value="hybride">Hybride</option>
            </select>
          </div>

          {/* Places */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Places assises</span>
            <select
              value={seatsFilter}
              onChange={(e) => setSeatsFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Toutes places</option>
              <option value="5">5 places</option>
              <option value="7">7 places et +</option>
            </select>
          </div>

          {/* Disponibilité */}
          <label className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer hover:bg-slate-100 transition-all">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
            <span className="text-xs font-semibold text-slate-700">Disponibles</span>
          </label>

          {/* Reset */}
          <div className="flex items-center">
            {hasActiveFilters ? (
              <button
                onClick={resetFilters}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all"
                title="Réinitialiser les filtres"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Effacer filtres</span>
              </button>
            ) : (
              <div className="w-full text-center text-[11px] text-slate-400 py-2">
                Filtres par défaut
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Car Cards Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCars.map((car) => (
            <CarCard
              key={car.id || car._id}
              car={car}
              currency={currency}
              onBook={onBookCar}
              onDetail={onDetailCar}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Aucun véhicule ne correspond à vos critères
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            {favoritesOnly 
              ? "Vous n'avez pas encore ajouté de véhicules à vos favoris. Cliquez sur le cœur ❤️ d'une voiture pour l'ajouter." 
              : "Essayez d'élargir votre recherche en augmentant le budget ou en réinitialisant les filtres."}
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/25 hover:bg-brand-700 transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Réinitialiser les filtres</span>
          </button>
        </div>
      )}

    </section>
  );
}
