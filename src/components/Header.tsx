import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Menu, LogOut, LogIn } from 'lucide-react';
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
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 md:py-4">
          {/* Desktop: logo | nav centrée | compte */}
          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
            <Link to="/" className="flex items-center space-x-2 justify-self-start min-w-0">
              <div className="w-8 h-8 shrink-0 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-600 rounded-full" />
              </div>
              <span className="text-xl font-bold truncate">FootballReserve</span>
            </Link>

            <nav className="flex items-center justify-center gap-8 text-[15px] font-medium">
              <Link to="/" className="hover:text-green-100 transition whitespace-nowrap">
                Accueil
              </Link>
              <Link to="/fields" className="hover:text-green-100 transition whitespace-nowrap">
                Terrains
              </Link>
              {isAuthenticated && (
                <Link to="/profile" className="hover:text-green-100 transition whitespace-nowrap">
                  Profil
                </Link>
              )}
            </nav>

            <div className="flex items-center justify-end gap-3 min-w-0">
              {isAuthenticated ? (
                <>
                  <span className="text-sm truncate max-w-[14rem] text-right">
                    Bonjour, {user?.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="shrink-0 p-2 hover:bg-green-700 rounded-full transition"
                    title="Déconnexion"
                  >
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLogin(true)}
                    className="flex items-center gap-1 px-3 py-1.5 hover:bg-green-700 rounded-md transition"
                  >
                    <LogIn size={16} />
                    <span>Connexion</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegister(true)}
                    className="px-3 py-1.5 bg-white text-green-600 rounded-md hover:bg-green-50 transition font-medium"
                  >
                    Inscription
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center justify-between gap-2">
            <Link to="/" className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 shrink-0 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-600 rounded-full" />
              </div>
              <span className="text-lg font-bold truncate">FootballReserve</span>
            </Link>
            <div className="flex items-center gap-1 shrink-0">
              {!isAuthenticated && (
                <button
                  type="button"
                  onClick={() => setShowLogin(true)}
                  className="p-2 hover:bg-green-700 rounded-full transition"
                  aria-label="Connexion"
                >
                  <User size={20} />
                </button>
              )}
              <button
                type="button"
                className="p-2 hover:bg-green-700 rounded-full transition"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
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
