import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, User, Settings, LogOut, ChevronRight, Star, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Reservation } from '../services/api';

const reservationCardClass =
  'bg-white border border-gray-200 rounded-lg p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-200';

type ReservationCardVariant = 'upcoming' | 'past' | 'cancelled' | 'other';

interface ReservationListCardProps {
  reservation: Reservation;
  fieldInfo: { name: string; address: string };
  variant: ReservationCardVariant;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  onEdit?: () => void;
  onCancel?: () => void;
}

const ReservationListCard: React.FC<ReservationListCardProps> = ({
  reservation,
  fieldInfo,
  variant,
  getStatusColor,
  getStatusText,
  onEdit,
  onCancel,
}) => {
  const muted = variant !== 'upcoming';
  const accentClass =
    variant === 'upcoming'
      ? 'border-l-4 border-l-green-600'
      : variant === 'cancelled'
        ? 'border-l-4 border-l-red-400'
        : variant === 'other'
          ? 'border-l-4 border-l-amber-400'
          : 'border-l-4 border-l-gray-300';

  return (
    <div
      className={`${reservationCardClass} ${accentClass} ${muted ? 'opacity-[0.97]' : ''}`}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <h5 className="text-lg font-bold leading-snug text-gray-900 md:text-xl">
            {fieldInfo.name}
          </h5>
          <div className="space-y-2.5 text-sm text-gray-600">
            <div className="flex items-start gap-2.5">
              <Calendar size={18} className="mt-0.5 shrink-0 text-gray-400" />
              <span>{reservation.date}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock size={18} className="mt-0.5 shrink-0 text-gray-400" />
              <span>
                {reservation.timeSlot
                  ? `${reservation.timeSlot.startTime} - ${reservation.timeSlot.endTime}`
                  : 'Créneau inconnu'}
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin size={18} className="mt-0.5 shrink-0 text-gray-400" />
              <span className="leading-relaxed">{fieldInfo.address}</span>
            </div>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col items-stretch gap-3 sm:w-auto sm:min-w-[148px] sm:items-end">
          <div className="flex flex-col gap-2 sm:items-end">
            <span
              className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                reservation.status
              )}`}
            >
              {getStatusText(reservation.status)}
            </span>
            <div
              className={`text-lg font-semibold tabular-nums ${
                variant === 'upcoming' ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              {reservation.totalPrice}€
            </div>
          </div>

          {variant === 'upcoming' && onEdit && onCancel && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="w-full rounded-md bg-green-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition hover:bg-green-700 sm:min-w-[148px]"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full rounded-md bg-red-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition hover:bg-red-700 sm:min-w-[148px]"
              >
                Annuler
              </button>
            </div>
          )}

          {variant === 'past' && (
            <button
              type="button"
              className="mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-transparent py-2 text-sm font-medium text-green-600 transition hover:text-green-700 sm:w-auto sm:justify-end"
            >
              <Star size={16} className="shrink-0" />
              Noter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reservations');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        console.log('Fetching reservations...');
        setLoading(true);
        const response = await apiService.getMyReservations({ limit: 100 });
        
        console.log('API Response:', response);
        
        if (response.success) {
          const list = Array.isArray(response.data) ? response.data : [];
          console.log('Setting reservations:', list);
          setReservations(list);
        } else {
          console.log('API Error:', response.message);
          setError('Erreur lors du chargement des réservations');
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setError('Erreur lors du chargement des réservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const startOfToday = () => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  };

  /** Parse YYYY-MM-DD in local calendar (avoids UTC off-by-one). Returns null if invalid. */
  const parseReservationDay = (dateStr: string): Date | null => {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const t = dateStr.trim();
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(t);
    if (m) {
      const y = parseInt(m[1], 10);
      const mo = parseInt(m[2], 10) - 1;
      const d = parseInt(m[3], 10);
      const local = new Date(y, mo, d);
      return Number.isNaN(local.getTime()) ? null : local;
    }
    const parsed = new Date(t);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const isOnOrAfterToday = (dateStr: string) => {
    const day = parseReservationDay(dateStr);
    if (day === null) return true;
    return day >= startOfToday();
  };

  const isBeforeToday = (dateStr: string) => {
    const day = parseReservationDay(dateStr);
    if (day === null) return false;
    return day < startOfToday();
  };

  // API creates bookings as `pending`; only `confirmed` was shown under "À venir", so `pending` was invisible.
  const upcomingReservations = reservations.filter(
    r =>
      (r.status === 'pending' || r.status === 'confirmed') &&
      isOnOrAfterToday(r.date)
  );
  const pastReservations = reservations.filter(
    r =>
      r.status === 'completed' ||
      ((r.status === 'confirmed' || r.status === 'pending') && isBeforeToday(r.date))
  );
  const cancelledReservations = reservations.filter(r => r.status === 'cancelled');

  const shownIds = new Set([
    ...upcomingReservations.map((r) => r.id),
    ...pastReservations.map((r) => r.id),
    ...cancelledReservations.map((r) => r.id),
  ]);
  const otherReservations = reservations.filter((r) => !shownIds.has(r.id));

  const handleCancelReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  const confirmCancelReservation = async () => {
    if (!selectedReservation) return;

    try {
      const response = await apiService.cancelReservation(selectedReservation.id);
      
      if (response.success) {
        // Update the reservation in the local state
        setReservations(prev => 
          prev.map(res => 
            res.id === selectedReservation.id 
              ? { ...res, status: 'cancelled' as const }
              : res
          )
        );
      } else {
        setError(response.message || 'Erreur lors de l\'annulation');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      setError('Erreur lors de l\'annulation');
    } finally {
      setShowCancelModal(false);
      setSelectedReservation(null);
    }
  };

  const handleEditReservation = (reservation: Reservation) => {
    // Navigate to edit page or open edit modal
    navigate(`/reservation/edit/${reservation.id}`);
  };

  // Helper function to get field information (populate can be null if field was removed)
  const getFieldInfo = (fieldId: Reservation['fieldId']) => {
    if (fieldId == null) {
      return { name: 'Terrain inconnu', address: 'Adresse non spécifiée' };
    }
    if (typeof fieldId === 'string') {
      return { name: 'Terrain inconnu', address: 'Adresse non spécifiée' };
    }
    const f = fieldId as { name?: string; address?: string };
    return {
      name: f.name || 'Terrain inconnu',
      address: f.address || 'Adresse non spécifiée'
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-900';
      case 'confirmed':
        return 'bg-green-50 text-green-800 ring-1 ring-inset ring-green-600/15';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* User Info Card */}
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-gray-600">Membre depuis Janvier 2024</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <User size={16} className="mr-2" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-2" />
                <span>{user?.phone || 'Non renseigné'}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total réservations</span>
                <span className="font-semibold">{reservations.length}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Actions rapides</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center">
                  <Settings size={20} className="mr-3 text-gray-600" />
                  <span>Paramètres</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition"
              >
                <div className="flex items-center">
                  <LogOut size={20} className="mr-3 text-red-600" />
                  <span className="text-red-600">Déconnexion</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-white">
                <div className="flex">
                <button
                  type="button"
                  onClick={() => setActiveTab('reservations')}
                  className={`px-6 py-3.5 text-sm font-medium transition ${
                    activeTab === 'reservations'
                      ? 'border-b-2 border-green-600 text-green-600'
                      : 'border-b-2 border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Mes Réservations
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('favorites')}
                  className={`px-6 py-3.5 text-sm font-medium transition ${
                    activeTab === 'favorites'
                      ? 'border-b-2 border-green-600 text-green-600'
                      : 'border-b-2 border-transparent text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Terrains favoris
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {activeTab === 'reservations' && (
                <div>
                  <h3 className="mb-8 text-2xl font-bold tracking-tight text-gray-900">
                    Mes réservations
                  </h3>

                  {/* Upcoming Reservations */}
                  {upcomingReservations.length > 0 && (
                    <div className="mb-10">
                      <h4 className="mb-4 text-base font-semibold text-gray-800">À venir</h4>
                      <div className="space-y-4">
                        {upcomingReservations.map((reservation) => {
                          const fieldInfo = getFieldInfo(reservation.fieldId);
                          return (
                            <ReservationListCard
                              key={reservation.id}
                              reservation={reservation}
                              fieldInfo={fieldInfo}
                              variant="upcoming"
                              getStatusColor={getStatusColor}
                              getStatusText={getStatusText}
                              onEdit={() => handleEditReservation(reservation)}
                              onCancel={() => handleCancelReservation(reservation)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Past Reservations */}
                  {pastReservations.length > 0 && (
                    <div className="mb-10">
                      <h4 className="mb-4 text-base font-semibold text-gray-800">Passées</h4>
                      <div className="space-y-4">
                        {pastReservations.map((reservation) => {
                          const fieldInfo = getFieldInfo(reservation.fieldId);
                          return (
                            <ReservationListCard
                              key={reservation.id}
                              reservation={reservation}
                              fieldInfo={fieldInfo}
                              variant="past"
                              getStatusColor={getStatusColor}
                              getStatusText={getStatusText}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Cancelled Reservations */}
                  {cancelledReservations.length > 0 && (
                    <div>
                      <h4 className="mb-4 text-base font-semibold text-gray-800">Annulées</h4>
                      <div className="space-y-4">
                        {cancelledReservations.map((reservation) => {
                          const fieldInfo = getFieldInfo(reservation.fieldId);
                          return (
                            <ReservationListCard
                              key={reservation.id}
                              reservation={reservation}
                              fieldInfo={fieldInfo}
                              variant="cancelled"
                              getStatusColor={getStatusColor}
                              getStatusText={getStatusText}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Réservations non classées (statut ou date inattendus) */}
                  {otherReservations.length > 0 && (
                    <div className="mb-10">
                      <h4 className="mb-4 text-base font-semibold text-gray-800">Autres</h4>
                      <div className="space-y-4">
                        {otherReservations.map((reservation, idx) => {
                          const fieldInfo = getFieldInfo(reservation.fieldId);
                          return (
                            <ReservationListCard
                              key={reservation.id || `other-${idx}`}
                              reservation={reservation}
                              fieldInfo={fieldInfo}
                              variant="other"
                              getStatusColor={getStatusColor}
                              getStatusText={getStatusText}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {upcomingReservations.length === 0 &&
                    pastReservations.length === 0 &&
                    cancelledReservations.length === 0 &&
                    otherReservations.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 text-lg mb-4">Vous n'avez aucune réservation</p>
                      <button
                        type="button"
                        onClick={() => navigate('/fields')}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Réserver un terrain
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Terrains favoris</h3>
                  <div className="text-center py-12">
                    <Star size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 text-lg mb-4">Vous n'avez aucun terrain favori</p>
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                      Explorer les terrains
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Annuler la réservation</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Non, garder
              </button>
              <button
                onClick={confirmCancelReservation}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Oui, annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
