import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Star, Clock, Mountain } from 'lucide-react';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const SimpleMapView = ({ onRouteSelect }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSampleRoutes();
  }, []);

  const loadSampleRoutes = () => {
    // Sample routes data
    const sampleRoutes = [
      {
        id: 1,
        name: 'Sierra de Guadarrama - Peñalara',
        description: 'Ruta clásica de montaña en la Sierra de Guadarrama',
        difficulty: 'Medium',
        distance: '12.5km',
        duration: '4-5 horas',
        elevation_gain: 850,
        rating: 4.7,
        reviews: 234,
        coordinates: [
          [-3.703790, 40.416775],
          [-3.700000, 40.420000],
          [-3.695000, 40.425000],
          [-3.690000, 40.430000],
          [-3.685000, 40.435000]
        ]
      },
      {
        id: 2,
        name: 'Ruta del Bosque Encantado',
        description: 'Sendero circular por un bosque de robles centenarios',
        difficulty: 'Easy',
        distance: '5.2km',
        duration: '2 horas',
        elevation_gain: 120,
        rating: 4.2,
        reviews: 34,
        coordinates: [
          [-3.800000, 40.300000],
          [-3.795000, 40.305000],
          [-3.790000, 40.310000],
          [-3.785000, 40.315000],
          [-3.780000, 40.320000]
        ]
      },
      {
        id: 3,
        name: 'Ascenso al Pico del Águila',
        description: 'Ruta exigente hasta la cumbre más alta de la zona',
        difficulty: 'Hard',
        distance: '12.8km',
        duration: '6 horas',
        elevation_gain: 1200,
        rating: 4.8,
        reviews: 89,
        coordinates: [
          [-3.600000, 40.500000],
          [-3.590000, 40.510000],
          [-3.580000, 40.520000],
          [-3.570000, 40.530000],
          [-3.560000, 40.540000]
        ]
      }
    ];

    setRoutes(sampleRoutes);
    setLoading(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[40.416775, -3.703790]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routes.map((route) => (
          <Marker
            key={route.id}
            position={[route.coordinates[0][1], route.coordinates[0][0]]}
            eventHandlers={{
              click: () => onRouteSelect && onRouteSelect(route)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm mb-2">{route.name}</h3>
                <p className="text-xs text-gray-600 mb-3">{route.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-blue-600" />
                      {route.distance}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-green-600" />
                      {route.duration}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center">
                      <Mountain className="w-3 h-3 mr-1 text-purple-600" />
                      {route.elevation_gain}m
                    </span>
                    <span className="flex items-center">
                      <Star className="w-3 h-3 mr-1 text-yellow-600" />
                      {route.rating}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: getDifficultyColor(route.difficulty) + '20',
                        color: getDifficultyColor(route.difficulty)
                      }}
                    >
                      {route.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">{route.reviews} reviews</span>
                  </div>
                </div>
                
                <button
                  onClick={() => onRouteSelect && onRouteSelect(route)}
                  className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-xs font-medium transition-colors"
                >
                  Ver Detalles
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Route info overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-sm">
        <h3 className="font-semibold text-gray-800 mb-2">Rutas Disponibles</h3>
        <p className="text-sm text-gray-600 mb-3">{routes.length} rutas en el mapa</p>
        
        <div className="space-y-2">
          {routes.map((route) => (
            <div
              key={route.id}
              className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onRouteSelect && onRouteSelect(route)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">{route.name}</span>
                <span 
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{ 
                    backgroundColor: getDifficultyColor(route.difficulty) + '20',
                    color: getDifficultyColor(route.difficulty)
                  }}
                >
                  {route.difficulty}
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {route.distance} • {route.duration} • {route.rating}⭐
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleMapView;



