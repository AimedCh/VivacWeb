import React, { useState, useEffect } from 'react';
import { Map, Search, Filter, Star, MapPin, Clock, TrendingUp, Heart, Navigation, Layers } from 'lucide-react';
import { apiService } from '../services/api';

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [mapView, setMapView] = useState('terrain');

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      // Mock data - replace with real API call
      const mockRoutes = [
        {
          id: 1,
          name: 'Sierra de Guadarrama - Pico Peñalara',
          location: 'Madrid, España',
          distance: '12.5 km',
          difficulty: 'Medium',
          duration: '4-5 horas',
          elevation: '+850m',
          rating: 4.8,
          reviews: 234,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
          likes: 456,
          coordinates: { lat: 40.8467, lng: -3.9572 },
          waypoints: [
            { lat: 40.8467, lng: -3.9572, name: 'Inicio' },
            { lat: 40.8500, lng: -3.9500, name: 'Mirador' },
            { lat: 40.8550, lng: -3.9450, name: 'Cumbre' },
          ],
        },
        {
          id: 2,
          name: 'Picos de Europa - Ruta del Cares',
          location: 'Asturias, España',
          distance: '21 km',
          difficulty: 'Hard',
          duration: '6-7 horas',
          elevation: '+1200m',
          rating: 4.9,
          reviews: 567,
          image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
          likes: 789,
          coordinates: { lat: 43.2000, lng: -4.8000 },
          waypoints: [
            { lat: 43.2000, lng: -4.8000, name: 'Poncebos' },
            { lat: 43.2100, lng: -4.7900, name: 'Garganta' },
            { lat: 43.2200, lng: -4.7800, name: 'Caín' },
          ],
        },
        {
          id: 3,
          name: 'Montserrat - Sant Jeroni',
          location: 'Barcelona, España',
          distance: '8.3 km',
          difficulty: 'Easy',
          duration: '3 horas',
          elevation: '+450m',
          rating: 4.6,
          reviews: 189,
          image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600',
          likes: 345,
          coordinates: { lat: 41.5933, lng: 1.8367 },
          waypoints: [
            { lat: 41.5933, lng: 1.8367, name: 'Monasterio' },
            { lat: 41.5950, lng: 1.8400, name: 'Sant Jeroni' },
          ],
        },
        {
          id: 4,
          name: 'Ordesa y Monte Perdido',
          location: 'Huesca, España',
          distance: '16 km',
          difficulty: 'Medium',
          duration: '5-6 horas',
          elevation: '+700m',
          rating: 4.9,
          reviews: 423,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
          likes: 678,
          coordinates: { lat: 42.6667, lng: 0.0333 },
          waypoints: [
            { lat: 42.6667, lng: 0.0333, name: 'Pradera' },
            { lat: 42.6700, lng: 0.0400, name: 'Cola de Caballo' },
          ],
        },
        {
          id: 5,
          name: 'Teide - Cumbre',
          location: 'Tenerife, España',
          distance: '18 km',
          difficulty: 'Hard',
          duration: '7-8 horas',
          elevation: '+1400m',
          rating: 4.7,
          reviews: 312,
          image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600',
          likes: 567,
          coordinates: { lat: 28.2722, lng: -16.6431 },
          waypoints: [
            { lat: 28.2722, lng: -16.6431, name: 'Base' },
            { lat: 28.2750, lng: -16.6400, name: 'Cumbre' },
          ],
        },
        {
          id: 6,
          name: 'Camino de Santiago - Etapa Final',
          location: 'Galicia, España',
          distance: '19 km',
          difficulty: 'Easy',
          duration: '5 horas',
          elevation: '+300m',
          rating: 4.8,
          reviews: 891,
          image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600',
          likes: 1234,
          coordinates: { lat: 42.8805, lng: -8.5447 },
          waypoints: [
            { lat: 42.8805, lng: -8.5447, name: 'Santiago' },
            { lat: 42.8850, lng: -8.5400, name: 'Catedral' },
          ],
        },
      ];
      setRoutes(mockRoutes);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || route.difficulty.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderInteractiveMap = () => (
    <div className="mb-8 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Map Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Navigation className="w-6 h-6 mr-2" />
          Mapa Interactivo de Rutas
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMapView('terrain')}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
              mapView === 'terrain' ? 'bg-white text-green-600' : 'bg-green-700 text-white hover:bg-green-800'
            }`}
          >
            Terreno
          </button>
          <button
            onClick={() => setMapView('satellite')}
            className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
              mapView === 'satellite' ? 'bg-white text-green-600' : 'bg-green-700 text-white hover:bg-green-800'
            }`}
          >
            Satélite
          </button>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative h-96 bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
        {/* Map Background with Animation */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 400">
          {/* Terrain Background */}
          <defs>
            <linearGradient id="terrainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.2 }} />
              <stop offset="50%" style={{ stopColor: '#3b82f6', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.2 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Mountain Silhouettes */}
          <path d="M0,300 L100,250 L200,280 L300,200 L400,240 L500,180 L600,220 L700,160 L800,200 L900,150 L1000,190 L1000,400 L0,400 Z"
                fill="url(#terrainGradient)" opacity="0.3" />
          <path d="M0,320 L150,280 L300,300 L450,240 L600,270 L750,220 L900,250 L1000,210 L1000,400 L0,400 Z"
                fill="url(#terrainGradient)" opacity="0.2" />

          {/* Routes - Connecting all waypoints */}
          {routes.map((route, idx) => (
            <g key={route.id}>
              {/* Route Path */}
              <path
                d={route.waypoints.map((_, i) => {
                  const x = 100 + idx * 150 + i * 50;
                  const y = 200 - idx * 20 + Math.sin(i) * 30;
                  return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                }).join(' ')}
                stroke={idx % 3 === 0 ? '#10b981' : idx % 3 === 1 ? '#3b82f6' : '#f59e0b'}
                strokeWidth="3"
                fill="none"
                className="animate-dash"
                style={{ animationDelay: `${idx * 0.2}s` }}
                filter="url(#glow)"
              />

              {/* Waypoints */}
              {route.waypoints.map((_, i) => {
                const x = 100 + idx * 150 + i * 50;
                const y = 200 - idx * 20 + Math.sin(i) * 30;
                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill={idx % 3 === 0 ? '#10b981' : idx % 3 === 1 ? '#3b82f6' : '#f59e0b'}
                      className="animate-pulse"
                      style={{ animationDelay: `${idx * 0.2 + i * 0.1}s`, cursor: 'pointer' }}
                      filter="url(#glow)"
                      onClick={() => setSelectedRoute(route)}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill="none"
                      stroke={idx % 3 === 0 ? '#10b981' : idx % 3 === 1 ? '#3b82f6' : '#f59e0b'}
                      strokeWidth="2"
                      opacity="0.5"
                      className="animate-ping"
                      style={{ animationDelay: `${idx * 0.2 + i * 0.1}s` }}
                    />
                  </g>
                );
              })}
            </g>
          ))}

          {/* Route Labels */}
          {routes.map((route, idx) => {
            const x = 100 + idx * 150;
            const y = 180 - idx * 20;
            return (
              <text
                key={route.id}
                x={x}
                y={y}
                fill="#1f2937"
                fontSize="12"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {route.name.split(' - ')[0]}
              </text>
            );
          })}
        </svg>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <h3 className="font-bold text-gray-800 mb-2 text-sm">Leyenda</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-600"></div>
              <span className="text-xs text-gray-700">Ruta Fácil</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-600"></div>
              <span className="text-xs text-gray-700">Ruta Media</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-orange-600"></div>
              <span className="text-xs text-gray-700">Ruta Difícil</span>
            </div>
          </div>
        </div>

        {/* Route Counter */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{routes.length}</p>
            <p className="text-xs text-gray-600">Rutas Disponibles</p>
          </div>
        </div>
      </div>

      {/* Map Info */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          <MapPin className="w-4 h-4 inline mr-1" />
          Click en los puntos para ver detalles de cada ruta
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            <Map className="w-10 h-10 mr-3 text-green-600" />
            Mapas & Rutas
          </h1>
          <p className="text-gray-600 text-lg">Descubre las mejores rutas de vivac y montañismo</p>
        </div>

        {/* Interactive Map */}
        {renderInteractiveMap()}

        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar rutas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <div className="flex space-x-2 flex-1">
                {['all', 'easy', 'medium', 'hard'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedFilter === filter
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter === 'all' ? 'Todas' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Rutas</p>
                <p className="text-3xl font-bold text-gray-800">{routes.length}</p>
              </div>
              <Map className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Más Populares</p>
                <p className="text-3xl font-bold text-gray-800">{routes.filter(r => r.rating >= 4.8).length}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Favoritas</p>
                <p className="text-3xl font-bold text-gray-800">{routes.reduce((sum, r) => sum + r.likes, 0)}</p>
              </div>
              <Heart className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Reseñas</p>
                <p className="text-3xl font-bold text-gray-800">{routes.reduce((sum, r) => sum + r.reviews, 0)}</p>
              </div>
              <Star className="w-10 h-10 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Routes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 absolute top-0 left-0"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={route.image}
                    alt={route.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(route.difficulty)}`}>
                    {route.difficulty}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-1">{route.name}</h3>
                    <p className="text-white/90 text-sm flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {route.location}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Distancia</p>
                      <p className="font-bold text-gray-800">{route.distance}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Duración</p>
                      <p className="font-bold text-gray-800">{route.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Desnivel</p>
                      <p className="font-bold text-gray-800">{route.elevation}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Rating</p>
                      <p className="font-bold text-gray-800 flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        {route.rating}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {route.likes}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {route.reviews}
                      </span>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm">
                      Ver Ruta
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredRoutes.length === 0 && !loading && (
          <div className="text-center py-20">
            <Map className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No se encontraron rutas</h3>
            <p className="text-gray-600">Intenta con otros términos de búsqueda o filtros</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutesPage;

