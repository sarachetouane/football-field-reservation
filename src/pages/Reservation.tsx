import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, Users, CreditCard, ChevronLeft, Check } from 'lucide-react';
import { apiService, Field, TimeSlot } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface LocationState {
  date: string;
  timeSlot: TimeSlot;
}

const Reservation: React.FC = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [field, setField] = useState<Field | null>(null);
  const [reservationData, setReservationData] = useState<LocationState | null>(null);
  const [formData, setFormData] = useState({
    teamName: '',
    playerCount: '11',
    paymentMethod: 'card',
    termsAccepted: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: `/reservation/${fieldId}` } });
      return;
    }

    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Get reservation data from location state
        const state = location.state as LocationState;
        if (!state || !state.date || !state.timeSlot) {
          setError('Informations de réservation manquantes');
          return;
        }
        setReservationData(state);

        // Fetch field details
        if (fieldId) {
          const response = await apiService.getFieldById(fieldId);
          if (response.success && response.data) {
            setField(response.data);
          } else {
            setError('Terrain non trouvé');
          }
        }
      } catch (error) {
        console.error('Error initializing reservation:', error);
        setError('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [fieldId, location.state, isAuthenticated, navigate]);

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: Users },
    { id: 2, title: 'Détails de la réservation', icon: Calendar },
    { id: 3, title: 'Paiement', icon: CreditCard },
    { id: 4, title: 'Confirmation', icon: Check }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle final submission
      try {
        if (!field || !reservationData || !user) {
          setError('Données manquantes pour la réservation');
          return;
        }

        const reservationPayload = {
          fieldId: field.id,
          date: reservationData.date,
          timeSlot: reservationData.timeSlot,
          totalPrice: reservationData.timeSlot.price || field.price
        };

        const response = await apiService.createReservation(reservationPayload);
        
        if (response.success) {
          setCurrentStep(4);
        } else {
          setError(response.message || 'Erreur lors de la réservation');
        }
      } catch (error) {
        console.error('Reservation error:', error);
        setError('Erreur lors de la réservation');
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Vos informations</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nom:</span>
                  <span>{user?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span>{user?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Téléphone:</span>
                  <span>{user?.phone}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'équipe (optionnel)
              </label>
              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de joueurs
              </label>
              <select
                name="playerCount"
                value={formData.playerCount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              >
                <option value="5">5 joueurs</option>
                <option value="7">7 joueurs</option>
                <option value="11">11 joueurs</option>
                <option value="22">22 joueurs</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Récapitulatif de la réservation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Terrain:</span>
                  <span>{field?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{reservationData?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Créneau:</span>
                  <span>{reservationData?.timeSlot.startTime} - {reservationData?.timeSlot.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée:</span>
                  <span>1h30</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-green-600">{reservationData?.timeSlot.price || field?.price}e</span>
                </div>
              </div>
            </div>
            {formData.teamName && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Détails de l'équipe</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom de l'équipe:</span>
                    <span>{formData.teamName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre de joueurs:</span>
                    <span>{formData.playerCount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Méthode de paiement
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <CreditCard size={20} className="mr-2" />
                  <span>Carte bancaire</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-green-500">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <span>PayPal</span>
                </label>
              </div>
            </div>
            
            {formData.paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                className="mt-1 mr-2"
              />
              <label className="text-sm text-gray-600">
                J'accepte les conditions générales de vente et la politique de confidentialité
              </label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Réservation confirmée!</h2>
            <p className="text-gray-600 mb-6">
              Votre réservation a été confirmée. Vous allez recevoir un email de confirmation avec tous les détails.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto mb-6">
              <h3 className="font-semibold mb-3">Détails de la réservation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Terrain:</span>
                  <span>{field?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{reservationData?.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Créneau:</span>
                  <span>{reservationData?.timeSlot.startTime} - {reservationData?.timeSlot.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="text-green-600">{reservationData?.timeSlot.price || field?.price}e</span>
                </div>
              </div>
            </div>
            <Link
              to="/profile"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Voir mes réservations
            </Link>
          </div>
        );

      default:
        return null;
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

  if (error || !field || !reservationData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">{error || 'Données manquantes'}</p>
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link to={`/field/${fieldId}`} className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <ChevronLeft size={20} className="mr-1" />
          Retour au terrain
        </Link>

        <h1 className="text-3xl font-bold mb-8">Finaliser votre réservation</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.id ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.id ? (
                  <Check size={20} />
                ) : (
                  <step.icon size={20} />
                )}
              </div>
              <span className={`ml-2 text-sm ${
                currentStep >= step.id ? 'text-green-600 font-medium' : 'text-gray-600'
              } hidden sm:block`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-full h-1 mx-4 ${
                  currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}
            
            {currentStep < 4 && (
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Précédent
                  </button>
                )}
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg font-medium transition ml-auto ${
                    currentStep === 3 && !formData.termsAccepted
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  disabled={currentStep === 3 && !formData.termsAccepted}
                >
                  {currentStep === 3 ? 'Confirmer et payer' : 'Suivant'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
