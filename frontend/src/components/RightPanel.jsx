import React, { useState, useEffect } from 'react';
import { Search, Zap, Star, Clock, MapPin, Sliders } from 'lucide-react';
import { apiService } from '../services/api';

const RightPanel = ({ onGenerateRoute }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: 'Easy',
    distance: '10km',
    terrain: 'Mountain/Slope'
  });

  useEffect(() => {
    fetchTrails();
  }, [selectedFilters]);

  const fetchTrails = async () => {
    try {
      setLoading(true);
      const trailsData = await apiService.getTrails(selectedFilters);
      setTrails(trailsData);
    } catch (error) {
      console.error('Error fetching trails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchTrails();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await apiService.searchTrails(searchQuery, selectedFilters);
      setTrails(searchResults);
    } catch (error) {
      console.error('Error searching trails:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    try {
      setLoading(true);
      const result = await apiService.generateRouteWithAI({
        difficulty: selectedFilters.difficulty,
        distance: selectedFilters.distance,
        terrain: selectedFilters.terrain,
        location: 'Sierra de Guadarrama, Spain',
        latitude: 40.416775,
        longitude: -3.703790
      });

      // Notify parent component if callback provided
      if (onGenerateRoute && result.success) {
        onGenerateRoute(result.route);
      }

      if (result.success) {
        alert('¡Ruta generada con IA exitosamente!');
      } else {
        alert(result.message || 'Error al generar la ruta');
      }
    } catch (error) {
      console.error('Error generating AI route:', error);
      alert('Error al generar la ruta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? null : value
    }));
  };

  return (
    <div className="w-80 bg-gradient-to-b from-white to-gray-50 h-screen overflow-y-auto border-l border-gray-200 shadow-xl">
      {/* Search Section - Enhanced */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-green-600" />
          Explorar Rutas
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="¿Dónde quieres explorar?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-700 transition-all shadow-md"
          >
            <Search className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Filters Section - Enhanced */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-green-600" />
            <h3 className="font-bold text-slate-800">Filtros</h3>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
          >
            {showFilters ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        {showFilters && (
          <div className="space-y-3 animate-fade-in">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Dificultad</label>
              <div className="flex flex-wrap gap-2">
                {['Easy', 'Medium', 'Hard', 'Expert'].map((level) => (
                  <button
                    key={level}
                    onClick={() => toggleFilter('difficulty', level)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedFilters.difficulty === level
                        ? 'bg-green-600 text-white shadow-md'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Distancia</label>
              <div className="flex flex-wrap gap-2">
                {['5km', '10km', '15km', '20km+'].map((dist) => (
                  <button
                    key={dist}
                    onClick={() => toggleFilter('distance', dist)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedFilters.distance === dist
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {dist}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Terreno</label>
              <div className="flex flex-wrap gap-2">
                {['Mountain', 'Forest', 'Desert', 'Coastal'].map((terr) => (
                  <button
                    key={terr}
                    onClick={() => toggleFilter('terrain', terr)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedFilters.terrain === terr
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    {terr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!showFilters && (
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {selectedFilters.difficulty}
            </span>
            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {selectedFilters.distance}
            </span>
            <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {selectedFilters.terrain}
            </span>
          </div>
        )}
      </div>

      {/* AI Generate Routes Button - Enhanced */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
        <button
          onClick={handleGenerateAI}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 px-4 rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl group disabled:opacity-50 transform hover:scale-105"
        >
          <Zap className="w-6 h-6 group-hover:animate-bounce" />
          <span className="font-bold text-base">Generar con IA</span>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </button>
        <p className="text-xs text-center text-gray-600 mt-2">
          ✨ Rutas personalizadas con inteligencia artificial
        </p>
      </div>

      {/* Recommended Trails - Enhanced */}
      <div className="p-4">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500 fill-current" />
          <span>Rutas Recomendadas</span>
        </h3>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 absolute top-0 left-0"></div>
            </div>
            <p className="text-sm text-gray-600 mt-4">Cargando rutas...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trails.map((trail, index) => (
            <div
              key={trail.id}
              className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-green-400 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-36">
                <img
                  src={trail.image}
                  alt={trail.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {trail.time}
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <h4 className="font-bold text-white text-sm drop-shadow-lg">{trail.name}</h4>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center space-x-2 text-xs text-slate-600 mb-3">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="font-medium">{trail.distance}</span>
                  <span>•</span>
                  <span>{trail.description}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(trail.rating)
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-700 ml-1">{trail.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{trail.reviews} reviews</span>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightPanel;