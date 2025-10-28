import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Mountain, 
  Star, 
  Heart, 
  Share2, 
  Download, 
  Navigation,
  Camera,
  TrendingUp,
  Users,
  Calendar,
  Flag
} from 'lucide-react';
import { geospatialService } from '../services/geospatialService';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Elevation profile component
const ElevationProfile = ({ elevationProfile, coordinates }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState(null);

  if (!elevationProfile || elevationProfile.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Perfil de Elevación
        </h3>
        <div className="h-48 flex items-center justify-center text-gray-500">
          <p>Datos de elevación no disponibles</p>
        </div>
      </div>
    );
  }

  const maxElevation = Math.max(...elevationProfile);
  const minElevation = Math.min(...elevationProfile);
  const elevationGain = maxElevation - minElevation;

  // Calculate terrain analysis
  const calculateTerrainAnalysis = () => {
    const segments = [];
    let totalAscent = 0;
    let totalDescent = 0;
    let steepestAscent = 0;
    let steepestDescent = 0;

    for (let i = 1; i < elevationProfile.length; i++) {
      const elevationDiff = elevationProfile[i] - elevationProfile[i - 1];
      const distance = 0.1; // Assume 100m segments
      const gradient = (elevationDiff / distance) * 100; // Percentage

      if (elevationDiff > 0) {
        totalAscent += elevationDiff;
        steepestAscent = Math.max(steepestAscent, gradient);
      } else {
        totalDescent += Math.abs(elevationDiff);
        steepestDescent = Math.max(steepestDescent, Math.abs(gradient));
      }

      segments.push({
        index: i,
        elevation: elevationProfile[i],
        gradient: gradient,
        type: gradient > 10 ? 'steep' : gradient > 5 ? 'moderate' : 'gentle'
      });
    }

    return {
      totalAscent: Math.round(totalAscent),
      totalDescent: Math.round(totalDescent),
      steepestAscent: Math.round(steepestAscent),
      steepestDescent: Math.round(steepestDescent),
      segments: segments
    };
  };

  const terrainAnalysis = calculateTerrainAnalysis();

  const getElevationColor = (elevation) => {
    const ratio = (elevation - minElevation) / (maxElevation - minElevation);
    if (ratio < 0.3) return '#10b981'; // Green for low
    if (ratio < 0.7) return '#f59e0b'; // Yellow for medium
    return '#ef4444'; // Red for high
  };

  const getGradientColor = (gradient) => {
    const absGradient = Math.abs(gradient);
    if (absGradient < 5) return '#10b981'; // Green for gentle
    if (absGradient < 10) return '#f59e0b'; // Yellow for moderate
    return '#ef4444'; // Red for steep
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Perfil de Elevación
        </h3>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{elevationGain}m</span> de desnivel
        </div>
      </div>

      <div className="relative h-48 bg-gray-50 rounded-lg p-4">
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <line
              key={index}
              x1="0"
              y1={ratio * 160}
              x2="100%"
              y2={ratio * 160}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Elevation line */}
          <polyline
            points={elevationProfile.map((elevation, index) => {
              const x = (index / (elevationProfile.length - 1)) * 100 + '%';
              const y = 160 - ((elevation - minElevation) / (maxElevation - minElevation)) * 160;
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Hover point */}
          {hoveredPoint && (
            <circle
              cx={hoveredPoint.x}
              cy={hoveredPoint.y}
              r="4"
              fill="#ef4444"
              stroke="white"
              strokeWidth="2"
            />
          )}
        </svg>

        {/* Elevation labels */}
        <div className="absolute right-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>{maxElevation}m</span>
          <span>{Math.round((maxElevation + minElevation) / 2)}m</span>
          <span>{minElevation}m</span>
        </div>

        {/* Distance labels */}
        <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500">
          <span>0km</span>
          <span>{(coordinates.length * 0.5).toFixed(1)}km</span>
        </div>
      </div>

      {/* Terrain Analysis */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-md font-semibold text-gray-800 mb-3">Análisis del Terreno</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-xl font-bold text-green-600">{terrainAnalysis.totalAscent}m</div>
            <div className="text-sm text-gray-600">Ascenso total</div>
          </div>
          <div>
            <div className="text-xl font-bold text-red-600">{terrainAnalysis.totalDescent}m</div>
            <div className="text-sm text-gray-600">Descenso total</div>
          </div>
          <div>
            <div className="text-xl font-bold text-orange-600">{terrainAnalysis.steepestAscent}%</div>
            <div className="text-sm text-gray-600">Pendiente máxima (subida)</div>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-600">{terrainAnalysis.steepestDescent}%</div>
            <div className="text-sm text-gray-600">Pendiente máxima (bajada)</div>
          </div>
        </div>
      </div>

      {/* Basic Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-600">{maxElevation}m</div>
          <div className="text-sm text-gray-600">Altura máxima</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-600">{minElevation}m</div>
          <div className="text-sm text-gray-600">Altura mínima</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">{elevationGain}m</div>
          <div className="text-sm text-gray-600">Desnivel total</div>
        </div>
      </div>

      {/* Gradient Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600">Suave (&lt;5%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-gray-600">Moderado (5-10%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-600">Empinado (&gt;10%)</span>
        </div>
      </div>
    </div>
  );
};

// Photo gallery component
const PhotoGallery = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Camera className="w-5 h-5 mr-2 text-green-600" />
          Galería de Fotos
        </h3>
        <div className="h-48 flex items-center justify-center text-gray-500">
          <p>No hay fotos disponibles para esta ruta</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Camera className="w-5 h-5 mr-2 text-green-600" />
        Galería de Fotos ({photos.length})
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={photo.thumbnail}
              alt={photo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white text-2xl font-bold z-10"
            >
              ×
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-4 text-white">
              <h4 className="font-semibold">{selectedPhoto.title}</h4>
              <p className="text-sm opacity-75">Por {photo.owner}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Waypoints component
const WaypointsList = ({ waypoints }) => {
  if (!waypoints || waypoints.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Flag className="w-5 h-5 mr-2 text-green-600" />
        Puntos de Interés ({waypoints.length})
      </h3>

      <div className="space-y-3">
        {waypoints.map((waypoint, index) => (
          <div key={waypoint.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {index + 1}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{waypoint.name}</h4>
              <p className="text-sm text-gray-600">{waypoint.description}</p>
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                <span className="flex items-center">
                  <Mountain className="w-3 h-3 mr-1" />
                  {waypoint.elevation}m
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {waypoint.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main route detail component
const RouteDetailPage = ({ route, onBack }) => {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (route) {
      loadRouteDetails();
    }
  }, [route]);

  const loadRouteDetails = async () => {
    try {
      setLoading(true);
      const fullRouteData = await geospatialService.getRouteWithFullData(route.id);
      setRouteData(fullRouteData || route);
    } catch (error) {
      console.error('Error loading route details:', error);
      setRouteData(route);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles de la ruta...</p>
        </div>
      </div>
    );
  }

  if (!routeData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No se encontraron detalles de la ruta</p>
          <button
            onClick={onBack}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Volver al mapa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al mapa</span>
          </button>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{routeData.name}</h1>
                <p className="text-gray-600 mb-4">{routeData.description}</p>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(routeData.difficulty)}`}>
                    {routeData.difficulty}
                  </span>
                  <span className="text-sm text-gray-600">{routeData.terrain}</span>
                  <span className="text-sm text-gray-600">{routeData.source}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{routeData.distance}km</div>
                <div className="text-sm text-gray-600">Distancia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{routeData.duration}</div>
                <div className="text-sm text-gray-600">Duración</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{routeData.elevation_gain}m</div>
                <div className="text-sm text-gray-600">Desnivel</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{routeData.rating}</div>
                <div className="text-sm text-gray-600">Valoración</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Resumen', icon: MapPin },
                { id: 'map', label: 'Mapa', icon: Navigation },
                { id: 'elevation', label: 'Elevación', icon: TrendingUp },
                { id: 'photos', label: 'Fotos', icon: Camera }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WaypointsList waypoints={routeData.waypoints} />
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Adicional</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{routeData.reviews} reseñas</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Última actualización: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Superficie: {routeData.surface}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-96">
                <MapContainer
                  center={[routeData.coordinates[0][1], routeData.coordinates[0][0]]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polyline
                    positions={routeData.coordinates.map(coord => [coord[1], coord[0]])}
                    color="#10b981"
                    weight={4}
                    opacity={0.8}
                  />
                  {routeData.waypoints?.map((waypoint, index) => (
                    <Marker
                      key={waypoint.id}
                      position={[waypoint.lat, waypoint.lng]}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-semibold text-sm">{waypoint.name}</h3>
                          <p className="text-xs text-gray-600">{waypoint.description}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {waypoint.elevation}m - {waypoint.type}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          )}

          {activeTab === 'elevation' && (
            <ElevationProfile
              elevationProfile={routeData.elevation_profile}
              coordinates={routeData.coordinates}
            />
          )}

          {activeTab === 'photos' && (
            <PhotoGallery photos={routeData.photos} />
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
              <Navigation className="w-5 h-5" />
              <span>Iniciar Navegación</span>
            </button>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
              <Download className="w-5 h-5" />
              <span>Descargar GPX</span>
            </button>
            <button className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors">
              <Share2 className="w-5 h-5" />
              <span>Compartir Ruta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetailPage;
