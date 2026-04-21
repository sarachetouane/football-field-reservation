import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, User, Menu, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const handleCloseAuth = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
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
              {isAuthenticated && (
                <>
                  <Link to="/profile" className="hover:text-green-200 transition">Profil</Link>
                </>
              )}
            </nav>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm hidden md:block">
                    Bonjour, {user?.name}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="p-2 hover:bg-green-700 rounded-full transition"
                    title="Déconnexion"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="hidden md:flex items-center space-x-1 px-3 py-1 hover:bg-green-700 rounded transition"
                  >
                    <LogIn size={16} />
                    <span>Connexion</span>
                  </button>
                  <button 
                    onClick={() => setShowRegister(true)}
                    className="hidden md:block px-3 py-1 bg-white text-green-600 rounded hover:bg-green-50 transition"
                  >
                    Inscription
                  </button>
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="md:hidden p-2 hover:bg-green-700 rounded-full transition"
                  >
                    <User size={20} />
                  </button>
                </div>
              )}
              <button 
                className="md:hidden p-2 hover:bg-green-700 rounded-full transition"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-green-500">
              <nav className="flex flex-col space-y-3">
                <Link to="/" className="hover:text-green-200 transition" onClick={() => setIsMobileMenuOpen(false)}>Accueil</Link>
                <Link to="/fields" className="hover:text-green-200 transition" onClick={() => setIsMobileMenuOpen(false)}>Terrains</Link>
                {isAuthenticated && (
                  <>
                    <Link to="/profile" className="hover:text-green-200 transition" onClick={() => setIsMobileMenuOpen(false)}>Profil</Link>
                    <button 
                      onClick={handleLogout}
                      className="text-left hover:text-green-200 transition"
                    >
                      Déconnexion
                    </button>
                  </>
                )}
                {!isAuthenticated && (
                  <>
                    <button 
                      onClick={() => { setShowLogin(true); setIsMobileMenuOpen(false); }}
                      className="text-left hover:text-green-200 transition"
                    >
                      Connexion
                    </button>
                    <button 
                      onClick={() => { setShowRegister(true); setIsMobileMenuOpen(false); }}
                      className="text-left hover:text-green-200 transition"
                    >
                      Inscription
                    </button>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {showLogin && (
        <Login 
          onClose={handleCloseAuth} 
          onSwitchToRegister={handleSwitchToRegister} 
        />
      )}

      {showRegister && (
        <Register 
          onClose={handleCloseAuth} 
          onSwitchToLogin={handleSwitchToLogin} 
        />
      )}
    </>
  );
};

export default Header;
