import React, { useState } from 'react';
import InteractiveMapView from './InteractiveMapView';
import RouteDetailPage from './RouteDetailPage';
import { MapPin, Navigation, TrendingUp, Camera, Users, Star } from 'lucide-react';

const GeospatialApp = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [view, setView] = useState('map'); // 'map' or 'detail'

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    setView('detail');
  };

  const handleBackToMap = () => {
    setView('map');
    setSelectedRoute(null);
  };

  const stats = [
    { label: 'Rutas Disponibles', value: '1,247', icon: MapPin, color: 'text-blue-600' },
    { label: 'Kilómetros Totales', value: '8,456', icon: Navigation, color: 'text-green-600' },
    { label: 'Usuarios Activos', value: '2,341', icon: Users, color: 'text-purple-600' },
    { label: 'Valoración Media', value: '4.7', icon: Star, color: 'text-yellow-600' }
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-600 to-green-500 p-3 rounded-xl shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Explorador de Rutas</h1>
                <p className="text-sm text-gray-600">Descubre rutas de senderismo con datos geoespaciales</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Datos en tiempo real</div>
                <div className="text-xs text-green-600 font-medium">● OpenStreetMap • Elevación • Fotos</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <div>
                    <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {view === 'map' ? (
          <InteractiveMapView 
            onRouteSelect={handleRouteSelect}
            selectedRoute={selectedRoute}
          />
        ) : (
          <RouteDetailPage 
            route={selectedRoute}
            onBack={handleBackToMap}
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span>Datos de OpenStreetMap</span>
            </span>
            <span className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Perfiles de elevación</span>
            </span>
            <span className="flex items-center space-x-2">
              <Camera className="w-4 h-4 text-purple-600" />
              <span>Fotos geolocalizadas</span>
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Powered by React Leaflet • OpenStreetMap • Open-Elevation API
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeospatialApp;
