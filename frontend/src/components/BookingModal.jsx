import React, { useState, useMemo } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Car,
  User,
  Phone,
  Mail,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Printer
} from 'lucide-react';
import { api } from '../services/api';

export default function BookingModal({
  car,
  isOpen,
  onClose,
  user,
  onBookingSuccess,
  currency = 'TND',
  defaultPickupDate,
  defaultReturnDate,
  defaultCity,
  existingReservations = []
}) {
  if (!isOpen || !car) return null;

  // Step state: 1 = Dates & Options, 2 = Driver Info, 3 = Payment & Confirmation, 4 = Success Voucher
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const available = car.available !== undefined ? car.available : (car.statut === 'disponible');

  // Form states
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [dateDebut, setDateDebut] = useState(defaultPickupDate || today);
  const [dateFin, setDateFin] = useState(defaultReturnDate || tomorrow);
  const [pickupCity, setPickupCity] = useState(defaultCity || 'Tunis (Aéroport Carthage)');
  const [extraInsurance, setExtraInsurance] = useState(true);
  const [babySeat, setBabySeat] = useState(false);

  // Périodes occupées & détection de conflit
  const carId = car?._id || car?.id;
  const bookedRanges = useMemo(() => {
    return (existingReservations || [])
      .filter(r => {
        const rCarId = r.voiture?._id || r.voiture?.id || r.voiture;
        return (rCarId === carId) && (r.statut === 'confirmee' || r.statut === 'en_attente');
      })
      .map(r => ({
        id: r._id || r.id,
        start: new Date(r.dateDebut),
        end: new Date(r.dateFin),
        startStr: new Date(r.dateDebut).toLocaleDateString('fr-FR'),
        endStr: new Date(r.dateFin).toLocaleDateString('fr-FR')
      }));
  }, [carId, existingReservations]);

  const conflictingRange = useMemo(() => {
    if (!dateDebut || !dateFin) return null;
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    return bookedRanges.find(r => r.start < end && r.end > start) || null;
  }, [dateDebut, dateFin, bookedRanges]);

  const hasConflict = Boolean(conflictingRange);

  // Driver details
  const [driverName, setDriverName] = useState(user?.name || '');
  const [driverEmail, setDriverEmail] = useState(user?.email || '');
  const [driverPhone, setDriverPhone] = useState(user?.phone || '+216 ');
  const [driverLicense, setDriverLicense] = useState('TN-854721');
  const [paymentMode, setPaymentMode] = useState('especes'); // 'especes', 'carte', 'en_ligne'

  // Price calculation - minimum 1 jour même si dates identiques
  const { days, dailyRate, baseTotal, extrasTotal, grandTotal } = useMemo(() => {
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    const rawDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    // Calcul minimum : 1 jour
    const diffTime = Math.max(1, isNaN(rawDiff) ? 1 : rawDiff);
    const dRate = Number(car.price_per_day || car.tarifJournalier || 100);
    const base = diffTime * dRate;

    let extras = 0;
    if (extraInsurance) extras += diffTime * 15; // 15 DT / jour pack zéro franchise
    if (babySeat) extras += diffTime * 10; // 10 DT / jour siège bébé

    return {
      days: diffTime,
      dailyRate: dRate,
      baseTotal: base,
      extrasTotal: extras,
      grandTotal: base + extras
    };
  }, [dateDebut, dateFin, car, extraInsurance, babySeat]);

  const currencySymbol = currency === 'EUR' ? '€' : 'DT';
  const formatMoney = (val) => {
    return currency === 'EUR' ? (val / 3.35).toFixed(0) : val;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!available) {
      setErrorMsg('Ce véhicule est actuellement indisponible ou déjà loué.');
      return;
    }

    if (step === 1) {
      if (!user) {
        setErrorMsg('Vous devez être connecté pour réserver un véhicule.');
        return;
      }
      if (new Date(dateFin) < new Date(dateDebut)) {
        setErrorMsg('La date de retour ne peut pas être antérieure à la date de départ.');
        return;
      }
      if (hasConflict) {
        setErrorMsg(`Ce véhicule est déjà réservé du ${conflictingRange.startStr} au ${conflictingRange.endStr}. Veuillez choisir d'autres dates.`);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!driverName.trim() || !driverEmail.trim() || !driverPhone.trim() || !driverLicense.trim()) {
        setErrorMsg('Veuillez renseigner tous les champs obligatoires du conducteur.');
        return;
      }
      setStep(3);
    }
  };

  const handleConfirmReservation = async () => {
    if (!available) {
      setErrorMsg('Ce véhicule n\'est plus disponible pour une nouvelle réservation.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const carId = car._id || car.id;
      const clientId = user?.id;

      if (!clientId) {
        setErrorMsg('Vous devez être connecté pour effectuer une réservation.');
        setSubmitting(false);
        return;
      }

      const resPayload = {
        voiture: carId,
        client: clientId,
        dateDebut: new Date(dateDebut).toISOString(),
        dateFin: new Date(dateFin).toISOString(),
        prixTotal: grandTotal,
        statut: 'confirmee',
        meta: {
          carName: `${car.brand || car.marque} ${car.model || car.modele}`,
          pickupCity,
          driverName,
          driverPhone,
          driverLicense,
          driverEmail
        }
      };

      const createdRes = await api.createReservation(resPayload);

      // Enregistrer paiement
      const paymentPayload = {
        reservation: createdRes._id || createdRes.id,
        montant: grandTotal,
        modePaiement: paymentMode,
        statut: paymentMode === 'carte' || paymentMode === 'en_ligne' ? 'paye' : 'en_attente'
      };
      await api.createPaiement(paymentPayload).catch(e => console.warn('Payment logging:', e));

      // Sauvegarde locale de secours synchronisée
      try {
        const local = JSON.parse(localStorage.getItem('qantra_local_reservations') || '[]');
        const fullItem = {
          ...createdRes,
          voiture: car,
          meta: resPayload.meta
        };
        const exists = local.some(l => l._id === fullItem._id || l.id === fullItem.id);
        if (!exists) {
          local.unshift(fullItem);
          localStorage.setItem('qantra_local_reservations', JSON.stringify(local));
        }
      } catch (e) {
        console.warn(e);
      }

      setConfirmedBooking({
        ...createdRes,
        car,
        days,
        grandTotal,
        paymentMode,
        pickupCity,
        driverName,
        driverLicense
      });

      if (onBookingSuccess) {
        onBookingSuccess(createdRes);
      }

      setStep(4);
    } catch (err) {
      console.error('Reservation error:', err);
      if (err.message && (err.message.includes('déjà réservé') || err.message.includes('409'))) {
        setErrorMsg('Ce véhicule est déjà réservé pour ces dates. Veuillez choisir d\'autres dates ou un autre véhicule.');
      } else {
        setErrorMsg(err.message || 'Une erreur est survenue lors de la création de la réservation.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Car className="w-4 h-4" />
              <span>Réservation Véhicule</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              {car.brand || car.marque} {car.model || car.modele}
            </h3>
            <p className="text-xs text-slate-300">
              {car.immatriculation} • {car.category || car.categorie?.nom || 'Tourisme'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerte si véhicule indisponible */}
        {!available && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>Attention : Ce véhicule est actuellement marqué comme indisponible ou en cours de location.</span>
          </div>
        )}

        {/* Step Indicator (Steps 1 to 3) */}
        {step < 4 && (
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80 flex items-center justify-between text-xs font-bold">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-brand-600' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-brand-600 text-white' : 'bg-slate-200'}`}>
                1
              </span>
              <span>Dates & Lieu</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-brand-600' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-brand-600 text-white' : 'bg-slate-200'}`}>
                2
              </span>
              <span>Conducteur</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-brand-600' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-brand-600 text-white' : 'bg-slate-200'}`}>
                3
              </span>
              <span>Paiement</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Dates, City, Options */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-600" /> Date de début
                </label>
                <input
                  type="date"
                  min={today}
                  value={dateDebut}
                  onChange={(e) => setDateDebut(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-600" /> Date de fin (minimum 1 jour)
                </label>
                <input
                  type="date"
                  min={dateDebut}
                  value={dateFin}
                  onChange={(e) => setDateFin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>
            </div>

            {/* Disponibilité & Calendrier interactif */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-600" /> Calendrier de Disponibilité
                </span>
                {hasConflict ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                    Dates Indisponibles
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Période Libre
                  </span>
                )}
              </div>

              {hasConflict && conflictingRange && (
                <div className="text-xs text-rose-600 font-semibold mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Conflit : ce véhicule est déjà réservé du {conflictingRange.startStr} au {conflictingRange.endStr}.</span>
                </div>
              )}

              {bookedRanges.length > 0 ? (
                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-600">Périodes occupées par d'autres clients :</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {bookedRanges.map((r, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-mono font-medium">
                        {r.startStr} → {r.endStr}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-emerald-600 font-medium">
                  Ce véhicule n'a aucune réservation sur cette période : il est entièrement disponible.
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-600" /> Agence de livraison
              </label>
              <select
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="Tunis (Aéroport Carthage)">Tunis (Aéroport Tunis-Carthage - Gratuit)</option>
                <option value="Tunis Centre Ville">Tunis (Agence Centre Ville)</option>
                <option value="Sousse">Sousse / Port El Kantaoui</option>
                <option value="Monastir (Aéroport)">Monastir (Aéroport Habib Bourguiba)</option>
                <option value="Hammamet">Hammamet / Yasmine</option>
                <option value="Djerba (Aéroport)">Djerba (Aéroport Djerba-Zarzis)</option>
                <option value="Sfax">Sfax Centre</option>
              </select>
            </div>

            {/* Extras */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 uppercase block">Options supplémentaires</label>
              
              <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={extraInsurance}
                    onChange={(e) => setExtraInsurance(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Pack Zéro Franchise (Sérénité)</div>
                    <div className="text-[11px] text-slate-500">Couvre bris de glace, pneus et carrosserie sans caution résiduelle</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-600">+15 DT / j</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={babySeat}
                    onChange={(e) => setBabySeat(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">Siège bébé homologué ISOFIX</div>
                    <div className="text-[11px] text-slate-500">Confort et sécurité pour enfants de 0 à 4 ans</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-600">+10 DT / j</span>
              </label>
            </div>

            {/* Price Preview Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Durée de location :</span>
                <span className="font-bold text-slate-800">{days} jour{days > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Tarif de base ({formatMoney(dailyRate)} {currencySymbol} x {days}j) :</span>
                <span className="font-bold text-slate-800">{formatMoney(baseTotal)} {currencySymbol}</span>
              </div>
              {extrasTotal > 0 && (
                <div className="flex justify-between text-xs text-brand-600">
                  <span>Options sélectionnées :</span>
                  <span className="font-bold">+{formatMoney(extrasTotal)} {currencySymbol}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total estimé :</span>
                <span className="text-2xl font-black text-brand-700">
                  {formatMoney(grandTotal)} {currencySymbol}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!available}
                className={`w-full sm:w-auto px-8 py-3 font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all ${
                  available
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Continuer vers le conducteur</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Driver Info */}
        {step === 2 && (
          <form onSubmit={handleNextStep} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-brand-600" /> Prénom et Nom du conducteur principal
              </label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Ex: Ahmed Ben Salah"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-brand-600" /> Adresse Email
                </label>
                <input
                  type="email"
                  value={driverEmail}
                  onChange={(e) => setDriverEmail(e.target.value)}
                  placeholder="contact@exemple.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-brand-600" /> Téléphone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  placeholder="+216 98 123 456"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-brand-600" /> Numéro de permis de conduire
              </label>
              <input
                type="text"
                value={driverLicense}
                onChange={(e) => setDriverLicense(e.target.value)}
                placeholder="Ex: TN-081492 / Permis international"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Le permis de conduire doit avoir au moins 2 ans d'ancienneté.
              </span>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>

              <button
                type="submit"
                className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all"
              >
                <span>Passer au paiement</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Payment Choice & Final Validation */}
        {step === 3 && (
          <div className="p-6 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-2">
                Choisissez votre mode de règlement
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMode('especes')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMode === 'especes'
                      ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Banknote className="w-6 h-6 text-brand-600 mb-2" />
                  <div className="text-xs font-bold text-slate-900">À la livraison</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Espèces ou chèque certifié le jour J</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('carte')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMode === 'carte'
                      ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-brand-600 mb-2" />
                  <div className="text-xs font-bold text-slate-900">Carte Bancaire</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Visa, Mastercard, CIB tunisienne</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('en_ligne')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMode === 'en_ligne'
                      ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="w-6 h-6 text-brand-600 mb-2" />
                  <div className="text-xs font-bold text-slate-900">Paiement Garanti</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Acompte 20% & reste sur place</div>
                </button>
              </div>
            </div>

            {/* Recap container */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-800 text-sm mb-1">Récapitulatif de votre location</div>
              <div className="flex justify-between text-slate-600">
                <span>Véhicule :</span>
                <span className="font-bold text-slate-800">{car.brand || car.marque} {car.model || car.modele} ({car.immatriculation})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Période :</span>
                <span className="font-bold text-slate-800">Du {dateDebut} au {dateFin} ({days} jour{days > 1 ? 's' : ''})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Lieu de livraison :</span>
                <span className="font-bold text-slate-800">{pickupCity}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Conducteur :</span>
                <span className="font-bold text-slate-800">{driverName} ({driverLicense})</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-base font-bold text-slate-900">
                <span>Montant net à régler :</span>
                <span className="text-xl font-black text-brand-700">
                  {formatMoney(grandTotal)} {currencySymbol}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Modifier</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmReservation}
                disabled={submitting}
                className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{submitting ? 'Validation en cours...' : 'Confirmer la réservation'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Success Confirmation Voucher */}
        {step === 4 && confirmedBooking && (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-1">
                Félicitations, votre réservation est confirmée !
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Un email récapitulatif a été envoyé à <strong>{driverEmail}</strong>. Notre agent vous accueillera avec le véhicule.
              </p>
            </div>

            {/* Voucher Box */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 text-left max-w-lg mx-auto space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">N° de Réservation</div>
                  <div className="font-mono font-black text-sm text-brand-700">
                    QNT-{(confirmedBooking._id || confirmedBooking.id || '2026').slice(-8).toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Statut</div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Confirmée
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Véhicule :</span>
                  <span className="font-bold text-slate-800">{car.brand || car.marque} {car.model || car.modele}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Lieu de retrait :</span>
                  <span className="font-bold text-slate-800">{pickupCity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Du :</span>
                  <span className="font-bold text-slate-800">{dateDebut}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Au :</span>
                  <span className="font-bold text-slate-800">{dateFin}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-600">Total réglé / dû :</span>
                <span className="text-xl font-black text-brand-700">
                  {formatMoney(grandTotal)} {currencySymbol}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer le reçu</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all"
              >
                Terminer
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
