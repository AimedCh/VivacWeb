import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation, Plus, Minus, Home, Zap } from 'lucide-react';
import { apiService } from '../services/api';

// Set your Mapbox access token
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
mapboxgl.accessToken = MAPBOX_TOKEN;

const RealMapView = ({ selectedRoute, onRouteSelect }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-3.703790);
  const [lat, setLat] = useState(40.416775);
  const [zoom, setZoom] = useState(10);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [lng, lat],
        zoom: zoom
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Error al cargar el mapa. Verifica tu conexión a internet.');
      return;
    }

    // Add navigation controls
    try {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add geolocate control
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        }),
        'top-right'
      );

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
      }), 'bottom-left');

      map.current.on('move', () => {
        setLng(map.current.getCenter().lng.toFixed(4));
        setLat(map.current.getCenter().lat.toFixed(4));
        setZoom(map.current.getZoom().toFixed(2));
      });

      // Load initial routes
      loadRoutes();
      loadWeather();
    } catch (error) {
      console.error('Error adding map controls:', error);
      setMapError('Error al configurar los controles del mapa.');
    }
  }, []);

  useEffect(() => {
    if (selectedRoute && map.current) {
      displayRoute(selectedRoute);
    }
  }, [selectedRoute]);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const routesData = await apiService.getRoutes();
      setRoutes(routesData);
      
      // Add route markers to map
      if (map.current) {
        addRouteMarkers(routesData);
      }
    } catch (error) {
      console.error('Error loading routes:', error);
      // Fallback to mock data
      const mockRoutes = getMockRoutes();
      setRoutes(mockRoutes);
      if (map.current) {
        addRouteMarkers(mockRoutes);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadWeather = async () => {
    try {
      const weatherData = await apiService.getWeather(lat, lng);
      setWeather(weatherData);
    } catch (error) {
      console.error('Error loading weather:', error);
      setWeather({
        temperature: '18°C',
        condition: 'Sunny',
        forecast: 'Clear skies'
      });
    }
  };

  const getMockRoutes = () => {
    return [
      {
        id: 1,
        name: 'Sierra de Guadarrama - Peñalara',
        coordinates: [
          [-3.703790, 40.416775],
          [-3.700000, 40.420000],
          [-3.695000, 40.425000]
        ],
        waypoints: [
          { lat: 40.416775, lng: -3.703790, name: 'Puerto de Cotos', type: 'Trailhead' },
          { lat: 40.420000, lng: -3.700000, name: 'Laguna Grande', type: 'Viewpoint' },
          { lat: 40.425000, lng: -3.695000, name: 'Pico Peñalara', type: 'Summit' }
        ],
        difficulty: 'Medium',
        distance: '12.5km',
        terrain: 'Mountain',
        duration: '4-5 hours',
        rating: 4.7,
        reviews: 234
      },
      {
        id: 2,
        name: 'Picos de Europa - Ruta del Cares',
        coordinates: [
          [-4.750000, 43.200000],
          [-4.745000, 43.205000],
          [-4.740000, 43.210000]
        ],
        waypoints: [
          { lat: 43.200000, lng: -4.750000, name: 'Poncebos', type: 'Trailhead' },
          { lat: 43.205000, lng: -4.745000, name: 'Garganta Divina', type: 'Viewpoint' },
          { lat: 43.210000, lng: -4.740000, name: 'Caín', type: 'Village' }
        ],
        difficulty: 'Easy',
        distance: '22km',
        terrain: 'Mountain',
        duration: '6-7 hours',
        rating: 4.9,
        reviews: 456
      }
    ];
  };

  const addRouteMarkers = (routes) => {
    if (!map.current) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    routes.forEach(route => {
      if (route.waypoints && route.waypoints.length > 0) {
        route.waypoints.forEach((waypoint, index) => {
          // Create custom marker element
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.cssText = `
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: ${getMarkerColor(route.difficulty)};
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            color: white;
            cursor: pointer;
          `;
          el.textContent = index + 1;

          // Add click event
          el.addEventListener('click', () => {
            onRouteSelect && onRouteSelect(route);
          });

          // Create popup
          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false
          }).setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-sm">${waypoint.name}</h3>
              <p class="text-xs text-gray-600">${waypoint.type}</p>
              <p class="text-xs text-blue-600 mt-1">${route.name}</p>
            </div>
          `);

          // Add marker to map
          new mapboxgl.Marker(el)
            .setLngLat([waypoint.lng, waypoint.lat])
            .setPopup(popup)
            .addTo(map.current);
        });
      }
    });
  };

  const getMarkerColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const displayRoute = (route) => {
    if (!map.current || !route.coordinates) return;

    // Remove existing route layers
    if (map.current.getSource('route')) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }

    // Add route line
    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route.coordinates
        }
      }
    });

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': getMarkerColor(route.difficulty),
        'line-width': 4,
        'line-opacity': 0.8
      }
    });

    // Fit map to route bounds
    if (route.coordinates.length > 0) {
      const bounds = route.coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(route.coordinates[0], route.coordinates[0]));

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  };

  const handleGenerateAI = async () => {
    try {
      setLoading(true);
      const result = await apiService.generateRouteWithAI({
        difficulty: 'Medium',
        terrain: 'Mountain',
        distance: '10km',
        location: 'Sierra de Guadarrama, Spain',
        latitude: lat,
        longitude: lng
      });

      if (result.success && result.route) {
        setRoutes(prev => [result.route, ...prev]);
        displayRoute(result.route);
        alert('¡Nueva ruta generada con IA!');
      }
    } catch (error) {
      console.error('Error generating route:', error);
      alert('Error al generar la ruta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoute = async () => {
    if (!selectedRoute) {
      alert('No hay ruta seleccionada para guardar');
      return;
    }

    try {
      setLoading(true);
      const savedRoute = await apiService.createRoute(selectedRoute);
      if (savedRoute) {
        alert(`¡Ruta "${savedRoute.name}" guardada exitosamente!`);
      }
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Error al guardar la ruta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 relative bg-gray-100">
      {/* Weather Widget */}
      <div className="absolute top-4 left-4 z-[1000] bg-slate-800 text-white px-4 py-3 rounded-xl flex items-center space-x-3 shadow-2xl border border-slate-600">
        <div className="animate-pulse">
          <Home className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <span className="text-lg font-bold">{weather?.temperature || '18°C'}</span>
          <span className="text-xs text-slate-300 ml-2">{weather?.forecast || 'Clear skies'}</span>
        </div>
      </div>

      {/* Route Info Widget */}
      {selectedRoute && (
        <div className="absolute top-4 right-4 z-[1000] bg-white text-slate-800 px-5 py-4 rounded-xl shadow-2xl max-w-xs border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base text-green-700">{selectedRoute.name}</h3>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
              <span className="text-slate-600 font-medium">📏 Distancia:</span>
              <span className="font-bold text-blue-700">{selectedRoute.distance}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg">
              <span className="text-slate-600 font-medium">⚡ Dificultad:</span>
              <span className="font-bold text-orange-700">{selectedRoute.difficulty}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
              <span className="text-slate-600 font-medium">⏱️ Duración:</span>
              <span className="font-bold text-purple-700">{selectedRoute.duration}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
              <span className="text-slate-600 font-medium">🏔️ Terreno:</span>
              <span className="font-bold text-green-700">{selectedRoute.terrain}</span>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-[1000] flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center space-y-3">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 absolute top-0 left-0"></div>
            </div>
            <span className="text-slate-700 font-medium">Cargando rutas...</span>
          </div>
        </div>
      )}

      {/* Map Container */}
      {mapError ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center p-8">
            <div className="text-red-500 text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Error al cargar el mapa</h3>
            <p className="text-gray-600 mb-4">{mapError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Recargar página
            </button>
          </div>
        </div>
      ) : (
        <div ref={mapContainer} className="w-full h-full" />
      )}

      {/* Action Buttons */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1000] flex space-x-4">
        <button
          onClick={handleGenerateAI}
          disabled={loading}
          className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-300 flex items-center space-x-3 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-105"
        >
          <Zap className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-bold text-lg">Generar Ruta con IA</span>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </button>

        <button
          onClick={handleSaveRoute}
          disabled={loading || !selectedRoute}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 flex items-center space-x-3 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          <Home className="w-5 h-5" />
          <span className="font-bold text-lg">Guardar Ruta</span>
        </button>
      </div>

      {/* Coordinates Display */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-lg text-xs text-gray-600">
        <div>Longitude: {lng}</div>
        <div>Latitude: {lat}</div>
        <div>Zoom: {zoom}</div>
      </div>
    </div>
  );
};

export default RealMapView;