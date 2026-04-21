import React, { useState } from 'react';
import { Calendar, MapPin, Clock, User, Settings, LogOut, ChevronRight, Star, X } from 'lucide-react';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reservations');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);

  const user = {
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '06 12 34 56 78',
    memberSince: 'Janvier 2024',
    totalReservations: 12
  };

  const reservations = [
    {
      id: '1',
      fieldName: 'Stade Municipal Jean Bouin',
      date: '2024-04-22',
      timeSlot: '18:30 - 20:00',
      status: 'confirmed',
      price: 35,
      address: '123 Avenue des Sports, Paris 15ème'
    },
    {
      id: '2',
      fieldName: 'Complex Sportif Le Parc',
      date: '2024-04-25',
      timeSlot: '14:00 - 15:30',
      status: 'confirmed',
      price: 40,
      address: '45 Rue du Football, Lyon'
    },
    {
      id: '3',
      fieldName: 'Terrain Les Verts',
      date: '2024-04-15',
      timeSlot: '20:00 - 21:30',
      status: 'completed',
      price: 30,
      address: '78 Boulevard Sportif, Marseille'
    }
  ];

  const upcomingReservations = reservations.filter(r => r.status === 'confirmed');
  const pastReservations = reservations.filter(r => r.status === 'completed');

  const handleCancelReservation = (reservationId: string) => {
    setSelectedReservation(reservationId);
    setShowCancelModal(true);
  };

  const confirmCancelReservation = () => {
    // Handle cancellation logic here
    setShowCancelModal(false);
    setSelectedReservation(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">Membre depuis {user.memberSince}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <User size={16} className="mr-2" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-2" />
                <span>{user.phone}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total réservations</span>
                <span className="font-semibold">{user.totalReservations}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-semibold mb-4">Actions rapides</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center">
                  <Settings size={20} className="mr-3 text-gray-600" />
                  <span>Paramètres</span>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
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
          <div className="bg-white rounded-lg shadow-lg mb-6">
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('reservations')}
                  className={`px-6 py-3 font-medium transition ${
                    activeTab === 'reservations'
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Mes Réservations
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`px-6 py-3 font-medium transition ${
                    activeTab === 'favorites'
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Terrains favoris
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'reservations' && (
                <div>
                  <h3 className="text-xl font-semibold mb-6">Mes réservations</h3>
                  
                  {/* Upcoming Reservations */}
                  {upcomingReservations.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-medium mb-4 text-gray-700">À venir</h4>
                      <div className="space-y-4">
                        {upcomingReservations.map((reservation) => (
                          <div key={reservation.id} className="border rounded-lg p-4 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="font-semibold text-lg mb-2">{reservation.fieldName}</h5>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Calendar size={16} className="mr-2" />
                                    <span>{reservation.date}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock size={16} className="mr-2" />
                                    <span>{reservation.timeSlot}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin size={16} className="mr-2" />
                                    <span>{reservation.address}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="mb-2">
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                                    {getStatusText(reservation.status)}
                                  </span>
                                </div>
                                <div className="text-lg font-semibold text-green-600 mb-2">
                                  {reservation.price}e
                                </div>
                                <div className="space-y-2">
                                  <button className="block w-full text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition">
                                    Modifier
                                  </button>
                                  <button
                                    onClick={() => handleCancelReservation(reservation.id)}
                                    className="block w-full text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                  >
                                    Annuler
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Past Reservations */}
                  {pastReservations.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-4 text-gray-700">Passées</h4>
                      <div className="space-y-4">
                        {pastReservations.map((reservation) => (
                          <div key={reservation.id} className="border rounded-lg p-4 opacity-75">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="font-semibold text-lg mb-2">{reservation.fieldName}</h5>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Calendar size={16} className="mr-2" />
                                    <span>{reservation.date}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock size={16} className="mr-2" />
                                    <span>{reservation.timeSlot}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="mb-2">
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                                    {getStatusText(reservation.status)}
                                  </span>
                                </div>
                                <div className="text-lg font-semibold text-gray-600">
                                  {reservation.price}e
                                </div>
                                <button className="mt-2 text-sm text-green-600 hover:text-green-700 flex items-center">
                                  <Star size={16} className="mr-1" />
                                  Noter
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {upcomingReservations.length === 0 && pastReservations.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 text-lg mb-4">Vous n'avez aucune réservation</p>
                      <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
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
