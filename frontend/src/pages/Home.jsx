import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthRequest from '../api/AuthRequest';
import { LogOut, User } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay sesión activa
    if (!AuthRequest.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Obtener datos del usuario
    const userData = AuthRequest.getCurrentUser();
    setUser(userData);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await AuthRequest.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Redirigir de todas formas
      navigate('/login');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            Link in Bio
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-orange-400" />
              <span className="text-gray-300">{user?.name || user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-8">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <h2 className="text-3xl font-bold mb-4">¡Bienvenido!</h2>
          <p className="text-gray-400 mb-6">
            Has iniciado sesión exitosamente en tu aplicación Link in Bio.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2 text-orange-400">Perfil</h3>
              <p className="text-gray-300">Gestiona tu información personal</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2 text-orange-400">Links</h3>
              <p className="text-gray-300">Administra tus enlaces</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-2 text-orange-400">Estadísticas</h3>
              <p className="text-gray-300">Analiza tus visitas</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
