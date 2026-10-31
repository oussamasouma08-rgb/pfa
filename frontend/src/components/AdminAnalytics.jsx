import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart3, Activity, Download } from 'lucide-react';

const STATUS_COLORS = {
  confirmee: '#10b981', // green
  en_attente: '#f59e0b', // amber
  terminee: '#3b82f6',  // blue
  annulee: '#ef4444'   // red
};

export default function AdminAnalytics({ cars = [], categories = [], reservations = [], currency = 'TND' }) {
  
  // 1. Chiffre d'affaires par catégorie
  const revenueByCategory = useMemo(() => {
    const map = {};
    categories.forEach(c => { map[c.nom] = 0; });

    reservations
      .filter(r => r.statut !== 'annulee')
      .forEach(r => {
        const car = r.voiture || {};
        const catName = car.category || car.categorie?.nom || 'Autre';
        map[catName] = (map[catName] || 0) + Number(r.prixTotal || 0);
      });

    return Object.entries(map).map(([nom, revenue]) => ({
      nom,
      chiffreAffaires: revenue
    }));
  }, [categories, reservations]);

  // 2. Répartition des statuts de réservation
  const statusDistribution = useMemo(() => {
    const counts = { confirmee: 0, en_attente: 0, terminee: 0, annulee: 0 };
    reservations.forEach(r => {
      const s = r.statut || 'en_attente';
      if (counts[s] !== undefined) counts[s]++;
      else counts.en_attente++;
    });

    const labels = {
      confirmee: 'Confirmées',
      en_attente: 'En attente',
      terminee: 'Terminées',
      annulee: 'Annulées'
    };

    return Object.entries(counts).map(([key, value]) => ({
      name: labels[key] || key,
      value,
      color: STATUS_COLORS[key] || '#94a3b8'
    }));
  }, [reservations]);

  // 3. Top véhicules les plus demandés
  const topCars = useMemo(() => {
    const counts = {};
    reservations.forEach(r => {
      const car = r.voiture || {};
      const name = `${car.marque || car.brand || ''} ${car.modele || car.model || ''}`.trim() || 'Véhicule';
      counts[name] = (counts[name] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [reservations]);

  // KPIs
  const totalRevenue = reservations
    .filter(r => r.statut !== 'annulee')
    .reduce((acc, curr) => acc + Number(curr.prixTotal || 0), 0);

  const avgCart = reservations.length > 0 
    ? (totalRevenue / reservations.filter(r => r.statut !== 'annulee').length || 1).toFixed(0)
    : 0;

  const totalOccupancy = cars.length > 0
    ? ((cars.filter(c => c.statut === 'louee' || !c.available).length / cars.length) * 100).toFixed(0)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* KPI Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Taux d'occupation flotte</div>
            <div className="text-2xl font-black text-brand-600 mt-1">{totalOccupancy} %</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Véhicules loués actuellement</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Panier Moyen Location</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{avgCart} {currency === 'EUR' ? '€' : 'DT'}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Par contrat validé</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase">Total Réservations</div>
            <div className="text-2xl font-black text-indigo-600 mt-1">{reservations.length}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Contrats générés au total</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Graphique 1: CA par catégorie */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-600" />
                Chiffre d'Affaires par Catégorie
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Répartition du revenu selon les types de véhicules (DT)</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByCategory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="nom" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(val) => [`${val} DT`, 'Chiffre d\'Affaires']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="chiffreAffaires" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique 2: Statuts des réservations (Donut) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-indigo-600" />
                État des Réservations
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Répartition des contrats selon leur statut actuel</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {reservations.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-semibold text-slate-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-400 text-xs">Aucune réservation pour afficher le graphique.</div>
            )}
          </div>
        </div>

      </div>

      {/* Top 5 Véhicules demandés */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Top 5 des Véhicules les Plus Réservés
        </h3>

        {topCars.length > 0 ? (
          <div className="space-y-3">
            {topCars.map((item, index) => {
              const maxCount = topCars[0]?.count || 1;
              const percent = Math.round((item.count / maxCount) * 100);
              return (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="w-36 text-xs font-bold text-slate-800 truncate">{item.name}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-brand-600 h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-xs font-mono font-bold text-slate-600">
                    {item.count} réserv.
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 text-xs">Aucune donnée de réservation disponible.</p>
        )}
      </div>

    </div>
  );
}
