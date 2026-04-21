import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Clock, Users, Calendar, ChevronLeft, Heart, Share2 } from 'lucide-react';

const FieldDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const field = {
    id: id || '1',
    name: 'Stade Municipal Jean Bouin',
    address: '123 Avenue des Sports, Paris 15ème',
    price: 35,
    rating: 4.8,
    description: 'Terrain de football de haute qualité avec éclairage professionnel, vestiaires modernes et parking sécurisé. Idéal pour les matchs de compétition et les entraînements.',
    features: ['Éclairage LED', 'Vestiaires avec douches', 'Parking gratuit', 'Tribunes (100 places)', 'Surface synthétique FIFA'],
    images: ['/field1.jpg', '/field2.jpg', '/field3.jpg'],
    capacity: '22 joueurs',
    dimensions: '105m x 68m'
  };

  const timeSlots = [
    { id: '1', startTime: '08:00', endTime: '09:30', available: true },
    { id: '2', startTime: '09:30', endTime: '11:00', available: true },
    { id: '3', startTime: '11:00', endTime: '12:30', available: false },
    { id: '4', startTime: '14:00', endTime: '15:30', available: true },
    { id: '5', startTime: '15:30', endTime: '17:00', available: true },
    { id: '6', startTime: '17:00', endTime: '18:30', available: false },
    { id: '7', startTime: '18:30', endTime: '20:00', available: true },
    { id: '8', startTime: '20:00', endTime: '21:30', available: true },
  ];

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
            <div className="h-96 bg-gradient-to-r from-green-400 to-green-600 relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="bg-white p-2 rounded-full hover:bg-gray-100 transition">
                  <Heart size={20} />
                </button>
                <button className="bg-white p-2 rounded-full hover:bg-gray-100 transition">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            <div className="flex gap-2 p-4">
              {[1, 2, 3].map((img) => (
                <div key={img} className="w-24 h-24 bg-gray-200 rounded cursor-pointer hover:opacity-80 transition"></div>
              ))}
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
                    <span className="ml-1 font-medium">{field.rating}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users size={16} className="mr-1" />
                    <span>{field.capacity}</span>
                  </div>
                  <div className="text-gray-600">
                    {field.dimensions}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Time Slots */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Créneaux disponibles
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && setSelectedSlot(slot.id)}
                    disabled={!slot.available}
                    className={`w-full p-3 rounded-lg border text-left transition ${
                      !slot.available
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : selectedSlot === slot.id
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white border-gray-300 hover:border-green-500 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {slot.startTime} - {slot.endTime}
                      </span>
                      {!slot.available && (
                        <span className="text-xs">Indisponible</span>
                      )}
                    </div>
                  </button>
                ))}
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
                <span className="text-green-600">{field.price}e</span>
              </div>
            </div>

            {/* Book Button */}
            <Link
              to={`/reservation/${field.id}`}
              state={{ date: selectedDate, slotId: selectedSlot }}
              className={`block w-full text-center py-3 rounded-lg font-medium transition ${
                selectedSlot
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={(e) => !selectedSlot && e.preventDefault()}
            >
              {selectedSlot ? 'Réserver maintenant' : 'Sélectionnez un créneau'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetail;
