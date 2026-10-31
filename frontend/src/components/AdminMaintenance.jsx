import React, { useState } from 'react';
import { 
  Wrench, 
  Calendar, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Car, 
  DollarSign, 
  FileText,
  Search
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminMaintenance({ cars = [], onRefresh, currency = 'TND' }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(cars[0]?._id || cars[0]?.id || '');
  const [type, setType] = useState('vidange');
  const [description, setDescription] = useState('');
  const [cout, setCout] = useState(120);
  const [kilometrage, setKilometrage] = useState(50000);
  const [mettreEnMaintenance, setMettreEnMaintenance] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const selectedCar = cars.find(c => (c._id === selectedCarId || c.id === selectedCarId));

  const openLogModal = (car) => {
    setSelectedCarId(car._id || car.id);
    setKilometrage(car.kilometrage || 50000);
    setDescription(`Entretien périodique : ${type}`);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCarId) return;
    setSubmitting(true);

    try {
      await api.addCarMaintenance(selectedCarId, {
        type,
        description,
        cout: Number(cout),
        kilometrage: Number(kilometrage),
        mettreEnMaintenance
      });
      setModalOpen(false);
      setDescription('');
      onRefresh();
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCars = cars.filter(c => {
    const q = search.toLowerCase();
    const name = `${c.marque || c.brand || ''} ${c.modele || c.model || ''}`.toLowerCase();
    const immat = (c.immatriculation || '').toLowerCase();
    return name.includes(q) || immat.includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-600" />
            Suivi & Carnet d'Entretien Technique
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Historique des vidanges, révisions et interventions mécaniques sur la flotte
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher véhicule..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter Entretien</span>
          </button>
        </div>
      </div>

      {/* Vehicles Fleet Maintenance Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Véhicule</th>
                <th className="py-4 px-6">Kilométrage</th>
                <th className="py-4 px-6">Statut Mécanique</th>
                <th className="py-4 px-6">Dernière Intervention</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredCars.map((car) => {
                const history = car.historiqueMaintenance || [];
                const lastEntry = history[0];
                const isUnderMaintenance = car.statut === 'en_maintenance';

                return (
                  <tr key={car._id || car.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold overflow-hidden flex-shrink-0">
                          {car.urlImage || car.image ? (
                            <img src={car.urlImage || car.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Car className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {car.marque || car.brand} {car.modele || car.model}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {car.immatriculation}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-mono font-bold text-slate-900">
                        {Number(car.kilometrage || 0).toLocaleString('fr-FR')} km
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      {isUnderMaintenance ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3" /> En maintenance atelier
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> En parfait état
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6">
                      {lastEntry ? (
                        <div>
                          <div className="font-bold capitalize text-slate-800">
                            {lastEntry.type} — {Number(lastEntry.cout || 0)} {currency === 'EUR' ? '€' : 'DT'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(lastEntry.date).toLocaleDateString('fr-FR')} ({lastEntry.kilometrage || 0} km)
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Aucun enregistrement</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openLogModal(car)}
                        className="px-3 py-1.5 rounded-xl border border-amber-200 text-amber-700 hover:bg-amber-50 font-bold text-xs inline-flex items-center gap-1 transition-all"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Enregistrer</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajouter Entretien */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-100">
            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-amber-600" />
              Nouvel Entretien Véhicule
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Véhicule concerné</label>
                <select
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  required
                >
                  {cars.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>
                      {c.marque || c.brand} {c.modele || c.model} ({c.immatriculation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Type d'opération</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="vidange">Vidange moteur & filtres</option>
                    <option value="freins">Plaquettes / Disques freins</option>
                    <option value="pneus">Changement Pneumatiques</option>
                    <option value="revision">Révision générale certifiée</option>
                    <option value="carrosserie">Carrosserie / Peinture</option>
                    <option value="autre">Autre réparation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Coût (DT)</label>
                  <input
                    type="number"
                    value={cout}
                    onChange={(e) => setCout(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Kilométrage actuel au compteur</label>
                <input
                  type="number"
                  value={kilometrage}
                  onChange={(e) => setKilometrage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Description / Notes d'intervention</label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Pièces changées, garage agréé..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={mettreEnMaintenance}
                  onChange={(e) => setMettreEnMaintenance(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-amber-900">
                  Immobiliser ce véhicule (passer le statut en maintenance atelier)
                </span>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Enregistrement...' : 'Valider Intervention'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
