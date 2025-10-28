import React, { useState } from 'react';
import { MapPin, Search, Filter, Layers, Navigation, Compass, Mountain, TrendingUp, Star, Heart, Bookmark, Share2, Download, Upload } from 'lucide-react';
import SimpleMapView from './SimpleMapView';

const MapPage = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample route data for demonstration
  const sampleRoute = {
    id: 1,
    name: 'Sierra de Guadarrama - Peñalara',
    location: 'Madrid, España',
    difficulty: 'Medium',
    distance: '12.5km',
    duration: '4-5 horas',
    elevation: '850m',
    type: 'Senderismo',
    rating: 4.7,
    reviews: 234,
    likes: 189,
    season: 'Primavera y Otoño',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
    waypoints: [
      { name: 'Puerto de Cotos', lat: 40.416775, lng: -3.703790 },
      { name: 'Laguna Grande', lat: 40.420000, lng: -3.700000 },
      { name: 'Pico Peñalara', lat: 40.425000, lng: -3.695000 }
    ]
  };

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'hard': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-600 to-green-500 p-3 rounded-xl shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Mapa de Rutas</h1>
                <p className="text-sm text-gray-600">Explora rutas en España y el mundo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setSelectedRoute(sampleRoute)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors shadow-md"
              >
                <MapPin className="w-4 h-4" />
                <span>Cargar Ruta de Ejemplo</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors shadow-md">
                <Upload className="w-4 h-4" />
                <span>Subir Ruta</span>
              </button>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition-colors shadow-md">
                <Download className="w-4 h-4" />
                <span>Descargar GPX</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar rutas por nombre, ubicación..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las dificultades</option>
              <option value="easy">Fácil</option>
              <option value="medium">Media</option>
              <option value="hard">Difícil</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="senderismo">Senderismo</option>
              <option value="ciclismo">Ciclismo</option>
              <option value="trail">Trail Running</option>
              <option value="montañismo">Montañismo</option>
            </select>

            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Map Container */}
        <div className="flex-1">
          <SimpleMapView selectedRoute={selectedRoute} onRouteSelect={handleRouteClick} />
        </div>

        {/* Sidebar with Route Details */}
        {selectedRoute && (
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto shadow-xl">
            <div className="p-6">
              {/* Route Image */}
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <img
                  src={selectedRoute.image}
                  alt={selectedRoute.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button className="bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-colors shadow-lg">
                    <Heart className="w-5 h-5 text-red-500" />
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-colors shadow-lg">
                    <Bookmark className="w-5 h-5 text-blue-500" />
                  </button>
                  <button className="bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-colors shadow-lg">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Route Info */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedRoute.name}</h2>
              <p className="text-gray-600 mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {selectedRoute.location}
              </p>

              {/* Difficulty Badge */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(selectedRoute.difficulty)}`}>
                  {selectedRoute.difficulty}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Distancia</p>
                  <p className="text-xl font-bold text-gray-800">{selectedRoute.distance}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Duración</p>
                  <p className="text-xl font-bold text-gray-800">{selectedRoute.duration}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Desnivel</p>
                  <p className="text-xl font-bold text-gray-800">{selectedRoute.elevation}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Tipo</p>
                  <p className="text-xl font-bold text-gray-800">{selectedRoute.type}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6 border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-bold text-gray-800">{selectedRoute.rating}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{selectedRoute.reviews.toLocaleString()} reseñas</p>
                    <p className="text-sm text-gray-600">{selectedRoute.likes.toLocaleString()} me gusta</p>
                  </div>
                </div>
              </div>

              {/* Season */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Mejor época</h3>
                <p className="text-gray-600">{selectedRoute.season}</p>
              </div>

              {/* Waypoints */}
              {selectedRoute.waypoints && selectedRoute.waypoints.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Puntos de interés</h3>
                  <div className="space-y-2">
                    {selectedRoute.waypoints.map((waypoint, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{waypoint.name}</p>
                          <p className="text-xs text-gray-500">
                            {waypoint.lat.toFixed(4)}, {waypoint.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors shadow-md">
                  <Navigation className="w-5 h-5" />
                  <span>Iniciar Navegación</span>
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors shadow-md">
                  <Download className="w-5 h-5" />
                  <span>Descargar GPX</span>
                </button>
                <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Compartir Ruta</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Stats Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2">
              <Mountain className="w-4 h-4 text-green-600" />
              <span>8 rutas visibles</span>
            </span>
            <span className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>820 km totales</span>
            </span>
            <span className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.8 valoración media</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-gray-400" />
            <span>Datos de OpenStreetMap</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;

