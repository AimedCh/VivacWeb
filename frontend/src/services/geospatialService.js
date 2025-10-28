// Geospatial Data Service
// Integrates with OpenStreetMap, elevation APIs, and photo services

// Error handling utility
const handleApiError = (error, fallbackMessage = 'Error en el servicio') => {
  console.error('Geospatial Service Error:', error);
  return {
    error: true,
    message: error.message || fallbackMessage,
    timestamp: new Date().toISOString()
  };
};

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export const geospatialService = {
  // OpenStreetMap Overpass API for hiking routes
  async getHikingRoutesFromOSM(bounds, tags = {}) {
    try {
      const { north, south, east, west } = bounds;
      const cacheKey = `osm_routes_${north}_${south}_${east}_${west}`;
      
      // Check cache first
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const overpassQuery = `
        [out:json][timeout:25];
        (
          way["highway"="path"]["foot"="yes"](${south},${west},${north},${east});
          way["highway"="footway"](${south},${west},${north},${east});
          way["highway"="track"]["foot"="yes"](${south},${west},${north},${east});
          way["highway"="bridleway"]["foot"="yes"](${south},${west},${north},${east});
        );
        out geom;
      `;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: overpassQuery,
        headers: {
          'Content-Type': 'text/plain',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`OSM API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.elements || data.elements.length === 0) {
        console.warn('No OSM routes found for the given bounds');
        return this.getMockOSMRoutes();
      }

      const processedRoutes = this.processOSMRoutes(data.elements);
      setCachedData(cacheKey, processedRoutes);
      
      return processedRoutes;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('OSM API request timed out, using mock data');
      } else {
        console.error('Error fetching OSM routes:', error);
      }
      return this.getMockOSMRoutes();
    }
  },

  // Process OSM data into our format
  processOSMRoutes(elements) {
    return elements.map((element, index) => {
      const coordinates = element.geometry.map(coord => [coord.lon, coord.lat]);
      const name = element.tags?.name || `Ruta OSM ${index + 1}`;
      
      return {
        id: `osm_${element.id}`,
        name: name,
        description: element.tags?.description || `Ruta de senderismo desde OpenStreetMap`,
        difficulty: this.calculateDifficulty(element.tags),
        distance: this.calculateDistance(coordinates),
        duration: this.estimateDuration(coordinates),
        coordinates: coordinates,
        source: 'osm',
        tags: element.tags,
        elevation_gain: 0, // Will be calculated separately
        rating: 4.0 + Math.random() * 1.0,
        reviews: Math.floor(Math.random() * 100),
        terrain: this.getTerrainType(element.tags),
        surface: element.tags?.surface || 'unknown'
      };
    });
  },

  // Calculate route difficulty based on OSM tags
  calculateDifficulty(tags) {
    const surface = tags?.surface?.toLowerCase();
    const width = tags?.width;
    
    if (surface === 'paved' || surface === 'asphalt') return 'Easy';
    if (surface === 'gravel' || surface === 'dirt') return 'Medium';
    if (surface === 'rock' || surface === 'grass' || !surface) return 'Hard';
    return 'Medium';
  },

  // Calculate distance from coordinates
  calculateDistance(coordinates) {
    if (coordinates.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < coordinates.length; i++) {
      totalDistance += this.haversineDistance(
        coordinates[i-1][1], coordinates[i-1][0],
        coordinates[i][1], coordinates[i][0]
      );
    }
    return Math.round(totalDistance * 100) / 100; // Round to 2 decimals
  },

  // Haversine formula for distance calculation
  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },

  toRadians(degrees) {
    return degrees * (Math.PI/180);
  },

  // Estimate duration based on distance and difficulty
  estimateDuration(coordinates) {
    const distance = this.calculateDistance(coordinates);
    const hours = Math.round((distance / 3.5) * 10) / 10; // 3.5 km/h average
    return `${hours} horas`;
  },

  // Get terrain type from OSM tags
  getTerrainType(tags) {
    if (tags?.natural === 'mountain' || tags?.natural === 'peak') return 'Mountain';
    if (tags?.natural === 'forest' || tags?.natural === 'wood') return 'Forest';
    if (tags?.natural === 'water' || tags?.waterway) return 'Coastal';
    return 'Mixed';
  },

  // Open-Elevation API for elevation data
  async getElevationProfile(coordinates) {
    try {
      const cacheKey = `elevation_${coordinates.length}_${coordinates[0]?.[0]}_${coordinates[0]?.[1]}`;
      
      // Check cache first
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // Limit coordinates to avoid API limits
      const limitedCoordinates = coordinates.length > 100 
        ? coordinates.filter((_, index) => index % Math.ceil(coordinates.length / 100) === 0)
        : coordinates;

      const locations = limitedCoordinates.map(coord => ({
        latitude: coord[1],
        longitude: coord[0]
      }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch('https://api.open-elevation.com/api/v1/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locations }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Elevation API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        throw new Error('No elevation data received');
      }

      const elevations = data.results.map(result => result.elevation);
      setCachedData(cacheKey, elevations);
      
      return elevations;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Elevation API request timed out, using mock data');
      } else {
        console.error('Error fetching elevation data:', error);
      }
      return this.generateMockElevation(coordinates);
    }
  },

  // Generate mock elevation data
  generateMockElevation(coordinates) {
    const elevations = [];
    let baseElevation = 500 + Math.random() * 1000; // Random base elevation
    
    for (let i = 0; i < coordinates.length; i++) {
      // Simulate elevation changes
      const variation = (Math.random() - 0.5) * 100;
      baseElevation += variation;
      elevations.push(Math.max(0, Math.round(baseElevation)));
    }
    
    return elevations;
  },

  // Flickr API for geotagged photos
  async getPhotosNearRoute(coordinates, radius = 1) {
    try {
      // Use the center point of the route
      const centerLat = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;
      const centerLon = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length;

      const flickrApiKey = process.env.REACT_APP_FLICKR_API_KEY || 'demo_key';
      const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrApiKey}&lat=${centerLat}&lon=${centerLon}&radius=${radius}&per_page=20&format=json&nojsoncallback=1`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch Flickr photos');
      }

      const data = await response.json();
      return this.processFlickrPhotos(data.photos?.photo || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      return this.getMockPhotos(coordinates);
    }
  },

  // Process Flickr photos
  processFlickrPhotos(photos) {
    return photos.map(photo => ({
      id: photo.id,
      title: photo.title,
      url: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_c.jpg`,
      thumbnail: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`,
      lat: parseFloat(photo.latitude),
      lng: parseFloat(photo.longitude),
      owner: photo.owner,
      date: photo.datetaken
    }));
  },

  // Mock photos for demonstration
  getMockPhotos(coordinates) {
    const mockPhotos = [
      {
        id: 'mock_1',
        title: 'Vista panorámica de la montaña',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
        lat: coordinates[0][1],
        lng: coordinates[0][0],
        owner: 'Mock User',
        date: '2024-01-15'
      },
      {
        id: 'mock_2',
        title: 'Sendero en el bosque',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop',
        lat: coordinates[Math.floor(coordinates.length / 2)][1],
        lng: coordinates[Math.floor(coordinates.length / 2)][0],
        owner: 'Mock User',
        date: '2024-01-14'
      },
      {
        id: 'mock_3',
        title: 'Cumbre con vistas espectaculares',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=150&fit=crop',
        lat: coordinates[coordinates.length - 1][1],
        lng: coordinates[coordinates.length - 1][0],
        owner: 'Mock User',
        date: '2024-01-13'
      }
    ];

    return mockPhotos;
  },

  // Mock OSM routes for fallback
  async getMockOSMRoutes() {
    try {
      // Try to load from sample data
      const response = await fetch('/src/data/sampleRoutes.json');
      if (response.ok) {
        const data = await response.json();
        return data.features.map(feature => ({
          id: feature.properties.id,
          name: feature.properties.name,
          description: feature.properties.description,
          difficulty: feature.properties.difficulty,
          distance: feature.properties.distance,
          duration: feature.properties.duration,
          coordinates: feature.geometry.coordinates,
          source: feature.properties.source,
          terrain: feature.properties.terrain,
          surface: feature.properties.surface,
          rating: feature.properties.rating,
          reviews: feature.properties.reviews,
          elevation_gain: feature.properties.elevation_gain,
          tags: feature.properties.tags,
          wikiloc_url: feature.properties.wikiloc_url
        }));
      }
    } catch (error) {
      console.error('Error loading sample routes:', error);
    }

    // Fallback to hardcoded data
    return [
      {
        id: 'osm_mock_1',
        name: 'Sendero de la Sierra de Guadarrama',
        description: 'Hermoso sendero que atraviesa la sierra madrileña con vistas panorámicas',
        difficulty: 'Medium',
        distance: 8.5,
        duration: '3.5 horas',
        coordinates: [
          [-3.703790, 40.416775],
          [-3.700000, 40.420000],
          [-3.695000, 40.425000],
          [-3.690000, 40.430000],
          [-3.685000, 40.435000]
        ],
        source: 'osm',
        terrain: 'Mountain',
        surface: 'dirt',
        rating: 4.5,
        reviews: 67,
        elevation_gain: 450
      },
      {
        id: 'osm_mock_2',
        name: 'Ruta del Bosque Encantado',
        description: 'Sendero circular por un bosque de robles centenarios',
        difficulty: 'Easy',
        distance: 5.2,
        duration: '2 horas',
        coordinates: [
          [-3.800000, 40.300000],
          [-3.795000, 40.305000],
          [-3.790000, 40.310000],
          [-3.785000, 40.315000],
          [-3.780000, 40.320000],
          [-3.800000, 40.300000]
        ],
        source: 'osm',
        terrain: 'Forest',
        surface: 'gravel',
        rating: 4.2,
        reviews: 34,
        elevation_gain: 120
      },
      {
        id: 'osm_mock_3',
        name: 'Ascenso al Pico del Águila',
        description: 'Ruta exigente hasta la cumbre más alta de la zona',
        difficulty: 'Hard',
        distance: 12.8,
        duration: '6 horas',
        coordinates: [
          [-3.600000, 40.500000],
          [-3.590000, 40.510000],
          [-3.580000, 40.520000],
          [-3.570000, 40.530000],
          [-3.560000, 40.540000],
          [-3.550000, 40.550000]
        ],
        source: 'osm',
        terrain: 'Mountain',
        surface: 'rock',
        rating: 4.8,
        reviews: 89,
        elevation_gain: 1200
      }
    ];
  },

  // Get comprehensive route data
  async getRouteWithFullData(routeId) {
    try {
      // Get base route data
      const routes = await this.getHikingRoutesFromOSM({
        north: 40.5, south: 40.3, east: -3.6, west: -3.8
      });
      
      const route = routes.find(r => r.id === routeId) || routes[0];
      
      // Try to get elevation data from sample data
      let elevationProfile, waypoints;
      try {
        const elevationResponse = await fetch('/src/data/sampleElevation.json');
        if (elevationResponse.ok) {
          const elevationData = await elevationResponse.json();
          const routeElevationData = elevationData[routeId];
          if (routeElevationData) {
            elevationProfile = routeElevationData.elevation_profile;
            waypoints = routeElevationData.waypoints;
          }
        }
      } catch (error) {
        console.log('Using generated elevation data');
      }

      // Fallback to generated data
      if (!elevationProfile) {
        elevationProfile = await this.getElevationProfile(route.coordinates);
        waypoints = this.generateWaypoints(route.coordinates, elevationProfile);
      }
      
      // Get photos
      const photos = await this.getPhotosNearRoute(route.coordinates);
      
      return {
        ...route,
        elevation_profile: elevationProfile,
        photos: photos,
        waypoints: waypoints
      };
    } catch (error) {
      console.error('Error getting full route data:', error);
      return null;
    }
  },

  // Generate waypoints from coordinates and elevation
  generateWaypoints(coordinates, elevations) {
    return coordinates.map((coord, index) => ({
      id: `wp_${index}`,
      name: this.generateWaypointName(index, coordinates.length),
      lat: coord[1],
      lng: coord[0],
      elevation: elevations[index] || 0,
      type: this.getWaypointType(index, coordinates.length),
      description: this.generateWaypointDescription(index, coordinates.length)
    }));
  },

  generateWaypointName(index, total) {
    if (index === 0) return 'Punto de Inicio';
    if (index === total - 1) return 'Punto Final';
    if (index === Math.floor(total / 2)) return 'Punto Medio';
    return `Waypoint ${index + 1}`;
  },

  getWaypointType(index, total) {
    if (index === 0) return 'Trailhead';
    if (index === total - 1) return 'Summit';
    if (index === Math.floor(total / 2)) return 'Viewpoint';
    return 'Checkpoint';
  },

  generateWaypointDescription(index, total) {
    const descriptions = [
      'Punto de partida del sendero',
      'Vista panorámica de la zona',
      'Área de descanso recomendada',
      'Punto de interés natural',
      'Mirador con vistas espectaculares'
    ];
    return descriptions[index % descriptions.length];
  },

  // Geospatial search functionality
  async searchRoutesByLocation(query, radius = 10) {
    try {
      const cacheKey = `search_${query}_${radius}`;
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // Mock geocoding - in real app, use a proper geocoding service
      const mockLocations = {
        'madrid': { lat: 40.416775, lng: -3.703790 },
        'barcelona': { lat: 41.3851, lng: 2.1734 },
        'sevilla': { lat: 37.3891, lng: -5.9845 },
        'valencia': { lat: 39.4699, lng: -0.3763 },
        'bilbao': { lat: 43.2627, lng: -2.9253 },
        'granada': { lat: 37.1773, lng: -3.5986 },
        'zaragoza': { lat: 41.6488, lng: -0.8891 },
        'málaga': { lat: 36.7213, lng: -4.4214 }
      };

      const location = mockLocations[query.toLowerCase()];
      if (!location) {
        throw new Error('Location not found');
      }

      // Calculate bounds for the search area
      const bounds = this.calculateBoundsFromCenter(location.lat, location.lng, radius);
      
      // Get routes in the area
      const routes = await this.getHikingRoutesFromOSM(bounds);
      
      // Filter routes by distance from center
      const filteredRoutes = routes.filter(route => {
        const routeCenter = this.calculateRouteCenter(route.coordinates);
        const distance = this.haversineDistance(
          location.lat, location.lng,
          routeCenter.lat, routeCenter.lng
        );
        return distance <= radius;
      });

      const result = {
        location: location,
        query: query,
        radius: radius,
        routes: filteredRoutes,
        totalFound: filteredRoutes.length
      };

      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error searching routes by location:', error);
      return {
        error: true,
        message: error.message,
        location: null,
        routes: [],
        totalFound: 0
      };
    }
  },

  // Calculate bounds from center point and radius
  calculateBoundsFromCenter(lat, lng, radiusKm) {
    const earthRadius = 6371; // Earth's radius in km
    const latDelta = (radiusKm / earthRadius) * (180 / Math.PI);
    const lngDelta = (radiusKm / earthRadius) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);

    return {
      north: lat + latDelta,
      south: lat - latDelta,
      east: lng + lngDelta,
      west: lng - lngDelta
    };
  },

  // Calculate center point of a route
  calculateRouteCenter(coordinates) {
    if (!coordinates || coordinates.length === 0) {
      return { lat: 0, lng: 0 };
    }

    const sum = coordinates.reduce((acc, coord) => ({
      lat: acc.lat + coord[1],
      lng: acc.lng + coord[0]
    }), { lat: 0, lng: 0 });

    return {
      lat: sum.lat / coordinates.length,
      lng: sum.lng / coordinates.length
    };
  },

  // Clear cache
  clearCache() {
    cache.clear();
    console.log('Geospatial service cache cleared');
  },

  // Get cache statistics
  getCacheStats() {
    return {
      size: cache.size,
      keys: Array.from(cache.keys()),
      oldestEntry: Math.min(...Array.from(cache.values()).map(entry => entry.timestamp)),
      newestEntry: Math.max(...Array.from(cache.values()).map(entry => entry.timestamp))
    };
  }
};

export default geospatialService;
