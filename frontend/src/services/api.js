// src/services/api.js

const API_BASE_URL = 'http://localhost:5000/api';

// Fallback demo cars if backend is offline or empty
export const FALLBACK_CARS = [
  {
    id: "6ae13e2d700014e5c5cfbe56",
    _id: "6ae13e2d700014e5c5cfbe56",
    brand: "Mercedes-Benz",
    marque: "Mercedes-Benz",
    model: "Classe C",
    modele: "Classe C",
    year: 2023,
    annee: 2023,
    immatriculation: "DEMO-C-001",
    price_per_day: 180,
    tarifJournalier: 180,
    kilometrage: 12500,
    transmission: "Automatique",
    fuel_type: "Essence",
    typeCarburant: "Essence",
    seats: 5,
    nbPlaces: 5,
    available: true,
    statut: "disponible",
    category: "Berline",
    categorie: { _id: "6ae13e2d700014e5c5cfbe55", nom: "Berline" },
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80",
    image_url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "6ae13e2d700014e5c5cfbe58",
    _id: "6ae13e2d700014e5c5cfbe58",
    brand: "Toyota",
    marque: "Toyota",
    model: "Corolla",
    modele: "Corolla",
    year: 2022,
    annee: 2022,
    immatriculation: "DEMO-C-002",
    price_per_day: 95,
    tarifJournalier: 95,
    kilometrage: 24000,
    transmission: "Automatique",
    fuel_type: "Hybride",
    typeCarburant: "Hybride",
    seats: 5,
    nbPlaces: 5,
    available: true,
    statut: "disponible",
    category: "Compacte",
    categorie: { _id: "6ae13e2d700014e5c5cfbe57", nom: "Compacte" },
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80",
    image_url: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "6ae13e2e700014e5c5cfbe5a",
    _id: "6ae13e2e700014e5c5cfbe5a",
    brand: "Hyundai",
    marque: "Hyundai",
    model: "Tucson",
    modele: "Tucson",
    year: 2023,
    annee: 2023,
    immatriculation: "DEMO-S-001",
    price_per_day: 140,
    tarifJournalier: 140,
    kilometrage: 8500,
    transmission: "Manuelle",
    fuel_type: "Diesel",
    typeCarburant: "Diesel",
    seats: 5,
    nbPlaces: 5,
    available: true,
    statut: "disponible",
    category: "SUV",
    categorie: { _id: "6ae13e2e700014e5c5cfbe59", nom: "SUV" },
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80",
    image_url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "6ae13e2e700014e5c5cfbe5b",
    _id: "6ae13e2e700014e5c5cfbe5b",
    brand: "BMW",
    marque: "BMW",
    model: "Série 4 Gran Coupé",
    modele: "Série 4 Gran Coupé",
    year: 2024,
    annee: 2024,
    immatriculation: "DEMO-B-004",
    price_per_day: 230,
    tarifJournalier: 230,
    kilometrage: 4200,
    transmission: "Automatique",
    fuel_type: "Essence",
    typeCarburant: "Essence",
    seats: 5,
    nbPlaces: 5,
    available: true,
    statut: "disponible",
    category: "Luxe",
    categorie: { _id: "6ae13e2d700014e5c5cfbe55", nom: "Berline" },
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80",
    image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80"
  }
];

export const FALLBACK_CATEGORIES = [
  { _id: "6ae13e2d700014e5c5cfbe55", nom: "Berline", description: "Confort, élégance et voyages longue distance" },
  { _id: "6ae13e2d700014e5c5cfbe57", nom: "Compacte", description: "Idéale pour la circulation en ville et économie d'énergie" },
  { _id: "6ae13e2e700014e5c5cfbe59", nom: "SUV", description: "Espace généreux, puissance et robustesse tout-terrain" },
  { _id: "6ae13e2e700014e5c5cfbe60", nom: "Luxe & Sport", description: "Véhicules prestigieux haut de gamme" }
];

