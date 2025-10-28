import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, Clock, Mountain, Filter, Search, Zap, ExternalLink } from 'lucide-react';
import { apiService } from '../services/api';
import { wikilocService } from '../services/wikilocService';

const CountryRoutesPage = ({ country, onBack }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: 'All',
    terrain: 'All',
    distance: 'All'
  });

  useEffect(() => {
    fetchCountryRoutes();
  }, [country, selectedFilters]);

  const fetchCountryRoutes = async () => {
    try {
      setLoading(true);
      
      // First try to get routes from Wikiloc
      const wikilocResult = await wikilocService.getPopularRoutes(country.name, 20);
      
      if (wikilocResult.success && wikilocResult.routes.length > 0) {
        // Apply filters to Wikiloc data
        let filteredRoutes = wikilocResult.routes;
        
        if (selectedFilters.difficulty !== 'All') {
          filteredRoutes = filteredRoutes.filter(route => route.difficulty === selectedFilters.difficulty);
        }
        if (selectedFilters.terrain !== 'All') {
          filteredRoutes = filteredRoutes.filter(route => route.terrain === selectedFilters.terrain);
        }
        
        setRoutes(filteredRoutes);
      } else {
        // Fallback to API
        const apiResult = await apiService.getCountryRoutes(country.name, selectedFilters);
        
        if (apiResult.success && apiResult.routes.length > 0) {
          setRoutes(apiResult.routes);
        } else {
          // Final fallback to mock data
          const mockRoutes = generateCountryRoutes(country.name, selectedFilters);
          setRoutes(mockRoutes);
        }
      }
    } catch (error) {
      console.error('Error fetching country routes:', error);
      // Fallback to mock data on error
      const mockRoutes = generateCountryRoutes(country.name, selectedFilters);
      setRoutes(mockRoutes);
    } finally {
      setLoading(false);
    }
  };

  const generateCountryRoutes = (countryName, filters) => {
    const baseRoutes = {
      'Spain': [
        {
          id: 1,
          name: 'Sierra de Guadarrama - Peñalara',
          description: 'Una ruta clásica por la sierra madrileña con vistas espectaculares',
          difficulty: 'Medium',
          terrain: 'Mountain',
          distance: '12.5km',
          duration: '4-5 hours',
          elevation: '850m',
          rating: 4.7,
          reviews: 234,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
          waypoints: [
            { name: 'Puerto de Cotos', type: 'Trailhead' },
            { name: 'Laguna Grande', type: 'Viewpoint' },
            { name: 'Pico Peñalara', type: 'Summit' }
          ]
        },
        {
          id: 2,
          name: 'Picos de Europa - Ruta del Cares',
          description: 'La famosa "Garganta Divina" entre Asturias y León',
          difficulty: 'Easy',
          terrain: 'Mountain',
          distance: '22km',
          duration: '6-7 hours',
          elevation: '200m',
          rating: 4.9,
          reviews: 456,
          image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=250&fit=crop',
          waypoints: [
            { name: 'Poncebos', type: 'Trailhead' },
            { name: 'Garganta Divina', type: 'Viewpoint' },
            { name: 'Caín', type: 'Village' }
          ]
        },
        {
          id: 3,
          name: 'Sierra Nevada - Mulhacén',
          description: 'El techo de la Península Ibérica con vistas al Mediterráneo',
          difficulty: 'Hard',
          terrain: 'Mountain',
          distance: '18km',
          duration: '8-10 hours',
          elevation: '1200m',
          rating: 4.8,
          reviews: 189,
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
          waypoints: [
            { name: 'Hoya de la Mora', type: 'Trailhead' },
            { name: 'Refugio Poqueira', type: 'Shelter' },
            { name: 'Pico Mulhacén', type: 'Summit' }
          ]
        }
      ],
      'France': [
        {
          id: 4,
          name: 'Mont Blanc - Tour du Mont Blanc',
          description: 'La ruta circular más famosa de los Alpes',
          difficulty: 'Hard',
          terrain: 'Mountain',
          distance: '170km',
          duration: '10-12 days',
          elevation: '10000m',
          rating: 4.9,
          reviews: 567,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
          waypoints: [
            { name: 'Chamonix', type: 'Trailhead' },
            { name: 'Refuge du Lac Blanc', type: 'Shelter' },
            { name: 'Col de la Seigne', type: 'Pass' }
          ]
        },
        {
          id: 5,
          name: 'Pyrénées - Cirque de Gavarnie',
          description: 'Un circo glaciar espectacular en el corazón de los Pirineos',
          difficulty: 'Medium',
          terrain: 'Mountain',
          distance: '8km',
          duration: '3-4 hours',
          elevation: '400m',
          rating: 4.6,
          reviews: 234,
          image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=250&fit=crop',
          waypoints: [
            { name: 'Gavarnie', type: 'Village' },
            { name: 'Cascada Grande', type: 'Waterfall' },
            { name: 'Cirque de Gavarnie', type: 'Viewpoint' }
          ]
        }
      ],
      'Italy': [
        {
          id: 6,
          name: 'Dolomitas - Tre Cime di Lavaredo',
          description: 'Las tres cimas más famosas de los Dolomitas',
          difficulty: 'Medium',
          terrain: 'Mountain',
          distance: '10km',
          duration: '4-5 hours',
          elevation: '600m',
          rating: 4.8,
          reviews: 345,
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
          waypoints: [
            { name: 'Rifugio Auronzo', type: 'Trailhead' },
            { name: 'Lago di Misurina', type: 'Lake' },
            { name: 'Tre Cime', type: 'Summit' }
          ]
        }
      ]
    };

    let countryRoutes = baseRoutes[countryName] || [];
    
    // Apply filters
    if (filters.difficulty !== 'All') {
      countryRoutes = countryRoutes.filter(route => route.difficulty === filters.difficulty);
    }
    if (filters.terrain !== 'All') {
      countryRoutes = countryRoutes.filter(route => route.terrain === filters.terrain);
    }

    return countryRoutes;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchCountryRoutes();
      return;
    }

    try {
      setLoading(true);
      const searchResult = await wikilocService.searchRoutes(searchQuery, country.name, selectedFilters);
      
      if (searchResult.success) {
        setRoutes(searchResult.routes);
      } else {
        // Fallback to local filtering
        const filteredRoutes = routes.filter(route =>
          route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (route.tags && route.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
        );
        setRoutes(filteredRoutes);
      }
    } catch (error) {
      console.error('Error searching routes:', error);
      // Fallback to local filtering
      const filteredRoutes = routes.filter(route =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (route.tags && route.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
      setRoutes(filteredRoutes);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (route.tags && route.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleGenerateAI = async () => {
    try {
      setLoading(true);
      const result = await apiService.generateRouteWithAI({
        difficulty: 'Medium',
        terrain: 'Mountain',
        distance: '10km',
        location: country.name,
        latitude: 40.416775,
        longitude: -3.703790
      });

      if (result.success) {
        alert(`¡Nueva ruta generada con IA para ${country.name}!`);
      }
    } catch (error) {
      console.error('Error generating AI route:', error);
      alert('Error al generar la ruta. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="mb-4 flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Explorar</span>
          </button>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-6xl">{country.flag}</div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">{country.name}</h1>
              <p className="text-gray-600 text-lg">{country.trails.toLocaleString()} rutas disponibles</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Buscar rutas en ${country.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-700 transition-all"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={selectedFilters.difficulty}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="All">Todas las dificultades</option>
                <option value="Easy">Fácil</option>
                <option value="Medium">Media</option>
                <option value="Hard">Difícil</option>
              </select>
              <select
                value={selectedFilters.terrain}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, terrain: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="All">Todos los terrenos</option>
                <option value="Mountain">Montaña</option>
                <option value="Forest">Bosque</option>
                <option value="Coastal">Costa</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Generate Button */}
        <div className="mb-6">
          <button
            onClick={handleGenerateAI}
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-300 flex items-center space-x-3 shadow-2xl disabled:opacity-50 transform hover:scale-105"
          >
            <Zap className="w-5 h-5" />
            <span className="font-bold">Generar Ruta Personalizada con IA</span>
          </button>
        </div>

        {/* Routes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No se encontraron rutas para {country.name}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative h-48">
                  <img
                    src={route.image || route.image_url}
                    alt={route.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {route.difficulty}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {route.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {route.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      <span>{route.distance}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{route.duration || route.estimated_time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mountain className="w-4 h-4 mr-2 text-purple-600" />
                      <span>{route.elevation || route.elevation_gain}m desnivel</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(route.rating || route.rating_average || 0)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-gray-700 ml-1">{route.rating || route.rating_average || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 font-medium">{route.reviews || route.rating_count || 0} reviews</span>
                      {route.wikiloc_url && (
                        <a
                          href={route.wikiloc_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Ver en Wikiloc"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Country Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            🌍 Sobre {country.name}
          </h3>
          <p className="text-gray-600">
            {country.name} ofrece una increíble diversidad de rutas de senderismo y vivac. 
            Desde montañas imponentes hasta paisajes costeros, encontrarás rutas para todos 
            los niveles de experiencia. Explora la belleza natural de {country.name} y 
            descubre rutas únicas generadas con inteligencia artificial.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountryRoutesPage;
