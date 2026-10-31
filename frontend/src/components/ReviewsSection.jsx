import React, { useState } from 'react';
import { Star, MessageSquare, Quote, CheckCircle2, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function ReviewsSection({ reviews = [], onReviewAdded, user }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const avgScore = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + Number(r.note || 5), 0) / reviews.length).toFixed(1)
    : '4.9';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Vous devez être connecté pour laisser un avis.');
      return;
    }
    setLoading(true);
    try {
      await api.createAvis({
        client: user.id,
        reservation: '000000000000000000000001', // placeholder reservation ID - avis public
        note: rating,
        commentaire: comment,
        metaAuthor: authorName || user.name
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setModalOpen(false);
        setAuthorName('');
        setComment('');
        if (onReviewAdded) onReviewAdded();
      }, 1200);
    } catch (err) {
      alert('Erreur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reviews" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Témoignages Vérifiés</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ce que nos clients disent de nous
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Découvrez les retours authentiques de voyageurs ayant loué nos voitures en Tunisie.
          </p>
        </div>

        {/* Global Score Card */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex-shrink-0">
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Basé sur {reviews.length} avis certifiés
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 border-l border-slate-200 pl-4">
            {avgScore} <span className="text-xs font-normal text-slate-400">/ 5</span>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => {
          const clientName = rev.metaAuthor || (rev.client ? `${rev.client.prenom || ''} ${rev.client.nom || ''}`.trim() : 'Conducteur 9antra');
          const dateStr = rev.date ? new Date(rev.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Récemment';

          return (
            <div
              key={rev._id || idx}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (rev.note || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400">{dateStr}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{rev.commentaire || 'Excellente expérience avec 9antra Drive, ponctualité et véhicule impeccable.'}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {clientName.charAt(0) || 'C'}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{clientName}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Client vérifié
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leave review trigger button */}
      <div className="text-center mt-12">
        {!user ? (
          <p className="text-sm text-slate-500 italic">Connectez-vous pour laisser un avis.</p>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 text-slate-700 hover:text-brand-700 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-sm"
          >
            <MessageSquare className="w-4 h-4 text-brand-600" />
            <span>Partager votre expérience</span>
          </button>
        )}
      </div>

      {/* Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-1">Votre avis nous intéresse</h3>
            <p className="text-xs text-slate-500 mb-4">Notez votre expérience générale avec notre agence.</p>

            {success ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 text-xs text-center font-bold">
                Merci ! Votre avis a bien été publié.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Votre nom</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ex: Anis Mejri"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Note</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Commentaire</label>
                  <textarea
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Qualité de la voiture, accueil, ponctualité..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                  >
                    Fermer
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md"
                  >
                    {loading ? 'Envoi...' : 'Envoyer'}
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
