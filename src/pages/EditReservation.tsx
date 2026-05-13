import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Save, X, ArrowLeft } from 'lucide-react';
import { apiService, Reservation, Field, TimeSlot } from '../services/api';

const EditReservation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [field, setField] = useState<Field | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchReservationData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch reservation details
        const reservationResponse = await apiService.getReservationById(id);
        
        if (reservationResponse.success && reservationResponse.data) {
          const reservationData = reservationResponse.data;
          setReservation(reservationData);
          setSelectedDate(reservationData.date);
          setSelectedSlot(reservationData.timeSlot);
          
          // Fetch field details to get available slots
          const fieldId = typeof reservationData.fieldId === 'string' 
            ? reservationData.fieldId 
            : reservationData.fieldId._id;
          const fieldResponse = await apiService.getFieldById(fieldId);
          
          if (fieldResponse.success && fieldResponse.data) {
            const fieldData = fieldResponse.data;
            setField(fieldData);
            
            // Filter available slots for the selected date
            const slotsForDate = fieldData.availableSlots.filter(
              slot => slot.date === reservationData.date && slot.available
            );
            setAvailableSlots(slotsForDate);
          }
        } else {
          setError('Réservation non trouvée');
        }
      } catch (error) {
        console.error('Error fetching reservation:', error);
        setError('Erreur lors du chargement de la réservation');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationData();
  }, [id]);

  const handleDateChange = async (newDate: string) => {
    setSelectedDate(newDate);
    setSelectedSlot(null);
    
    if (!field) return;
    
    try {
      // Filter available slots for the new date
      const slotsForDate = field.availableSlots.filter(
        slot => slot.date === newDate && slot.available
      );
      setAvailableSlots(slotsForDate);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleSave = async () => {
    if (!reservation || !selectedSlot || !field) {
      setError('Veuillez sélectionner une date et un créneau horaire');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // For now, we'll implement a simple update by cancelling the old reservation
      // and creating a new one. In a real app, you'd have a proper update endpoint.
      
      // Cancel the old reservation
      await apiService.cancelReservation(reservation.id);
      
      // Create a new reservation with the updated details
      const newReservationData = {
        fieldId: field.id,
        date: selectedDate,
        timeSlot: selectedSlot,
        totalPrice: selectedSlot.price || field.price
      };
      
      const createResponse = await apiService.createReservation(newReservationData);
      
      if (createResponse.success) {
        navigate('/profile');
      } else {
        setError(createResponse.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      setError('Erreur lors de la mise à jour de la réservation');
    } finally {
      setSaving(false);
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

  if (error || !reservation || !field) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">{error || 'Réservation non trouvée'}</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Retour au profil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/profile')}
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={20} className="mr-1" />
          Retour aux réservations
        </button>
        <h1 className="text-3xl font-bold">Modifier la réservation</h1>
      </div>

      {/* Field Info */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{field.name}</h2>
        <div className="space-y-2 text-gray-600">
          <div className="flex items-center">
            <MapPin size={16} className="mr-2" />
            <span>{field.address}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Prix: {field.price}€/heure</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-2" />
              Date de réservation
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-2" />
              Créneau horaire
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  className={`p-3 rounded-lg border transition ${
                    selectedSlot?.id === slot.id
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-sm font-medium">
                    {slot.startTime} - {slot.endTime}
                  </div>
                  <div className="text-xs text-gray-500">
                    {slot.price || field.price}€
                  </div>
                </button>
              ))}
            </div>
            {availableSlots.length === 0 && (
              <p className="text-gray-500 text-sm mt-2">
                Aucun créneau disponible pour cette date
              </p>
            )}
          </div>

          {/* Summary */}
          {selectedSlot && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Résumé de la modification</h3>
              <div className="space-y-1 text-sm">
                <div>Date: {selectedDate}</div>
                <div>Heure: {selectedSlot.startTime} - {selectedSlot.endTime}</div>
                <div>Prix: {selectedSlot.price || field.price}€</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedSlot || saving}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center"
            >
              <Save size={20} className="mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditReservation;
