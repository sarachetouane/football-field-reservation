import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Calendar, MapPin, Star, Clock } from 'lucide-react';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/fields?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  const fields = [
    {
      id: '1',
      name: 'Terrain Les Verts',
      address: 'TEMARA',
      price: 10,
      rating: 4.8,
      image: '/images/image1.jpg',
    },
    {
      id: '2',
      name: 'Complex Sportif Le Parc',
      address: 'RABAT',
      price: 12,
      rating: 4.6,
      image: '/images/image2.png',
    },
    {
      id: '3',
      name: 'Terrain Académie Salhy',
      address: 'AIN ATIQ',
      price: 15,
      rating: 4.9,
      image: '/images/image3.jpg',
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Réservez Votre Terrain de Football
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100">
            Trouvez et réservez facilement les meilleurs terrains de football près de chez vous
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-2 flex items-center">
              <div className="flex-1 flex items-center px-4">
                <MapPin className="text-gray-400 mr-2" size={20} />
                <input
                  type="text"
                  placeholder="Entrez votre localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full py-3 text-gray-700 outline-none"
                />
              </div>
              <button 
                onClick={handleSearch}
                className="bg-green-600 text-white px-6 py-3 rounded-r-lg hover:bg-green-700 transition flex items-center"
              >
                <Search size={20} className="mr-2" />
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi nous choisir?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Réservation en ligne</h3>
              <p className="text-gray-600">Réservez votre terrain 24/7 en quelques clics</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Terrains de qualité</h3>
              <p className="text-gray-600">Accès aux meilleurs terrains entretenus régulièrement</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Créneaux flexibles</h3>
              <p className="text-gray-600">Choisissez parmi de nombreux créneaux horaires disponibles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Fields */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Terrains populaires</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {fields.map((field) => (
              <div key={field.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={field.image} 
                    alt={field.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Cdefs%3E%3ClinearGradient id="grass" x1="0%25" y1="0%25" x2="0%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%234ade80;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2316a34a;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="200" fill="url(%23grass)"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="18"%3ETerrain%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {field.price}e/heure
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{field.name}</h3>
                    <div className="flex items-center">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="ml-1 text-sm">{field.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{field.address}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">{field.price}<span className="text-sm">/heure</span></span>
                    <Link
                      to={`/field/${field.id}`}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Voir détails
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/fields"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Voir tous les terrains
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
