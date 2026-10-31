import React, { useState, useMemo } from 'react';
import { 
  Car, 
  Calendar, 
  Layers, 
  CreditCard, 
  Star, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Fuel,
  Users,
  Search,
  Check,
  RefreshCw,
  BarChart3,
  Wrench,
  Download
} from 'lucide-react';
import { api } from '../services/api';
import AdminAnalytics from './AdminAnalytics';
import AdminMaintenance from './AdminMaintenance';

export default function AdminDashboard({ 
  cars = [], 
  categories = [], 
  reservations = [], 
  reviews = [], 
  payments = [],
  onRefresh, 
  currency = 'TND' 
}) {
  const [activeTab, setActiveTab] = useState('cars'); // 'cars', 'reservations', 'categories', 'payments', 'reviews'
  const [carModalOpen, setCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New/Edit Car form state
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState(2024);
  const [carImmat, setCarImmat] = useState('');
  const [carPrice, setCarPrice] = useState(120);
  const [carKm, setCarKm] = useState(5000);
  const [carTrans, setCarTrans] = useState('Automatique');
  const [carFuel, setCarFuel] = useState('Essence');
  const [carSeats, setCarSeats] = useState(5);
  const [carCategory, setCarCategory] = useState(categories[0]?._id || '');
  const [carStatus, setCarStatus] = useState('disponible');
  const [carImage, setCarImage] = useState('');

  // Category form state
  const [catNom, setCatNom] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Search filters
  const [carSearchQuery, setCarSearchQuery] = useState('');
  const [resSearchQuery, setResSearchQuery] = useState('');

  const openAddCar = () => {
    setEditingCar(null);
    setCarBrand('');
    setCarModel('');
    setCarYear(2024);
    setCarImmat(`TN-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`);
    setCarPrice(120);
    setCarKm(5000);
    setCarTrans('Automatique');
    setCarFuel('Essence');
    setCarSeats(5);
    setCarCategory(categories[0]?._id || '');
    setCarStatus('disponible');
    setCarImage('https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80');
    setCarModalOpen(true);
  };

  const openEditCar = (car) => {
    setEditingCar(car);
    setCarBrand(car.brand || car.marque || '');
    setCarModel(car.model || car.modele || '');
    setCarYear(car.year || car.annee || 2024);
    setCarImmat(car.immatriculation || '');
    setCarPrice(car.price_per_day || car.tarifJournalier || 100);
    setCarKm(car.kilometrage || 0);
    setCarTrans(car.transmission || 'Automatique');
    setCarFuel(car.fuel_type || car.typeCarburant || 'Essence');
    setCarSeats(car.seats || car.nbPlaces || 5);
    setCarCategory(car.categorie?._id || car.category_id || categories[0]?._id || '');
    setCarStatus(car.statut || (car.available ? 'disponible' : 'louee'));
    setCarImage(car.image || car.urlImage || '');
    setCarModalOpen(true);
  };

  const handleSaveCar = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        marque: carBrand,
        modele: carModel,
        annee: Number(carYear),
        immatriculation: carImmat,
        tarifJournalier: Number(carPrice),
        kilometrage: Number(carKm),
        transmission: carTrans,
        typeCarburant: carFuel,
        nbPlaces: Number(carSeats),
        categorie: carCategory,
        statut: carStatus,
        urlImage: carImage
      };

      if (editingCar) {
        await api.updateCar(editingCar._id || editingCar.id, payload);
      } else {
        await api.createCar(payload);
      }

      setCarModalOpen(false);
      onRefresh();
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCar = async (id) => {
    if (!window.confirm('Supprimer définitivement ce véhicule ?')) return;
    try {
      await api.deleteCar(id);
      onRefresh();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catNom.trim()) return;
    setSubmitting(true);
    try {
      await api.createCategory({ nom: catNom, description: catDesc });
      setCatModalOpen(false);
      setCatNom('');
      setCatDesc('');
      onRefresh();
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    try {
      await api.deleteCategory(id);
      onRefresh();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleUpdateReservationStatus = async (id, statut) => {
    try {
      await api.updateReservation(id, { statut });
      onRefresh();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  // KPIs
  const totalFleet = cars.length;
  const availableFleet = cars.filter(c => (c.available !== undefined ? c.available : c.statut === 'disponible')).length;
  // Exclure les réservations annulées du chiffre d'affaires
  const totalRevenue = reservations
    .filter(r => r.statut !== 'annulee')
    .reduce((acc, curr) => acc + Number(curr.prixTotal || 0), 0);
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + Number(r.note || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  // Filtrage des voitures pour la table
  const filteredCars = useMemo(() => {
    if (!carSearchQuery.trim()) return cars;
    const q = carSearchQuery.toLowerCase();
    return cars.filter(c => {
      const brand = (c.brand || c.marque || '').toLowerCase();
      const model = (c.model || c.modele || '').toLowerCase();
      const immat = (c.immatriculation || '').toLowerCase();
      const cat = (c.category || c.categorie?.nom || '').toLowerCase();
      return brand.includes(q) || model.includes(q) || immat.includes(q) || cat.includes(q);
    });
  }, [cars, carSearchQuery]);

  // Filtrage des réservations pour la table
  const filteredReservations = useMemo(() => {
    if (!resSearchQuery.trim()) return reservations;
    const q = resSearchQuery.toLowerCase();
    return reservations.filter(r => {
      const id = String(r._id || r.id || '').toLowerCase();
      const carObj = r.voiture || {};
      const carName = (r.meta?.carName || (typeof carObj === 'object' ? `${carObj.marque || ''} ${carObj.modele || ''}` : '')).toLowerCase();
      const driver = (r.meta?.driverName || r.client?.nom || r.client?.prenom || '').toLowerCase();
      const statut = (r.statut || '').toLowerCase();
      return id.includes(q) || carName.includes(q) || driver.includes(q) || statut.includes(q);
    });
  }, [reservations, resSearchQuery]);

  const exportReservationsCSV = () => {
    if (!reservations || reservations.length === 0) {
      alert("Aucune réservation à exporter.");
      return;
    }

    const headers = ["ID", "Vehicule", "Immatriculation", "Conducteur", "Email", "Telephone", "Date_Debut", "Date_Fin", "Montant_DT", "Statut"];
    const rows = reservations.map(r => {
      const car = r.voiture || {};
      const carName = r.meta?.carName || `${car.marque || ''} ${car.modele || ''}`.trim() || 'Vehicule';
      const immat = car.immatriculation || '';
      const clientName = r.meta?.driverName || (r.client ? `${r.client.prenom || ''} ${r.client.nom || ''}`.trim() : 'Client');
      const clientEmail = r.meta?.driverEmail || r.client?.email || '';
      const clientPhone = r.meta?.driverPhone || r.client?.telephone || '';
      const start = r.dateDebut ? new Date(r.dateDebut).toLocaleDateString('fr-FR') : '';
      const end = r.dateFin ? new Date(r.dateFin).toLocaleDateString('fr-FR') : '';
      const price = r.prixTotal || 0;
      const statut = r.statut || '';

      return [r._id || r.id, `"${carName}"`, `"${immat}"`, `"${clientName}"`, `"${clientEmail}"`, `"${clientPhone}"`, start, end, price, statut].join(';');
    });

    const csvContent = "\uFEFF" + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reservations_9antra_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span>Tableau de Bord Back-Office</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            Gestion de l'Agence 9antra
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Supervisez votre parc automobile, réservations, paiements et retours clients en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-2 text-xs font-bold"
            title="Rafraîchir les données"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Actualiser</span>
          </button>

          <button
            onClick={openAddCar}
            className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Véhicule</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Flotte Totale</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalFleet}</div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">
              {availableFleet} disponibles
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Réservations</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{reservations.length}</div>
            <div className="text-[11px] font-semibold text-brand-600 mt-0.5">
              Actives & terminées
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Revenu Confirmé</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {totalRevenue.toLocaleString()} <span className="text-xs font-bold text-slate-500">DT</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Hors annulations
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Satisfaction</div>
            <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
              <span>{avgRating}</span>
              <span className="text-xs text-slate-400 font-bold">/ 5</span>
            </div>
            <div className="text-[11px] font-semibold text-amber-600 mt-0.5">
              {reviews.length} avis certifiés
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('cars')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'cars'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Flotte Véhicules ({cars.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'reservations'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Réservations ({reservations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'categories'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Catégories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'payments'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Paiements ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'reviews'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Avis & Notes ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'analytics'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-brand-400" />
          <span>Statistiques & Graphiques</span>
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'maintenance'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Wrench className="w-4 h-4 text-amber-500" />
          <span>Carnet d'Entretien Flotte</span>
        </button>
      </div>

      {/* TAB 1: CARS MANAGEMENT */}
      {activeTab === 'cars' && (
        <div className="space-y-4">
          {/* Barre de recherche véhicules */}
          <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par marque, modèle, immatriculation..."
                value={carSearchQuery}
                onChange={(e) => setCarSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div className="text-xs font-bold text-slate-500">
              {filteredCars.length} véhicule{filteredCars.length > 1 ? 's' : ''} trouvé{filteredCars.length > 1 ? 's' : ''}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Véhicule</th>
                    <th className="py-3.5 px-4">Catégorie</th>
                    <th className="py-3.5 px-4">Immatriculation</th>
                    <th className="py-3.5 px-4">Tarif / jour</th>
                    <th className="py-3.5 px-4">Caractéristiques</th>
                    <th className="py-3.5 px-4">Statut</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCars.length > 0 ? (
                    filteredCars.map((car) => {
                      const id = car._id || car.id;
                      const brand = car.brand || car.marque;
                      const model = car.model || car.modele;
                      const catName = typeof car.category === 'string'
                        ? car.category
                        : (car.categorie?.nom || 'Standard');
                      const price = car.price_per_day || car.tarifJournalier;
                      const isAvail = car.available !== undefined ? car.available : car.statut === 'disponible';

                      return (
                        <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={car.image || car.urlImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80'}
                                alt=""
                                className="w-12 h-8 rounded-lg object-cover bg-slate-100 border border-slate-200"
                              />
                              <div>
                                <div className="font-bold text-slate-900">{brand} {model}</div>
                                <div className="text-[10px] text-slate-400">Année {car.year || car.annee}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {catName}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                            {car.immatriculation || 'N/A'}
                          </td>
                          <td className="py-3.5 px-4 font-black text-brand-700 text-sm">
                            {price} DT
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">
                            {car.transmission} • {car.fuel_type || car.typeCarburant} • {car.seats || car.nbPlaces} pl.
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              isAvail
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {car.statut || (isAvail ? 'disponible' : 'louée')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditCar(car)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-all"
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCar(id)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-slate-400">
                        Aucun véhicule ne correspond à votre recherche.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESERVATIONS MANAGEMENT */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {/* Barre de recherche réservations */}
          <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher par référence, client, véhicule, statut..."
                value={resSearchQuery}
                onChange={(e) => setResSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                {filteredReservations.length} réservation{filteredReservations.length > 1 ? 's' : ''} trouvée{filteredReservations.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={exportReservationsCSV}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                title="Exporter toutes les réservations au format CSV / Excel"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exporter CSV</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Réf & Date</th>
                    <th className="py-3.5 px-4">Véhicule</th>
                    <th className="py-3.5 px-4">Client / Conducteur</th>
                    <th className="py-3.5 px-4">Période</th>
                    <th className="py-3.5 px-4">Montant</th>
                    <th className="py-3.5 px-4">Statut</th>
                    <th className="py-3.5 px-4 text-right">Mettre à jour</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((res) => {
                      const id = res._id || res.id;
                      const carObj = res.voiture || {};
                      const carName = res.meta?.carName || (typeof carObj === 'object' ? `${carObj.marque || ''} ${carObj.modele || ''}`.trim() : 'Véhicule') || 'Véhicule';
                      const driverName = res.meta?.driverName || (res.client ? `${res.client.prenom || ''} ${res.client.nom || ''}`.trim() : 'Client');
                      const startDate = res.dateDebut ? new Date(res.dateDebut).toLocaleDateString('fr-FR') : '';
                      const endDate = res.dateFin ? new Date(res.dateFin).toLocaleDateString('fr-FR') : '';

                      return (
                        <tr key={id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-brand-700">
                              {id.slice(-8).toUpperCase()}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {res.dateCreation ? new Date(res.dateCreation).toLocaleDateString('fr-FR') : ''}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {carName}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">
                            {driverName}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {startDate} ➔ {endDate}
                          </td>
                          <td className="py-3.5 px-4 font-black text-slate-900">
                            {res.prixTotal} DT
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              res.statut === 'confirmee'
                                ? 'bg-emerald-100 text-emerald-800'
                                : res.statut === 'en_attente'
                                ? 'bg-amber-100 text-amber-800'
                                : res.statut === 'terminee'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {res.statut}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {res.statut !== 'confirmee' && (
                                <button
                                  onClick={() => handleUpdateReservationStatus(id, 'confirmee')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold transition-all"
                                >
                                  Confirmer
                                </button>
                              )}
                              {res.statut !== 'terminee' && (
                                <button
                                  onClick={() => handleUpdateReservationStatus(id, 'terminee')}
                                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[10px] font-bold transition-all"
                                >
                                  Terminer
                                </button>
                              )}
                              {res.statut !== 'annulee' && (
                                <button
                                  onClick={() => handleUpdateReservationStatus(id, 'annulee')}
                                  className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-[10px] font-bold transition-all"
                                >
                                  Annuler
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-slate-400">
                        Aucune réservation ne correspond à vos filtres.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setCatModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une catégorie</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat._id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-extrabold text-base text-slate-900">{cat.nom}</h4>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    {cat.description || 'Catégorie de véhicule'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Montant</th>
                  <th className="py-3.5 px-4">Mode de Paiement</th>
                  <th className="py-3.5 px-4">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.length > 0 ? (
                  payments.map((p, idx) => (
                    <tr key={p._id || idx} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 text-slate-500">
                        {p.datePaiement ? new Date(p.datePaiement).toLocaleDateString('fr-FR') : 'Récent'}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {p.montant} DT
                      </td>
                      <td className="py-3.5 px-4 uppercase font-bold text-[10px] text-slate-600">
                        {p.modePaiement}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {p.statut || 'payé'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-400">
                      Aucune transaction enregistrée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: REVIEWS */}
      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r, i) => (
            <div key={r._id || i} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm text-slate-900">
                  {r.client ? `${r.client.prenom || ''} ${r.client.nom || ''}` : 'Client 9antra'}
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-xs font-bold">{r.note} / 5</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 italic">
                "{r.commentaire || 'Service très satisfaisant'}"
              </p>
              <div className="text-[10px] text-slate-400">
                {r.date ? new Date(r.date).toLocaleDateString('fr-FR') : 'Avis récent'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: ANALYTICS & RECHARTS */}
      {activeTab === 'analytics' && (
        <AdminAnalytics
          cars={cars}
          categories={categories}
          reservations={reservations}
          currency={currency}
        />
      )}

      {/* TAB 7: FLEET MAINTENANCE */}
      {activeTab === 'maintenance' && (
        <AdminMaintenance
          cars={cars}
          onRefresh={onRefresh}
          currency={currency}
        />
      )}

      {/* MODAL: ADD / EDIT CAR */}
      {carModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-4">
              {editingCar ? 'Modifier le véhicule' : 'Ajouter un nouveau véhicule'}
            </h3>

            <form onSubmit={handleSaveCar} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Marque</label>
                  <input
                    type="text"
                    value={carBrand}
                    onChange={(e) => setCarBrand(e.target.value)}
                    placeholder="Mercedes, Toyota, BMW..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Modèle</label>
                  <input
                    type="text"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder="Classe C, Corolla, Tucson..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Année</label>
                  <input
                    type="number"
                    value={carYear}
                    onChange={(e) => setCarYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Immatriculation</label>
                  <input
                    type="text"
                    value={carImmat}
                    onChange={(e) => setCarImmat(e.target.value)}
                    placeholder="TN-235-8941"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tarif / jour (DT)</label>
                  <input
                    type="number"
                    value={carPrice}
                    onChange={(e) => setCarPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Boîte</label>
                  <select
                    value={carTrans}
                    onChange={(e) => setCarTrans(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Automatique">Automatique</option>
                    <option value="Manuelle">Manuelle</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Carburant</label>
                  <select
                    value={carFuel}
                    onChange={(e) => setCarFuel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybride">Hybride</option>
                    <option value="Électrique">Électrique</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Places</label>
                  <input
                    type="number"
                    value={carSeats}
                    onChange={(e) => setCarSeats(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Catégorie</label>
                  <select
                    value={carCategory}
                    onChange={(e) => setCarCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Statut</label>
                  <select
                    value={carStatus}
                    onChange={(e) => setCarStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="louee">Louée</option>
                    <option value="en_maintenance">En maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">URL Photo (Image HD)</label>
                <input
                  type="url"
                  value={carImage}
                  onChange={(e) => setCarImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCarModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/25"
                >
                  {submitting ? 'Enregistrement...' : 'Enregistrer le véhicule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-3">Ajouter une nouvelle catégorie</h3>
            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nom de la catégorie</label>
                <input
                  type="text"
                  value={catNom}
                  onChange={(e) => setCatNom(e.target.value)}
                  placeholder="Ex: Citadine, Économique, Prestige"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Description</label>
                <textarea
                  rows="3"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Description pour orienter les clients..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md"
                >
                  Créer la catégorie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
