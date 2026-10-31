import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Star, 
  Car, 
  Trash2, 
  MessageSquarePlus, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

export default function MyReservations({ 
  reservations = [], 
  onRefresh, 
  user, 
  currency = 'TND' 
}) {
  const [selectedReviewReservation, setSelectedReviewReservation] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const currencySymbol = currency === 'EUR' ? '€' : 'DT';
  const formatMoney = (val) => {
    return currency === 'EUR' ? (Number(val || 0) / 3.35).toFixed(0) : val;
  };

  // Synchronisation : fusionner les réservations de l'API avec celles stockées localement
  const mergedReservations = useMemo(() => {
    let local = [];
    try {
      const stored = localStorage.getItem('qantra_local_reservations');
      if (stored) local = JSON.parse(stored);
    } catch (e) {
      console.warn('Erreur lecture qantra_local_reservations:', e);
    }

    const map = new Map();
    // Ajouter les réservations reçues de l'API
    if (Array.isArray(reservations)) {
      reservations.forEach((r) => {
        const id = String(r._id || r.id);
        map.set(id, r);
      });
    }

    // Ajouter les réservations locales non encore présentes
    if (Array.isArray(local)) {
      local.forEach((r) => {
        const id = String(r._id || r.id);
        if (!map.has(id)) {
          map.set(id, r);
        }
      });
    }

    const userId = user?.id;
    const allMerged = Array.from(map.values());

    // Filtrer par client connecté (si admin → tout voir)
    if (userId && !userId.startsWith('admin')) {
      return allMerged.filter((r) => {
        const clientId = typeof r.client === 'object' 
          ? String(r.client?._id || r.client?.id || '') 
          : String(r.client || '');
        const localId = String(userId);
        return clientId === localId || 
               String(r._id || r.id || '').startsWith('local_res_') ||
               clientId === '' ||
               r.meta?.driverEmail === user?.email;
      });
    }
    return allMerged;
  }, [reservations, user]);

  const handleCancelReservation = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

    try {
      await api.updateReservation(id, { statut: 'annulee' });
    } catch {
      await api.deleteReservation(id).catch(() => {});
    }

    // Mettre à jour également dans le localStorage si présent
    try {
      const stored = localStorage.getItem('qantra_local_reservations');
      if (stored) {
        const list = JSON.parse(stored);
        const updated = list.map((item) => 
          (item._id === id || item.id === id) ? { ...item, statut: 'annulee' } : item
        );
        localStorage.setItem('qantra_local_reservations', JSON.stringify(updated));
      }
    } catch (e) {
      console.warn(e);
    }

    onRefresh();
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedReviewReservation) return;

    setSubmittingReview(true);
    try {
      const clientId = user?.id || (selectedReviewReservation.client?._id || selectedReviewReservation.client || '6ae13e2d700014e5c5cfbe55');
      const payload = {
        reservation: selectedReviewReservation._id || selectedReviewReservation.id,
        client: clientId,
        note: reviewRating,
        commentaire: reviewComment
      };

      await api.createAvis(payload);
      setReviewSuccess(true);
      setTimeout(() => {
        setReviewSuccess(false);
        setSelectedReviewReservation(null);
        setReviewComment('');
        onRefresh();
      }, 1500);
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'confirmee':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmée
          </span>
        );
      case 'en_attente':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" /> En attente
          </span>
        );
      case 'terminee':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Terminée
          </span>
        );
      case 'annulee':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3.5 h-3.5" /> Annulée
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {statut || 'En cours'}
          </span>
        );
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Mes Réservations de Véhicules
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Suivez l'état de vos locations actuelles, passées et laissez vos avis.
        </p>
      </div>

      {mergedReservations.length > 0 ? (
        <div className="space-y-4">
          {mergedReservations.map((res) => {
            const carObj = res.voiture || {};
            const carName = res.meta?.carName || (typeof carObj === 'object' ? `${carObj.marque || carObj.brand || ''} ${carObj.modele || carObj.model || ''}`.trim() : 'Véhicule de location') || 'Véhicule de location';
            const immat = typeof carObj === 'object' ? carObj.immatriculation : '';
            const startDate = res.dateDebut ? new Date(res.dateDebut).toLocaleDateString('fr-FR') : 'N/A';
            const endDate = res.dateFin ? new Date(res.dateFin).toLocaleDateString('fr-FR') : 'N/A';
            const pickupPlace = res.meta?.pickupCity || 'Tunis Carthage';

            return (
              <div 
                key={res._id || res.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left vehicle & dates info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <Car className="w-7 h-7" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{carName}</h3>
                      {immat && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono font-bold text-slate-600">
                          {immat}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-600" /> Du {startDate} au {endDate}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-600" /> {pickupPlace}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-2 font-mono">
                      Réf: {(res._id || res.id || '').toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Status & Price & Actions */}
                <div className="flex flex-wrap items-center gap-4 justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total réservation</div>
                    <div className="text-xl font-black text-brand-700">
                      {formatMoney(res.prixTotal)} {currencySymbol}
                    </div>
                  </div>

                  <div>
                    {getStatusBadge(res.statut)}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Leave Review Button */}
                    {res.statut !== 'annulee' && (
                      <button
                        onClick={() => setSelectedReviewReservation(res)}
                        className="px-3 py-2 rounded-xl border border-brand-200 text-brand-700 hover:bg-brand-50 text-xs font-bold flex items-center gap-1.5 transition-all"
                        title="Donner votre avis sur ce véhicule"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>Avis</span>
                      </button>
                    )}

                    {/* Cancel button */}
                    {res.statut !== 'annulee' && res.statut !== 'terminee' && (
                      <button
                        onClick={() => handleCancelReservation(res._id || res.id)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-all"
                        title="Annuler la réservation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
          <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Aucune réservation pour le moment</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Parcourez notre catalogue et réservez la voiture de votre choix en Tunisie en quelques clics.
          </p>
        </div>
      )}

      {/* Review Modal */}
      {selectedReviewReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Votre avis sur votre location</h3>
            <p className="text-xs text-slate-500 mb-4">
              Partagez votre expérience pour aider les autres conducteurs.
            </p>

            {reviewSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-xs text-center font-bold">
                Merci ! Votre avis a été enregistré avec succès.
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Star rating selector */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1.5">Note globale</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star 
                          className={`w-7 h-7 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                        />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-slate-700 ml-2">{reviewRating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase block mb-1.5">Votre commentaire</label>
                  <textarea
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Véhicule propre, ponctualité, confort de route..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReviewReservation(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/25"
                  >
                    {submittingReview ? 'Envoi...' : 'Publier mon avis'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
