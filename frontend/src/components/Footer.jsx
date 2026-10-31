import React from 'react';
import { 
  Car, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Heart,
  ExternalLink
} from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                <Car className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                9antra<span className="text-brand-500">Drive</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Votre agence de référence pour la location de véhicules récents, utilitaires et de luxe en Tunisie. Profitez de nos offres avec kilométrage illimité et livraison gratuite aux aéroports.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Assistance & réservations 24h/24, 7j/7</span>
            </div>
          </div>

          {/* Col 2: Agences en Tunisie */}
          <div>
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider mb-4 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              <span>Nos Points de Retrait</span>
            </h4>
            <ul className="space-y-2.5">
              <li>
                <strong className="text-slate-300 block">Aéroport Tunis-Carthage (TUN)</strong>
                <span className="text-[11px] text-slate-500">Terminal des arrivées — 24h/24</span>
              </li>
              <li>
                <strong className="text-slate-300 block">Sousse & Port El Kantaoui</strong>
                <span className="text-[11px] text-slate-500">Boulevard du 14 Janvier</span>
              </li>
              <li>
                <strong className="text-slate-300 block">Aéroport Djerba-Zarzis (DJE)</strong>
                <span className="text-[11px] text-slate-500">Zone Touristique Midoun</span>
              </li>
              <li>
                <strong className="text-slate-300 block">Aéroport Monastir (MIR) & Enfidha</strong>
                <span className="text-[11px] text-slate-500">Accueil personnalisé aux vols</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation rapide */}
          <div>
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-white transition-colors"
                >
                  Flotte de Véhicules & Tarifs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors"
                >
                  Nos Services & Assurances
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('reviews')}
                  className="hover:text-white transition-colors"
                >
                  Avis et Retours Clients
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('reservations')}
                  className="hover:text-white transition-colors"
                >
                  Mes Réservations en cours
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('admin')}
                  className="hover:text-brand-400 transition-colors font-bold"
                >
                  Espace Back-Office Agence
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact direct */}
          <div>
            <h4 className="text-white font-bold uppercase text-[11px] tracking-wider mb-4">
              Contact Agence
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span className="text-white font-semibold">+216 71 000 999 / +216 98 123 456</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span className="text-slate-300">reservation@9antra.tn</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <span className="text-slate-400">Lun - Dim : 07h00 — 23h00</span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px]">
              <span className="text-slate-300 font-semibold block mb-0.5">Mode paiement acceptés</span>
              <span className="text-slate-500">Espèces (DT, EUR, USD), Carte Visa / Mastercard, CIB tunisienne</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} 9antra Drive Location Tunisie. Tous droits réservés.
          </div>
          <div className="flex items-center gap-1">
            <span>Conçu avec excellence pour les conducteurs en Tunisie</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
