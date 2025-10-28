import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Star, Clock, Mountain, Filter, Search, Layers, Navigation } from 'lucide-react';
import { geospatialService } from '../services/geospatialService';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icons
const createCustomIcon = (color, type) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        color: white;
      ">
        ${type === 'start' ? 'S' : type === 'end' ? 'E' : '•'}
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Map controls component
const MapControls = ({ onFilterChange, onSearch, routes, onLocationSearch }) => {
  const [filters, setFilters] = useState({
    difficulty: 'all',
    distance: 'all',
    terrain: 'all'
  });
  const [locationQuery, setLocationQuery] = useState('');

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationSearch = () => {
    if (locationQuery.trim()) {
      onLocationSearch && onLocationSearch(locationQuery);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center space-x-2 mb-3">
        <Filter className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold text-gray-800">Filtros y Búsqueda</h3>
      </div>
      
      {/* Location Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar ubicación</label>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Ciudad, región..."
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch()}
          />
          <button
            onClick={handleLocationSearch}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Todas</option>
            <option value="Easy">Fácil</option>
            <option value="Medium">Media</option>
            <option value="Hard">Difícil</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Distancia</label>
          <select
            value={filters.distance}
            onChange={(e) => handleFilterChange('distance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Todas</option>
            <option value="short">&lt; 5km</option>
            <option value="medium">5-15km</option>
            <option value="long">&gt; 15km</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Terreno</label>
          <select
            value={filters.terrain}
            onChange={(e) => handleFilterChange('terrain', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Todos</option>
            <option value="Mountain">Montaña</option>
            <option value="Forest">Bosque</option>
            <option value="Coastal">Costa</option>
            <option value="Mixed">Mixto</option>
          </select>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{routes.length} rutas visibles</span>
          <button
            onClick={() => onSearch()}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
          >
            Buscar más
          </button>
        </div>
      </div>
    </div>
  );
};

// Route info panel
const RouteInfoPanel = ({ route, onClose, onViewDetails }) => {
  if (!route) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Información de Ruta</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-800">{route.name}</h4>
          <p className="text-sm text-gray-600">{route.description}</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(route.difficulty)}`}>
            {route.difficulty}
          </span>
          <span className="text-sm text-gray-600">{route.terrain}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span>{route.distance}km</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span>{route.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mountain className="w-4 h-4 text-purple-600" />
            <span>{route.elevation_gain}m</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-600" />
            <span>{route.rating}</span>
          </div>
        </div>

        <button
          onClick={() => onViewDetails(route)}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors"
        >
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

// Main map component
const InteractiveMapView = ({ onRouteSelect, selectedRoute }) => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRouteInfo, setSelectedRouteInfo] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.416775, -3.703790]);
  const [mapZoom, setMapZoom] = useState(10);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    loadRoutes();
  }, []);

  useEffect(() => {
    if (selectedRoute) {
      setSelectedRouteInfo(selectedRoute);
      setMapCenter([selectedRoute.coordinates[0][1], selectedRoute.coordinates[0][0]]);
      setMapZoom(13);
    }
  }, [selectedRoute]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadRoutes();
        setLastUpdate(new Date());
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const routesData = await geospatialService.getMockOSMRoutes();
      setRoutes(routesData);
      setFilteredRoutes(routesData);
    } catch (error) {
      console.error('Error loading routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = routes;

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(route => route.difficulty === filters.difficulty);
    }

    if (filters.distance !== 'all') {
      filtered = filtered.filter(route => {
        const distance = route.distance;
        switch (filters.distance) {
          case 'short': return distance < 5;
          case 'medium': return distance >= 5 && distance <= 15;
          case 'long': return distance > 15;
          default: return true;
        }
      });
    }

    if (filters.terrain !== 'all') {
      filtered = filtered.filter(route => route.terrain === filters.terrain);
    }

    setFilteredRoutes(filtered);
  };

  const handleRouteClick = (route) => {
    setSelectedRouteInfo(route);
    onRouteSelect && onRouteSelect(route);
  };

  const getRouteColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleSearchMore = async () => {
    // Expand search area
    const newBounds = {
      north: 40.6, south: 40.2, east: -3.5, west: -3.9
    };
    
    try {
      setLoading(true);
      const newRoutes = await geospatialService.getMockOSMRoutes();
      setRoutes(prev => [...prev, ...newRoutes]);
      setFilteredRoutes(prev => [...prev, ...newRoutes]);
    } catch (error) {
      console.error('Error loading more routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = async (query) => {
    try {
      setLoading(true);
      
      // Use the geospatial service for location-based search
      const searchResult = await geospatialService.searchRoutesByLocation(query, 15);
      
      if (searchResult.error) {
        console.warn('Location search failed:', searchResult.message);
        return;
      }
      
      if (searchResult.location) {
        setMapCenter([searchResult.location.lat, searchResult.location.lng]);
        setMapZoom(12);
        setRoutes(searchResult.routes);
        setFilteredRoutes(searchResult.routes);
        setLastUpdate(new Date());
        
        // Show search results notification
        console.log(`Found ${searchResult.totalFound} routes near ${query}`);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && routes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando rutas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render routes */}
        {filteredRoutes.map((route) => (
          <React.Fragment key={route.id}>
            {/* Route polyline */}
            <Polyline
              positions={route.coordinates.map(coord => [coord[1], coord[0]])}
              color={getRouteColor(route.difficulty)}
              weight={4}
              opacity={0.8}
              eventHandlers={{
                click: () => handleRouteClick(route)
              }}
            />

            {/* Start marker */}
            <Marker
              position={[route.coordinates[0][1], route.coordinates[0][0]]}
              icon={createCustomIcon(getRouteColor(route.difficulty), 'start')}
              eventHandlers={{
                click: () => handleRouteClick(route)
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">{route.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{route.description}</p>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2 py-1 bg-gray-100 rounded">{route.difficulty}</span>
                    <span>{route.distance}km</span>
                    <span>{route.duration}</span>
                  </div>
                </div>
              </Popup>
            </Marker>

            {/* End marker */}
            <Marker
              position={[route.coordinates[route.coordinates.length - 1][1], route.coordinates[route.coordinates.length - 1][0]]}
              icon={createCustomIcon(getRouteColor(route.difficulty), 'end')}
              eventHandlers={{
                click: () => handleRouteClick(route)
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">{route.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">Punto final</p>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2 py-1 bg-gray-100 rounded">{route.difficulty}</span>
                    <span>{route.distance}km</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Map controls */}
      <MapControls
        onFilterChange={handleFilterChange}
        onSearch={handleSearchMore}
        onLocationSearch={handleLocationSearch}
        routes={filteredRoutes}
      />

      {/* Route info panel */}
      <RouteInfoPanel
        route={selectedRouteInfo}
        onClose={() => setSelectedRouteInfo(null)}
        onViewDetails={onRouteSelect}
      />

      {/* Real-time data indicator */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-xs text-gray-600">
            {autoRefresh ? 'Actualización automática' : 'Datos estáticos'}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Última actualización: {lastUpdate.toLocaleTimeString()}
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {filteredRoutes.length} rutas visibles
        </div>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className="text-xs text-blue-600 hover:text-blue-800 mt-1"
        >
          {autoRefresh ? 'Desactivar' : 'Activar'} auto-actualización
        </button>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[1001]">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Cargando más rutas...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMapView;