export const FALLBACK_REVIEWS = [
  {
    _id: "rev1",
    client: { prenom: "Mehdi", nom: "Trabelsi" },
    note: 5,
    commentaire: "Service irréprochable ! La Mercedes Classe C était en parfait état, propre et livrée à l'aéroport de Tunis-Carthage à l'heure.",
    date: "2026-10-20T10:00:00Z"
  },
  {
    _id: "rev2",
    client: { prenom: "Sarra", nom: "Gharbi" },
    note: 5,
    commentaire: "Excellente agence. La Toyota Corolla consomme très peu, réservation facile et équipe très professionnelle à Sousse.",
    date: "2026-10-18T14:30:00Z"
  },
  {
    _id: "rev3",
    client: { prenom: "Karim", nom: "Mansour" },
    note: 4,
    commentaire: "Très bon rapport qualité-prix. Le SUV Tucson nous a permis de visiter le Sud tunisien en toute sérénité.",
    date: "2026-10-12T09:15:00Z"
  }
];

// Helper to make API requests with timeout and 401 auto-logout
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const token = localStorage.getItem('qantra_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      // Déconnexion automatique sur 401 Unauthorized
      if (res.status === 401) {
        localStorage.removeItem('qantra_token');
        localStorage.removeItem('qantra_user');
        window.dispatchEvent(new CustomEvent('auth-unauthorized'));
      }

      const errorData = await res.json().catch(() => ({}));
      const err = new Error(errorData.message || `Erreur serveur (${res.status})`);
      err.status = res.status;
      err.isHttpError = true; // Signal que le backend a répondu
      throw err;
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Vérifie si l'erreur est liée à une indisponibilité réseau (backend éteint ou timeout)
function isNetworkUnavailable(err) {
  return !err.isHttpError && (
    err.name === 'AbortError' || 
    err.name === 'TypeError' || 
    err.message?.includes('Failed to fetch') || 
    err.message?.includes('NetworkError')
  );
}

export const api = {
  // Health check
  async checkHealth() {
    try {
      const data = await request('/');
      return { ok: true, data };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  // Auth
  async login(email, password) {
    try {
      return await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      // Le fallback démo s'active UNIQUEMENT si le backend est injoignable (réseau / hors ligne)
      if (isNetworkUnavailable(err)) {
        if (email === 'admin@9antra.tn' && password === 'admin123') {
          return {
            message: 'Connexion démo administrateur réussie',
            user: { id: 'admin1', name: 'Administrateur 9antra', email, role: 'admin', phone: '+216 71 000 999' },
            token: 'demo_admin_jwt_token'
          };
        }
        if (email === 'client@9antra.tn' && password === 'password123') {
          return {
            message: 'Connexion démo client réussie',
            user: { id: 'client1', name: 'Sami Ben Salah', email, role: 'user', phone: '+216 98 123 456' },
            token: 'demo_client_jwt_token'
          };
        }
      }
      throw err;
    }
  },

  async register(userData) {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Cars
  async getCars(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.brand) query.append('brand', params.brand);
      if (params.maxPrice) query.append('maxPrice', params.maxPrice);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const cars = await request(`/cars${qs}`);
      if (Array.isArray(cars) && cars.length > 0) {
        return cars;
      }
      return FALLBACK_CARS;
    } catch (err) {
      if (isNetworkUnavailable(err)) {
        console.warn('Backend injoignable, utilisation de la flotte démo locale.');
        return FALLBACK_CARS;
      }
      throw err;
    }
  },

  async getCarById(id) {
    try {
      return await request(`/cars/${id}`);
    } catch (err) {
      if (isNetworkUnavailable(err)) {
        return FALLBACK_CARS.find(c => (c.id === id || c._id === id)) || null;
      }
      throw err;
    }
  },

  async createCar(carData) {
    return await request('/cars', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  },

  async updateCar(id, carData) {
    return await request(`/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
  },

  async deleteCar(id) {
    return await request(`/cars/${id}`, {
      method: 'DELETE',
    });
  },

  // Categories
  async getCategories() {
    try {
      const cats = await request('/categories');
      if (Array.isArray(cats) && cats.length > 0) return cats;
      return FALLBACK_CATEGORIES;
    } catch (err) {
      if (isNetworkUnavailable(err)) {
        return FALLBACK_CATEGORIES;
      }
      throw err;
    }
  },

  async createCategory(catData) {
    return await request('/categories', {
      method: 'POST',
      body: JSON.stringify(catData),
    });
  },

  async deleteCategory(id) {
    return await request(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Reservations
  async getReservations() {
    try {
      return await request('/reservations');
    } catch (err) {
      if (isNetworkUnavailable(err)) {
        console.warn('Backend injoignable, chargement des réservations locales.');
        const local = localStorage.getItem('qantra_local_reservations');
        return local ? JSON.parse(local) : [];
      }
      throw err;
    }
  },

  async createReservation(resData) {
    try {
      return await request('/reservations', {
        method: 'POST',
        body: JSON.stringify(resData),
      });
    } catch (err) {
      // Fallback local uniquement si déconnecté du réseau
      if (isNetworkUnavailable(err)) {
        const local = JSON.parse(localStorage.getItem('qantra_local_reservations') || '[]');
        const newRes = {
          _id: 'local_res_' + Date.now(),
          ...resData,
          dateCreation: new Date().toISOString(),
          statut: resData.statut || 'en_attente'
        };
        local.unshift(newRes);
        localStorage.setItem('qantra_local_reservations', JSON.stringify(local));
        return newRes;
      }
      // Si le backend a répondu avec 400 ou 409, propager l'erreur exacte
      throw err;
    }
  },

  async updateReservation(id, data) {
    return await request(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteReservation(id) {
    return await request(`/reservations/${id}`, {
      method: 'DELETE',
    });
  },

  // Payments
  async getPaiements() {
    try {
      return await request('/paiements');
    } catch {
      return [];
    }
  },

  async createPaiement(paymentData) {
    try {
      return await request('/paiements', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });
    } catch (err) {
      if (isNetworkUnavailable(err)) {
        return {
          _id: 'pay_' + Date.now(),
          ...paymentData,
          datePaiement: new Date().toISOString(),
          statut: 'paye'
        };
      }
      throw err;
    }
  },

  // Reviews
  async getAvis() {
    try {
      const reviews = await request('/avis');
      if (Array.isArray(reviews) && reviews.length > 0) return reviews;
      return FALLBACK_REVIEWS;
    } catch (err) {
      if (isNetworkUnavailable(err)) {
        return FALLBACK_REVIEWS;
      }
      throw err;
    }
  },

  async createAvis(avisData) {
    try {
      return await request('/avis', {
        method: 'POST',
        body: JSON.stringify(avisData),
      });
    } catch (err) {
      if (isNetworkUnavailable(err)) {
        const local = JSON.parse(localStorage.getItem('qantra_local_reviews') || '[]');
        const newReview = {
          _id: 'rev_' + Date.now(),
          ...avisData,
          date: new Date().toISOString()
        };
        local.unshift(newReview);
        localStorage.setItem('qantra_local_reviews', JSON.stringify(local));
        return newReview;
      }
      throw err;
    }
  },

  // Clients & Profile
  async getClients() {
    try {
      return await request('/clients');
    } catch {
      return [];
    }
  },

  async getMyProfile() {
    try {
      return await request('/client/me');
    } catch {
      return null;
    }
  },

  async updateMyProfile(profileData) {
    return await request('/client/me', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Password Reset
  async forgotPassword(email) {
    return await request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async resetPassword(token, password) {
    return await request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    });
  },

  // Maintenance
  async addCarMaintenance(carId, maintenanceData) {
    return await request(`/cars/${carId}/maintenance`, {
      method: 'POST',
      body: JSON.stringify(maintenanceData)
    });
  }
};
