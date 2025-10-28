import React, { useState, useEffect } from 'react';
import { Plus, Sun, MapPin, Star } from 'lucide-react';
import { apiService } from '../services/api';

const MapView = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock routes data
        const mockRoutes = [
          {
            id: '1',
            name: 'Mountain Trail Adventure',
            coordinates: [
              { lat: 40.758, lng: -73.985 },
              { lat: 40.760, lng: -73.980 },
              { lat: 40.765, lng: -73.975 }
            ],
            waypoints: [
              { lat: 40.758, lng: -73.985, name: 'Start Point', type: 'Trailhead' },
              { lat: 40.760, lng: -73.980, name: 'Vista Point', type: 'Viewpoint' },
              { lat: 40.765, lng: -73.975, name: 'Summit', type: 'Peak' }
            ],
            difficulty: 'Medium',
            distance: '5.2km',
            terrain: 'Mountain',
            duration: '2.5 hours'
          }
        ];
        
        setRoutes(mockRoutes);
        setSelectedRoute(mockRoutes[0]);
        setWeather({
          temperature: '22°C',
          condition: 'Sunny',
          forecast: 'Perfect hiking weather'
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set fallback data
        setWeather({
          temperature: '18°C',
          condition: 'Sunny',
          forecast: '23 mins clear'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateRoute = async () => {
    try {
      setLoading(true);
      // Simulate AI route generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newRoute = {
        id: Date.now().toString(),
        name: `AI Generated Route ${routes.length + 1}`,
        coordinates: [
          { lat: 40.750, lng: -73.990 },
          { lat: 40.755, lng: -73.985 },
          { lat: 40.760, lng: -73.980 },
          { lat: 40.765, lng: -73.975 }
        ],
        waypoints: [
          { lat: 40.750, lng: -73.990, name: 'AI Start', type: 'Trailhead' },
          { lat: 40.755, lng: -73.985, name: 'AI Checkpoint', type: 'Rest Point' },
          { lat: 40.760, lng: -73.980, name: 'AI Vista', type: 'Viewpoint' },
          { lat: 40.765, lng: -73.975, name: 'AI Summit', type: 'Peak' }
        ],
        difficulty: 'Easy',
        distance: '8.5km',
        terrain: 'Mixed',
        duration: '3 hours'
      };
      
      setRoutes(prev => [newRoute, ...prev]);
      setSelectedRoute(newRoute);
      alert('¡Nueva ruta generada con IA!');
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
      // Simulate saving route
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving route:', selectedRoute);
      alert(`¡Ruta "${selectedRoute.name}" guardada exitosamente!`);
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Error al guardar la ruta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 relative bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative bg-gray-100">
      {/* Weather Widget */}
      <div className="absolute top-4 left-4 z-10 bg-slate-800 text-white px-3 py-2 rounded-lg flex items-center space-x-2">
        <Sun className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-medium">{weather?.temperature || '18°C'}</span>
        <span className="text-xs text-slate-300">{weather?.forecast || '23 mins clear'}</span>
      </div>

      {/* Zoom Control */}
      <div className="absolute top-4 right-4 z-10">
        <button className="w-10 h-10 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Mock Map with Route */}
      <div 
        className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* Route Line Simulation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M200,400 Q300,200 500,300 T800,250 L900,200"
            stroke="#10b981"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="animate-pulse"
          />
        </svg>

        {/* Route Waypoints */}
        <div className="absolute" style={{ top: '400px', left: '200px' }}>
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-bounce" />
        </div>
        <div className="absolute" style={{ top: '300px', left: '500px' }}>
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg" />
        </div>
        <div className="absolute" style={{ top: '200px', left: '900px' }}>
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg" />
        </div>

        {/* Mock Location Labels */}
        <div className="absolute" style={{ top: '450px', left: '150px' }}>
          <span className="text-xs text-slate-600 bg-white/80 px-2 py-1 rounded shadow">Trailhead</span>
        </div>
        <div className="absolute" style={{ top: '250px', left: '450px' }}>
          <span className="text-xs text-slate-600 bg-white/80 px-2 py-1 rounded shadow">Vista Point</span>
        </div>
        <div className="absolute" style={{ top: '150px', left: '850px' }}>
          <span className="text-xs text-slate-600 bg-white/80 px-2 py-1 rounded shadow">Summit</span>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button 
          onClick={handleGenerateRoute}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 shadow-lg disabled:opacity-50"
          disabled={loading}
        >
          <Star className="w-4 h-4" />
          <span className="font-medium">Generar Ruta con IA</span>
        </button>
        <button 
          onClick={handleSaveRoute}
          className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors flex items-center space-x-2 shadow-lg disabled:opacity-50"
          disabled={!selectedRoute}
        >
          <MapPin className="w-4 h-4" />
          <span className="font-medium">Guardar Ruta</span>
        </button>
      </div>
    </div>
  );
};

export default MapView;