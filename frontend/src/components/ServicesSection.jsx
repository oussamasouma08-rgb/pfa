import React from 'react';
import { 
  Plane, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Key, 
  Sparkles, 
  FileCheck2, 
  Headphones,
  CheckCircle2
} from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      icon: Plane,
      title: 'Livraison Gratuite Aéroports',
      desc: 'Accueil VIP personnalisé dès la sortie de votre vol à Tunis-Carthage, Monastir, Enfidha ou Djerba. Clés en main sans attente au guichet.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: ShieldCheck,
      title: 'Assurance Tous Risques (CDW)',
      desc: 'Tous nos véhicules bénéficient d\'une couverture complète incluant vol, collision et assistance juridique pour rouler l\'esprit libre.',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: Clock,
      title: 'Assistance Dépannage 24/7',
      desc: 'Une équipe technique dédiée disponible jour et nuit sur l\'ensemble du territoire tunisien. Véhicule de remplacement garanti en cas de panne.',
      color: 'bg-amber-50 text-amber-600'
    },
    {
      icon: Key,
      title: 'Zéro Caution Cachée',
      desc: 'Transparence absolue : politique de prix claire, contrat détaillé sans mauvaise surprise et annulation gratuite jusqu\'à 48h avant.',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Sparkles,
      title: 'Flotte Récente & Désinfectée',
      desc: 'Des véhicules modèles 2023 à 2026 rigoureusement contrôlés sur 40 points de sécurité mécanique et esthétique avant chaque remise.',
      color: 'bg-rose-50 text-rose-600'
    },
    {
      icon: Headphones,
      title: 'Service Clientèle Dédié',
      desc: 'Conseillers multilingues (Français, Arabe, Anglais) joignables par téléphone, e-mail et WhatsApp pour organiser vos déplacements sur mesure.',
      color: 'bg-indigo-50 text-indigo-600'
    }
  ];

  return (
    <section id="services" className="bg-slate-100/70 py-20 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nos Engagements Qualité</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pourquoi choisir 9antra Drive ?
          </h2>
          <p className="text-slate-600 text-sm mt-3">
            Plus qu'une simple agence de location, nous offrons une expérience de voyage fluide et sécurisée partout en Tunisie.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-5`}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Banner strip */}
        <div className="mt-16 bg-gradient-to-r from-brand-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black mb-2">
              Vous préparez un séjour d'affaires ou des vacances en famille ?
            </h3>
            <p className="text-xs sm:text-sm text-brand-200 max-w-xl">
              Bénéficiez de remises spéciales à partir de 7 jours de location et de tarifs préférentiels sur nos berlines haut de gamme et SUV.
            </p>
          </div>
          <a
            href="#cars-catalog"
            className="px-6 py-3.5 rounded-2xl bg-white text-slate-900 font-extrabold text-xs sm:text-sm hover:bg-brand-50 transition-all shadow-md flex-shrink-0"
          >
            Consulter les tarifs
          </a>
        </div>

      </div>
    </section>
  );
}
