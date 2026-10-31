import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CarCatalog from './components/CarCatalog';
import CarDetailModal from './components/CarDetailModal';
import BookingModal from './components/BookingModal';
import MyReservations from './components/MyReservations';
import AdminDashboard from './components/AdminDashboard';
import ServicesSection from './components/ServicesSection';
import ReviewsSection from './components/ReviewsSection';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import Footer from './components/Footer';
import { api, FALLBACK_CARS, FALLBACK_CATEGORIES, FALLBACK_REVIEWS } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('catalog'); // 'catalog', 'services', 'reviews', 'reservations', 'admin'
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState('TND');
  const [backendOnline, setBackendOnline] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);

  // Modals
  const [selectedCarForDetail, setSelectedCarForDetail] = useState(null);
  const [selectedCarForBooking, setSelectedCarForBooking] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Search filter states from Hero
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pickupCity, setPickupCity] = useState('Tunis (Aéroport Carthage)');
  const [pickupDate, setPickupDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [returnDate, setReturnDate] = useState(() => new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);

  // Load user from storage on mount & listen to 401 token expiration
  useEffect(() => {
    const savedUser = localStorage.getItem('qantra_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }

    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, []);

  // Fetch all initial data
  const loadData = useCallback(async () => {
    try {
      // Check health
      const health = await api.checkHealth();
      setBackendOnline(health.ok);

      // Fetch in parallel
      const [carsData, catsData, resData, revData, payData] = await Promise.all([
        api.getCars(),
        api.getCategories(),
        api.getReservations(),
        api.getAvis(),
        api.getPaiements()
      ]);

      setCars(carsData && carsData.length > 0 ? carsData : FALLBACK_CARS);
      setCategories(catsData && catsData.length > 0 ? catsData : FALLBACK_CATEGORIES);
      setReservations(Array.isArray(resData) ? resData : []);
      setReviews(revData && revData.length > 0 ? revData : FALLBACK_REVIEWS);
      setPayments(Array.isArray(payData) ? payData : []);
    } catch (err) {
      console.warn('Backend unavailable, using client dataset:', err);
      setBackendOnline(false);
      setCars(FALLBACK_CARS);
      setCategories(FALLBACK_CATEGORIES);
      setReviews(FALLBACK_REVIEWS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Poll health / data every 30 seconds
    const interval = setInterval(loadData, 300000); // Poll toutes les 5 minutes
    return () => clearInterval(interval);
  }, [loadData]);

  const handleLogout = () => {
    localStorage.removeItem('qantra_token');
    localStorage.removeItem('qantra_user');
    setUser(null);
  };

  const handleBookingSuccess = (newRes) => {
    setReservations((prev) => [newRes, ...prev]);
    // Refresh fleet to reflect possible status changes
    loadData();
  };

  const handleHeroSearchSubmit = () => {
    setCurrentTab('catalog');
    const elem = document.getElementById('cars-catalog');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Top Banner if in Demo mode */}
      {!backendOnline && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white text-[11px] font-bold py-1.5 px-4 text-center tracking-wide">
          Mode Démonstration Actif — Pour synchroniser avec MongoDB Atlas, lancez le backend Node.js sur le port 5000.
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onLogout={handleLogout}
        currency={currency}
        setCurrency={setCurrency}
        backendOnline={backendOnline}
        reservationsCount={reservations.length}
      />

      {/* Body Views based on currentTab */}
      <main className="flex-1">
        {currentTab === 'catalog' && (
          <>
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              onSearchSubmit={handleHeroSearchSubmit}
              pickupCity={pickupCity}
              setPickupCity={setPickupCity}
              pickupDate={pickupDate}
              setPickupDate={setPickupDate}
              returnDate={returnDate}
              setReturnDate={setReturnDate}
            />

            <CarCatalog
              cars={cars}
              categories={categories}
              currency={currency}
              initialSearchQuery={searchQuery}
              initialCategory={selectedCategory}
              onBookCar={(car) => setSelectedCarForBooking(car)}
              onDetailCar={(car) => setSelectedCarForDetail(car)}
            />

            <ServicesSection />
            <ReviewsSection reviews={reviews} onReviewAdded={loadData} user={user} />
          </>
        )}

        {currentTab === 'services' && (
          <div className="py-8">
            <ServicesSection />
          </div>
        )}

        {currentTab === 'reviews' && (
          <div className="py-8">
            <ReviewsSection reviews={reviews} onReviewAdded={loadData} user={user} />
          </div>
        )}

        {currentTab === 'reservations' && (
          <MyReservations
            reservations={reservations}
            onRefresh={loadData}
            user={user}
            currency={currency}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            cars={cars}
            categories={categories}
            reservations={reservations}
            reviews={reviews}
            payments={payments}
            onRefresh={loadData}
            currency={currency}
          />
        )}
      </main>

      {/* Detail Modal */}
      <CarDetailModal
        car={selectedCarForDetail}
        isOpen={Boolean(selectedCarForDetail)}
        onClose={() => setSelectedCarForDetail(null)}
        currency={currency}
        onProceedToBook={(car) => {
          setSelectedCarForDetail(null);
          setSelectedCarForBooking(car);
        }}
      />

      {/* Booking Wizard Modal */}
      <BookingModal
        car={selectedCarForBooking}
        isOpen={Boolean(selectedCarForBooking)}
        onClose={() => setSelectedCarForBooking(null)}
        user={user}
        currency={currency}
        defaultPickupDate={pickupDate}
        defaultReturnDate={returnDate}
        defaultCity={pickupCity}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          loadData();
        }}
      />

      {/* Footer */}
      <Footer onNavigate={(tab) => setCurrentTab(tab)} />

    </div>
  );
}
