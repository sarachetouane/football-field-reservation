import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Fields from './pages/Fields';
import FieldDetail from './pages/FieldDetail';
import Reservation from './pages/Reservation';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import FieldForm from './pages/FieldForm';
import EditReservation from './pages/EditReservation';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fields" element={<Fields />} />
              <Route path="/field/:id" element={<FieldDetail />} />
              <Route 
                path="/reservation/:fieldId" 
                element={
                  <ProtectedRoute message="Vous devez être connecté pour faire une réservation">
                    <Reservation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute message="Vous devez être connecté pour accéder à votre profil">
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute message="Vous devez être administrateur pour accéder à cette page" requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/fields/create" 
                element={
                  <ProtectedRoute message="Vous devez être administrateur pour accéder à cette page" requiredRole="admin">
                    <FieldForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/fields/edit/:id" 
                element={
                  <ProtectedRoute message="Vous devez être administrateur pour accéder à cette page" requiredRole="admin">
                    <FieldForm />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reservation/edit/:id" 
                element={
                  <ProtectedRoute message="Vous devez être connecté pour modifier une réservation">
                    <EditReservation />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
