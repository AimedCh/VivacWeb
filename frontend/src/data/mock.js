// Mock data for VivacWeb outdoor recreation platform

export const mockRoutes = [
    {
      id: '1',
      name: 'Scenic Mountain Trail',
      coordinates: [
        [-73.985, 40.758],
        [-73.987, 40.759],
        [-73.989, 40.761],
        [-73.991, 40.763],
        [-73.993, 40.765]
      ],
      waypoints: [
        { lat: 40.758, lng: -73.985, name: 'Start Point', type: 'start' },
        { lat: 40.761, lng: -73.989, name: 'Vista Point', type: 'viewpoint' },
        { lat: 40.765, lng: -73.993, name: 'End Point', type: 'end' }
      ],
      difficulty: 'Easy',
      distance: '10km',
      terrain: 'Mountain/Slope',
      duration: '2.5 hours'
    }
  ];
  
  export const mockTrails = [
    {
      id: '1',
      name: 'Evening Peak Trail',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      time: '11am',
      distance: '11.0km',
      description: 'Sunset views',
      rating: 4.3,
      reviews: 52,
      difficulty: 'Easy',
      terrain: 'Mountain'
    },
    {
      id: '2', 
      name: 'Whispering Woods',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop',
      time: '1.5hrs',
      distance: '7.5km',
      description: 'Forest trail',
      rating: 4.7,
      reviews: 24,
      difficulty: 'Medium',
      terrain: 'Forest/Flat'
    },
    {
      id: '3',
      name: 'Riverside Adventure',
      image: 'https://images.unsplash.com/photo-1464822759844-d150baec47db?w=400&h=250&fit=crop',
      time: '3hrs',
      distance: '15.2km',
      description: 'Along the river',
      rating: 4.5,
      reviews: 38,
      difficulty: 'Hard',
      terrain: 'River/Slope'
    }
  ];
  
  export const mockFilters = {
    difficulty: ['Easy', 'Medium', 'Hard'],
    distance: ['5km', '10km', '15km', '20km+'],
    terrain: ['Mountain/Slope', 'Forest/Flat', 'River/Slope', 'Desert/Flat'],
    features: ['Sleeping Bag Friendly', 'Water Source', 'Viewpoints', 'Camping']
  };
  
  export const mockUser = {
    name: 'Laura G',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c4a2?w=100&h=100&fit=crop&crop=face',
    role: 'Community Guide',
    description: 'Expert hiker & Guides',
    totalRoutes: 42,
    totalDistance: '1,250km'
  };
  
  export const mockWeather = {
    temperature: '18°C',
    condition: 'Sunny',
    forecast: '23 mins clear'
  };