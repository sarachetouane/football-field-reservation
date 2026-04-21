import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, User, Menu } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-green-600 rounded-full"></div>
            </div>
            <span className="text-xl font-bold">FootballReserve</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-green-200 transition">Accueil</Link>
            <Link to="/fields" className="hover:text-green-200 transition">Terrains</Link>
            <Link to="/reservations" className="hover:text-green-200 transition">Mes Réservations</Link>
            <Link to="/profile" className="hover:text-green-200 transition">Profil</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-green-700 rounded-full transition">
              <Calendar size={20} />
            </button>
            <button className="p-2 hover:bg-green-700 rounded-full transition">
              <User size={20} />
            </button>
            <button className="md:hidden p-2 hover:bg-green-700 rounded-full transition">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
