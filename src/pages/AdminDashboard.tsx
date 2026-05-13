import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { apiService, Field } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  totalFields: number;
  totalUsers: number;
  totalReservations: number;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [fields, setFields] = useState<Field[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalFields: 0,
    totalUsers: 0,
    totalReservations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch fields and stats in parallel
        const [fieldsResponse, statsResponse] = await Promise.all([
          apiService.getFields({ limit: 10 }),
          apiService.getAdminStats()
        ]);

        if (fieldsResponse.success && fieldsResponse.data) {
          setFields(fieldsResponse.data);
        }

        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data.stats);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDeleteField = async (fieldId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce terrain ?')) {
      return;
    }

    try {
      const response = await apiService.deleteField(fieldId);

      if (response.success) {
        setFields(fields.filter(field => field.id !== fieldId));
        setStats(prev => ({ ...prev, totalFields: prev.totalFields - 1 }));
      } else {
        setError(response.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Error deleting field:', error);
      setError('Erreur lors de la suppression');
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord Admin</h1>
        <p className="text-gray-600">Bienvenue, {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Terrains totaux</p>
              <p className="text-2xl font-bold text-green-600">{stats.totalFields}</p>
            </div>
            <MapPin className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Utilisateurs</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <Users className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Réservations</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalReservations}</p>
            </div>
            <Calendar className="text-purple-600" size={24} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestion des terrains</h2>
        <Link
          to="/admin/fields/create"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Ajouter un terrain
        </Link>
      </div>

      {/* Fields Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adresse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields.map((field) => (
                <tr key={field.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{field.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{field.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{field.price}€/h</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{field.rating || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/fields/edit/${field.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDeleteField(field.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Aucun terrain trouvé</p>
          <Link
            to="/admin/fields/create"
            className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Ajouter votre premier terrain
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
