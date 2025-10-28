// Wikiloc API Service
// Note: This is a mock service since Wikiloc doesn't have a public API
// In a real implementation, you would need to use web scraping or partner with Wikiloc

export const wikilocService = {
  // Mock Wikiloc data for popular Spanish routes
  getPopularRoutes: async (country = 'Spain', limit = 10) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWikilocRoutes = {
        'Spain': [
          {
            id: 'wikiloc_1',
            name: 'Sierra de Guadarrama - Peñalara desde Puerto de Cotos',
            description: 'Ruta clásica de montaña en la Sierra de Guadarrama. Subida al pico más alto de la sierra madrileña con vistas espectaculares.',
            difficulty: 'Medium',
            distance: '12.5km',
            elevation_gain: 850,
            duration: '4-5 hours',
            rating: 4.7,
            reviews: 234,
            wikiloc_url: 'https://es.wikiloc.com/rutas-senderismo/sierra-de-guadarrama-penalara-desde-puerto-de-cotos-123456',
            coordinates: [
              [-3.703790, 40.416775], // Puerto de Cotos
              [-3.700000, 40.420000], // Laguna Grande
              [-3.695000, 40.425000], // Pico Peñalara
              [-3.690000, 40.430000], // Descenso
              [-3.703790, 40.416775]  // Vuelta al inicio
            ],
            waypoints: [
              { lat: 40.416775, lng: -3.703790, name: 'Puerto de Cotos', type: 'Trailhead', elevation: 1830 },
              { lat: 40.420000, lng: -3.700000, name: 'Laguna Grande', type: 'Viewpoint', elevation: 2000 },
              { lat: 40.425000, lng: -3.695000, name: 'Pico Peñalara', type: 'Summit', elevation: 2428 },
              { lat: 40.430000, lng: -3.690000, name: 'Collado de la Ventana', type: 'Pass', elevation: 2200 }
            ],
            terrain: 'Mountain',
            image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
            created_by: 'Wikiloc Community',
            created_at: '2024-01-15',
            tags: ['montaña', 'guadarrama', 'penalara', 'madrid', 'senderismo']
          },
          {
            id: 'wikiloc_2',
            name: 'Picos de Europa - Ruta del Cares (Garganta Divina)',
            description: 'La famosa "Garganta Divina" entre Asturias y León. Una de las rutas más espectaculares de España.',
            difficulty: 'Easy',
            distance: '22km',
            elevation_gain: 200,
            duration: '6-7 hours',
            rating: 4.9,
            reviews: 456,
            wikiloc_url: 'https://es.wikiloc.com/rutas-senderismo/picos-de-europa-ruta-del-cares-garganta-divina-789012',
            coordinates: [
              [-4.750000, 43.200000], // Poncebos
              [-4.745000, 43.205000], // Garganta Divina
              [-4.740000, 43.210000], // Caín
              [-4.735000, 43.215000], // Regreso
              [-4.750000, 43.200000]  // Vuelta a Poncebos
            ],
            waypoints: [
              { lat: 43.200000, lng: -4.750000, name: 'Poncebos', type: 'Trailhead', elevation: 250 },
              { lat: 43.205000, lng: -4.745000, name: 'Garganta Divina', type: 'Viewpoint', elevation: 300 },
              { lat: 43.210000, lng: -4.740000, name: 'Caín', type: 'Village', elevation: 400 }
            ],
            terrain: 'Mountain',
            image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=250&fit=crop',
            created_by: 'Wikiloc Community',
            created_at: '2024-01-10',
            tags: ['picos-europa', 'cares', 'asturias', 'leon', 'garganta-divina']
          },
          {
            id: 'wikiloc_3',
            name: 'Sierra Nevada - Mulhacén desde Hoya de la Mora',
            description: 'Subida al techo de la Península Ibérica. Ruta exigente pero con vistas espectaculares al Mediterráneo.',
            difficulty: 'Hard',
            distance: '18km',
            elevation_gain: 1200,
            duration: '8-10 hours',
            rating: 4.8,
            reviews: 189,
            wikiloc_url: 'https://es.wikiloc.com/rutas-senderismo/sierra-nevada-mulhacen-desde-hoya-de-la-mora-345678',
            coordinates: [
              [-3.400000, 37.100000], // Hoya de la Mora
              [-3.390000, 37.110000], // Refugio Poqueira
              [-3.380000, 37.120000], // Pico Mulhacén
              [-3.370000, 37.130000], // Descenso
              [-3.400000, 37.100000]  // Vuelta al inicio
            ],
            waypoints: [
              { lat: 37.100000, lng: -3.400000, name: 'Hoya de la Mora', type: 'Trailhead', elevation: 2500 },
              { lat: 37.110000, lng: -3.390000, name: 'Refugio Poqueira', type: 'Shelter', elevation: 2800 },
              { lat: 37.120000, lng: -3.380000, name: 'Pico Mulhacén', type: 'Summit', elevation: 3479 }
            ],
            terrain: 'Mountain',
            image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
            created_by: 'Wikiloc Community',
            created_at: '2024-01-05',
            tags: ['sierra-nevada', 'mulhacen', 'granada', 'techo-iberia', 'alta-montaña']
          }
        ],
        'France': [
          {
            id: 'wikiloc_4',
            name: 'Mont Blanc - Tour du Mont Blanc (TMB)',
            description: 'La ruta circular más famosa de los Alpes. 170km alrededor del Mont Blanc.',
            difficulty: 'Hard',
            distance: '170km',
            elevation_gain: 10000,
            duration: '10-12 days',
            rating: 4.9,
            reviews: 567,
            wikiloc_url: 'https://es.wikiloc.com/rutas-senderismo/mont-blanc-tour-du-mont-blanc-tmb-901234',
            coordinates: [
              [6.870000, 45.920000], // Chamonix
              [6.850000, 45.940000], // Les Houches
              [6.830000, 45.960000], // Les Contamines
              [6.810000, 45.980000], // Col de la Seigne
              [6.870000, 45.920000]  // Vuelta a Chamonix
            ],
            waypoints: [
              { lat: 45.920000, lng: 6.870000, name: 'Chamonix', type: 'Trailhead', elevation: 1035 },
              { lat: 45.940000, lng: 6.850000, name: 'Les Houches', type: 'Village', elevation: 1007 },
              { lat: 45.960000, lng: 6.830000, name: 'Les Contamines', type: 'Village', elevation: 1164 },
              { lat: 45.980000, lng: 6.810000, name: 'Col de la Seigne', type: 'Pass', elevation: 2516 }
            ],
            terrain: 'Mountain',
            image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
            created_by: 'Wikiloc Community',
            created_at: '2024-01-12',
            tags: ['mont-blanc', 'alpes', 'tmb', 'chamonix', 'alta-montaña']
          }
        ],
        'Italy': [
          {
            id: 'wikiloc_5',
            name: 'Dolomitas - Tre Cime di Lavaredo',
            description: 'Las tres cimas más famosas de los Dolomitas. Ruta circular con vistas espectaculares.',
            difficulty: 'Medium',
            distance: '10km',
            elevation_gain: 600,
            duration: '4-5 hours',
            rating: 4.8,
            reviews: 345,
            wikiloc_url: 'https://es.wikiloc.com/rutas-senderismo/dolomitas-tre-cime-di-lavaredo-567890',
            coordinates: [
              [12.300000, 46.600000], // Rifugio Auronzo
              [12.310000, 46.610000], // Lago di Misurina
              [12.320000, 46.620000], // Tre Cime
              [12.330000, 46.630000], // Rifugio Lavaredo
              [12.300000, 46.600000]  // Vuelta al inicio
            ],
            waypoints: [
              { lat: 46.600000, lng: 12.300000, name: 'Rifugio Auronzo', type: 'Trailhead', elevation: 2320 },
              { lat: 46.610000, lng: 12.310000, name: 'Lago di Misurina', type: 'Lake', elevation: 1754 },
              { lat: 46.620000, lng: 12.320000, name: 'Tre Cime', type: 'Summit', elevation: 2999 }
            ],
            terrain: 'Mountain',
            image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
            created_by: 'Wikiloc Community',
            created_at: '2024-01-08',
            tags: ['dolomitas', 'tre-cime', 'italia', 'alta-montaña', 'dolomitas']
          }
        ]
      };

      return {
        success: true,
        routes: mockWikilocRoutes[country] || [],
        total: mockWikilocRoutes[country]?.length || 0,
        source: 'wikiloc'
      };
    } catch (error) {
      console.error('Error fetching Wikiloc routes:', error);
      return {
        success: false,
        routes: [],
        total: 0,
        error: error.message
      };
    }
  },

  // Search routes by keyword
  searchRoutes: async (query, country = 'Spain', filters = {}) => {
    try {
      const allRoutes = await wikilocService.getPopularRoutes(country);
      
      if (!allRoutes.success) {
        return allRoutes;
      }

      let filteredRoutes = allRoutes.routes;

      // Filter by search query
      if (query) {
        filteredRoutes = filteredRoutes.filter(route =>
          route.name.toLowerCase().includes(query.toLowerCase()) ||
          route.description.toLowerCase().includes(query.toLowerCase()) ||
          route.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
      }

      // Filter by difficulty
      if (filters.difficulty && filters.difficulty !== 'All') {
        filteredRoutes = filteredRoutes.filter(route => route.difficulty === filters.difficulty);
      }

      // Filter by terrain
      if (filters.terrain && filters.terrain !== 'All') {
        filteredRoutes = filteredRoutes.filter(route => route.terrain === filters.terrain);
      }

      // Filter by distance range
      if (filters.maxDistance) {
        filteredRoutes = filteredRoutes.filter(route => {
          const distance = parseFloat(route.distance);
          return distance <= parseFloat(filters.maxDistance);
        });
      }

      return {
        success: true,
        routes: filteredRoutes,
        total: filteredRoutes.length,
        source: 'wikiloc'
      };
    } catch (error) {
      console.error('Error searching Wikiloc routes:', error);
      return {
        success: false,
        routes: [],
        total: 0,
        error: error.message
      };
    }
  },

  // Get route details by ID
  getRouteDetails: async (routeId) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, you would fetch from Wikiloc API
      // For now, return mock data
      const mockRoute = {
        id: routeId,
        name: 'Sierra de Guadarrama - Peñalara',
        description: 'Ruta detallada con información completa...',
        difficulty: 'Medium',
        distance: '12.5km',
        elevation_gain: 850,
        duration: '4-5 hours',
        rating: 4.7,
        reviews: 234,
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
        terrain: 'Mountain',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
        created_by: 'Wikiloc Community',
        created_at: '2024-01-15',
        tags: ['montaña', 'guadarrama', 'penalara', 'madrid', 'senderismo'],
        wikiloc_url: 'https://es.wikiloc.com/rutas-senderismo/sierra-de-guadarrama-penalara-desde-puerto-de-cotos-123456'
      };

      return {
        success: true,
        route: mockRoute
      };
    } catch (error) {
      console.error('Error fetching route details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default wikilocService;
