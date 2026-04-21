import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Trophy, ArrowRight, Shield, Clock } from 'lucide-react';
import Login from './Login';
import Register from './Register';

interface ProtectedRouteProps {
  children: React.ReactNode;
  message?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  message = "Vous devez être connecté pour accéder à cette page" 
}) => {
  const { isAuthenticated } = useAuth();
  const [showLogin, setShowLogin] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);

  if (isAuthenticated) {
    return <>{children}</>;
  }

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

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-3">Authentification requise</h1>
                <p className="text-green-100 text-lg max-w-md mx-auto">
                  {message}
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Sécurisé</h3>
                  <p className="text-sm text-gray-600">Vos données sont protégées</p>
                </div>
                
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Rapide</h3>
                  <p className="text-sm text-gray-600">Accès instantané à votre compte</p>
                </div>
                
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
                    <Trophy className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Simple</h3>
                  <p className="text-sm text-gray-600">Interface intuitive et moderne</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowLogin(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 group"
                >
                  <span>Se connecter</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => setShowRegister(true)}
                  className="w-full bg-white text-green-600 py-4 px-8 rounded-xl font-semibold border-2 border-green-600 hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-3 group"
                >
                  <span>Créer un compte gratuitement</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Connexion sécurisée</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Données protégées</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Service gratuit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-6 text-gray-600 text-sm">
            <p>Rejoignez des milliers de sportifs qui réservent leurs terrains en ligne</p>
          </div>
        </div>
      </div>

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

export default ProtectedRoute;
