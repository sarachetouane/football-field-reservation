import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, X } from 'lucide-react';
import { apiService, Field } from '../services/api';

interface FieldFormData {
  name: string;
  address: string;
  price: number;
  description: string;
  image: string;
  features: string[];
  rating: number;
}

const FieldForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState<FieldFormData>({
    name: '',
    address: '',
    price: 0,
    description: '',
    image: '/images/default-field.jpg',
    features: [],
    rating: 4.5
  });
  
  const [newFeature, setNewFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(isEditing);

  useEffect(() => {
    const fetchField = async () => {
      if (!isEditing) return;
      
      try {
        setFetchLoading(true);
        const response = await apiService.getFieldById(id!);
        
        if (response.success && response.data) {
          const field = response.data;
          setFormData({
            name: field.name,
            address: field.address,
            price: field.price,
            description: field.description,
            image: field.image,
            features: field.features,
            rating: field.rating || 4.5
          });
        } else {
          setError('Terrain non trouvé');
        }
      } catch (error) {
        console.error('Error fetching field:', error);
        setError('Erreur lors du chargement du terrain');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchField();
  }, [id, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' ? parseFloat(value) || 0 : value
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || formData.price <= 0) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = isEditing 
        ? `http://localhost:5000/api/admin/fields/${id}`
        : 'http://localhost:5000/api/admin/fields';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiService.getToken()}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving field:', error);
      setError('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
        >
          <ChevronLeft size={20} className="mr-1" />
          Retour au tableau de bord
        </button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Modifier le terrain' : 'Ajouter un terrain'}
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Informations de base</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du terrain *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix par heure (€) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (0-5)
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="Décrivez le terrain, ses caractéristiques, son ambiance..."
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de l'image
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="/images/field-name.jpg"
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Équipements et caractéristiques
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Ex: Éclairage LED, Vestiaires, Parking..."
              />
              <button
                type="button"
                onClick={addFeature}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Ajouter
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(feature)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center"
            >
              <Save size={20} className="mr-2" />
              {loading ? 'Sauvegarde...' : (isEditing ? 'Mettre à jour' : 'Créer le terrain')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldForm;
