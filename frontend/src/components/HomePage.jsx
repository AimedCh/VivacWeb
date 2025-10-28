import React from 'react';
import { MapPin, Zap, Users, BookOpen, TrendingUp, Award } from 'lucide-react';

const HomePage = ({ user }) => {
  const stats = [
    { icon: MapPin, label: 'Rutas Exploradas', value: user?.total_routes || 0, color: 'text-green-600', bg: 'bg-green-100' },
    { icon: TrendingUp, label: 'Distancia Total', value: `${user?.total_distance || 0} km`, color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: Award, label: 'Nivel', value: user?.experience_level || 'Beginner', color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: Users, label: 'Comunidad', value: '1.2k', color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const recentActivities = [
    { id: 1, title: 'Nueva ruta generada', description: 'Sierra de Guadarrama - 12km', time: 'Hace 2 horas', icon: '🗺️' },
    { id: 2, title: 'Logro desbloqueado', description: 'Primera ruta completada', time: 'Hace 1 día', icon: '🏆' },
    { id: 3, title: 'Nuevo seguidor', description: 'María te está siguiendo', time: 'Hace 2 días', icon: '👥' },
  ];

  const quickActions = [
    { icon: Zap, label: 'Generar Ruta IA', color: 'from-green-600 to-green-500', action: 'explore' },
    { icon: MapPin, label: 'Explorar Mapas', color: 'from-blue-600 to-blue-500', action: 'maps' },
    { icon: BookOpen, label: 'Ver Guías', color: 'from-purple-600 to-purple-500', action: 'guides' },
    { icon: Users, label: 'Comunidad', color: 'from-orange-600 to-orange-500', action: 'community' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ¡Bienvenido, {user?.name || 'Explorador'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Listo para tu próxima aventura en la montaña
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in border border-gray-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${stat.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center space-y-3`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="w-8 h-8" />
                  <span className="font-bold">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Actividad Reciente
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="text-3xl">{activity.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Routes */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Rutas Destacadas
            </h2>
            <div className="space-y-4">
              <div className="relative h-48 rounded-xl overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                  alt="Mountain trail"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-lg mb-1">Sierra de Guadarrama</h3>
                  <p className="text-sm opacity-90">12 km • Dificultad Media • 4.5⭐</p>
                </div>
              </div>

              <div className="relative h-48 rounded-xl overflow-hidden group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop"
                  alt="Forest trail"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-lg mb-1">Picos de Europa</h3>
                  <p className="text-sm opacity-90">18 km • Dificultad Alta • 4.8⭐</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-start space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">💡 Consejo del Día</h2>
              <p className="text-lg opacity-90">
                Siempre verifica el pronóstico del tiempo antes de salir. Las condiciones pueden cambiar rápidamente en la montaña.
              </p>
              <button className="mt-4 bg-white text-green-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                Ver Más Consejos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

