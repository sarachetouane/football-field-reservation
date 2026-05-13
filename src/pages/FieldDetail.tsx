import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, Users, Calendar, ChevronLeft, Heart, Share2 } from 'lucide-react';
import { apiService, Field, TimeSlot } from '../services/api';

const FieldDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [field, setField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchField = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await apiService.getFieldById(id);
        
        if (response.success && response.data) {
          setField(response.data);
        } else {
          setError('Terrain non trouvé');
        }
      } catch (error) {
        console.error('Error fetching field:', error);
        setError('Erreur lors du chargement du terrain');
      } finally {
        setLoading(false);
      }
    };

    fetchField();
  }, [id]);

  // Filter time slots for selected date
  const availableTimeSlots = field?.availableSlots.filter(slot => 
    slot.date === selectedDate && slot.available
  ) || [];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">{error || 'Terrain non trouvé'}</p>
          <Link
            to="/fields"
            className="inline-flex items-center text-green-600 hover:text-green-700"
          >
            <ChevronLeft size={20} className="mr-1" />
            Retour aux terrains
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/fields" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
        <ChevronLeft size={20} className="mr-1" />
        Retour aux terrains
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="h-96 relative">
              <img 
                src={field.image} 
                alt={field.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Cdefs%3E%3ClinearGradient id="grass" x1="0%25" y1="0%25" x2="0%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%234ade80;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2316a34a;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="400" fill="url(%23grass)"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold"%3ETerrain%3C/text%3E%3C/svg%3E';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition shadow-lg">
                  <Heart size={20} className="text-gray-700" />
                </button>
                <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition shadow-lg">
                  <Share2 size={20} className="text-gray-700" />
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {field.price}e/heure
                </div>
              </div>
            </div>
          </div>

          {/* Field Info */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{field.name}</h1>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1" />
                  <span>{field.address}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="ml-1 font-medium">{field.rating || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">{field.price}e</div>
                <div className="text-gray-600">par heure</div>
              </div>
            </div>

            <p className="text-gray-700 mb-6">{field.description}</p>

            <div>
              <h3 className="text-xl font-semibold mb-3">Équipements</h3>
              <div className="grid grid-cols-2 gap-2">
                {field.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Réserver ce terrain</h2>
            
            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Time Slots */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Créneaux disponibles
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableTimeSlots.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Aucun créneau disponible pour cette date
                  </p>
                ) : (
                  availableTimeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full p-3 rounded-lg border text-left transition ${
                        selectedSlot?.id === slot.id
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white border-gray-300 hover:border-green-500 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        {slot.price && (
                          <span className="text-sm">{slot.price}e</span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between mb-2">
                <span>Prix par heure</span>
                <span>{field.price}e</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-green-600">{selectedSlot?.price || field.price}e</span>
              </div>
            </div>

            {/* Book Button */}
            <button
              onClick={() => {
                if (selectedSlot) {
                  navigate(`/reservation/${field.id}`, {
                    state: { date: selectedDate, timeSlot: selectedSlot }
                  });
                }
              }}
              disabled={!selectedSlot}
              className={`block w-full text-center py-3 rounded-lg font-medium transition ${
                selectedSlot
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedSlot ? 'Réserver maintenant' : 'Sélectionnez un créneau'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetail;
