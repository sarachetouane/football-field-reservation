import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Clock } from 'lucide-react';
import { apiService, Field } from '../services/api';

const Fields: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        const response = await apiService.getFields({
          search: searchTerm || undefined,
          page: pagination.page,
          limit: pagination.limit
        });
        
        if (response.success && response.data) {
          setFields(response.data);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        }
      } catch (error) {
        console.error('Error fetching fields:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [searchTerm, pagination.page, pagination.limit]);

  const filteredFields = fields.filter(field => 
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nos Terrains</h1>
      
      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un terrain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            >
              <option value="all">Tous les terrains</option>
              <option value="synthetic">Synthétique</option>
              <option value="natural">Gazon naturel</option>
              <option value="indoor">Intérieur</option>
            </select>
            <button className="px-4 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition flex items-center">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {loading ? 'Chargement...' : `${filteredFields.length} terrains disponibles`}
        </p>
      </div>

      {/* Fields Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFields.map((field) => (
              <div key={field.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={field.image} 
                    alt={field.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect width="400" height="200" fill="%234ade80"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="18"%3ETerrain%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {field.price}e/heure
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{field.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin size={16} className="mr-1" />
                    <span className="text-sm">{field.address}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <Star className="text-yellow-400 fill-current" size={16} />
                    <span className="ml-1 text-sm font-medium">{field.rating || 'N/A'}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {field.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Clock size={16} className="mr-1" />
                      <span className="text-sm">Disponible aujourd'hui</span>
                    </div>
                    <Link
                      to={`/field/${field.id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Réserver
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFields.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Aucun terrain trouvé pour votre recherche.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Fields;
