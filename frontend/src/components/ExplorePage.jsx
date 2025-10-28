import React, { useState, useEffect } from 'react';
import { Globe, Search, MapPin, TrendingUp, Map as MapIcon, Navigation, Mountain, Clock, Star } from 'lucide-react';
import { geospatialService } from '../services/geospatialService';

const ExplorePage = ({ onCountrySelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapRotation, setMapRotation] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryRoutes, setCountryRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  // Animate map rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setMapRotation(prev => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const countries = [
    { name: 'Spain', flag: '🇪🇸', flagBg: 'linear-gradient(135deg, #C60B1E 0%, #FFC400 50%, #C60B1E 100%)', trails: 1234, popular: true },
    { name: 'France', flag: '🇫🇷', flagBg: 'linear-gradient(90deg, #002395 0%, #FFFFFF 50%, #ED2939 100%)', trails: 2156, popular: true },
    { name: 'Italy', flag: '🇮🇹', flagBg: 'linear-gradient(90deg, #009246 0%, #FFFFFF 50%, #CE2B37 100%)', trails: 1876, popular: true },
    { name: 'Germany', flag: '🇩🇪', flagBg: 'linear-gradient(90deg, #000000 0%, #DD0000 50%, #FFCE00 100%)', trails: 1543, popular: false },
    { name: 'Ireland', flag: '🇮🇪', flagBg: 'linear-gradient(90deg, #169B62 0%, #FFFFFF 50%, #FF883E 100%)', trails: 876, popular: false },
    { name: 'Norway', flag: '🇳🇴', flagBg: 'linear-gradient(135deg, #EF2B2D 0%, #FFFFFF 25%, #002868 50%, #FFFFFF 75%, #EF2B2D 100%)', trails: 1987, popular: true },
    { name: 'Iceland', flag: '🇮🇸', flagBg: 'linear-gradient(135deg, #02529C 0%, #FFFFFF 25%, #DC143C 50%, #FFFFFF 75%, #02529C 100%)', trails: 654, popular: true },
    { name: 'Morocco', flag: '🇲🇦', flagBg: 'linear-gradient(135deg, #C1272D 0%, #006233 100%)', trails: 432, popular: false },
    { name: 'United States', flag: '🇺🇸', flagBg: 'linear-gradient(135deg, #B22234 0%, #FFFFFF 10%, #3C3B6E 20%, #FFFFFF 30%, #B22234 40%, #FFFFFF 50%, #3C3B6E 60%, #FFFFFF 70%, #B22234 80%, #FFFFFF 90%, #3C3B6E 100%)', trails: 5432, popular: true },
    { name: 'Chile', flag: '🇨🇱', flagBg: 'linear-gradient(90deg, #0033A0 0%, #FFFFFF 50%, #D52B1E 100%)', trails: 987, popular: true },
    { name: 'Peru', flag: '🇵🇪', flagBg: 'linear-gradient(90deg, #D91023 0%, #FFFFFF 50%, #D91023 100%)', trails: 1234, popular: true },
    { name: 'Turkey', flag: '🇹🇷', flagBg: 'linear-gradient(135deg, #E30A17 0%, #FFFFFF 50%, #E30A17 100%)', trails: 765, popular: false },
    { name: 'Nepal', flag: '🇳🇵', flagBg: 'linear-gradient(135deg, #DC143C 0%, #0000FF 50%, #FFFFFF 100%)', trails: 2345, popular: true },
    { name: 'Vietnam', flag: '🇻🇳', flagBg: 'linear-gradient(90deg, #DA020E 0%, #FFCD00 100%)', trails: 543, popular: false },
    { name: 'Philippines', flag: '🇵🇭', flagBg: 'linear-gradient(90deg, #0038A8 0%, #CE1126 50%, #FFFFFF 100%)', trails: 876, popular: false },
    { name: 'Japan', flag: '🇯🇵', flagBg: 'radial-gradient(circle, #BC002D 0%, #FFFFFF 100%)', trails: 1654, popular: true },
    { name: 'Australia', flag: '🇦🇺', flagBg: 'linear-gradient(135deg, #012169 0%, #FFFFFF 25%, #E4002B 50%, #FFFFFF 75%, #012169 100%)', trails: 2876, popular: true },
    { name: 'New Zealand', flag: '🇳🇿', flagBg: 'linear-gradient(135deg, #012169 0%, #FFFFFF 25%, #E4002B 50%, #FFFFFF 75%, #012169 100%)', trails: 1432, popular: true },
    { name: 'Switzerland', flag: '🇨🇭', flagBg: 'linear-gradient(135deg, #FF0000 0%, #FFFFFF 50%, #FF0000 100%)', trails: 1876, popular: true },
    { name: 'Austria', flag: '🇦🇹', flagBg: 'linear-gradient(90deg, #ED2939 0%, #FFFFFF 50%, #ED2939 100%)', trails: 1234, popular: false },
    { name: 'Poland', flag: '🇵🇱', flagBg: 'linear-gradient(90deg, #FFFFFF 0%, #DC143C 100%)', trails: 654, popular: false },
    { name: 'Czech Republic', flag: '🇨🇿', flagBg: 'linear-gradient(90deg, #FFFFFF 0%, #D7141A 50%, #11457E 100%)', trails: 543, popular: false },
    { name: 'Slovakia', flag: '🇸🇰', flagBg: 'linear-gradient(90deg, #FFFFFF 0%, #0B4EA2 50%, #EE1C25 100%)', trails: 432, popular: false },
    { name: 'Slovenia', flag: '🇸🇮', flagBg: 'linear-gradient(90deg, #FFFFFF 0%, #0B4EA2 50%, #EE1C25 100%)', trails: 567, popular: false },
    { name: 'Croatia', flag: '🇭🇷', flagBg: 'linear-gradient(90deg, #FF0000 0%, #FFFFFF 25%, #0000FF 50%, #FFFFFF 75%, #FF0000 100%)', trails: 678, popular: false },
    { name: 'Greece', flag: '🇬🇷', flagBg: 'linear-gradient(90deg, #0D5EAF 0%, #FFFFFF 25%, #0D5EAF 50%, #FFFFFF 75%, #0D5EAF 100%)', trails: 876, popular: false },
    { name: 'Portugal', flag: '🇵🇹', flagBg: 'linear-gradient(90deg, #046A38 0%, #FF0000 50%, #FFD700 100%)', trails: 765, popular: false },
    { name: 'United Kingdom', flag: '🇬🇧', flagBg: 'linear-gradient(135deg, #012169 0%, #FFFFFF 25%, #C8102E 50%, #FFFFFF 75%, #012169 100%)', trails: 1987, popular: true },
    { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', flagBg: 'linear-gradient(135deg, #0065BD 0%, #FFFFFF 50%, #0065BD 100%)', trails: 876, popular: false },
    { name: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', flagBg: 'linear-gradient(135deg, #D21034 0%, #FFFFFF 50%, #D21034 100%)', trails: 543, popular: false },
    { name: 'Sweden', flag: '🇸🇪', flagBg: 'linear-gradient(90deg, #006AA7 0%, #FECC00 100%)', trails: 1234, popular: false },
    { name: 'Finland', flag: '🇫🇮', flagBg: 'linear-gradient(90deg, #FFFFFF 0%, #003580 50%, #FFFFFF 100%)', trails: 987, popular: false },
    { name: 'Denmark', flag: '🇩🇰', flagBg: 'linear-gradient(90deg, #C60C30 0%, #FFFFFF 25%, #C60C30 50%, #FFFFFF 75%, #C60C30 100%)', trails: 432, popular: false },
    { name: 'Netherlands', flag: '🇳🇱', flagBg: 'linear-gradient(90deg, #AE1C28 0%, #FFFFFF 50%, #21468B 100%)', trails: 654, popular: false },
    { name: 'Belgium', flag: '🇧🇪', flagBg: 'linear-gradient(90deg, #000000 0%, #FAE042 50%, #ED2939 100%)', trails: 456, popular: false },
    { name: 'Luxembourg', flag: '🇱🇺', flagBg: 'linear-gradient(90deg, #00A1DE 0%, #FFFFFF 50%, #ED2939 100%)', trails: 234, popular: false },
    { name: 'Canada', flag: '🇨🇦', flagBg: 'linear-gradient(90deg, #FF0000 0%, #FFFFFF 25%, #FF0000 50%, #FFFFFF 75%, #FF0000 100%)', trails: 3456, popular: true },
    { name: 'Mexico', flag: '🇲🇽', flagBg: 'linear-gradient(90deg, #006847 0%, #FFFFFF 50%, #CE1126 100%)', trails: 1876, popular: true },
    { name: 'Argentina', flag: '🇦🇷', flagBg: 'linear-gradient(90deg, #74ACDF 0%, #FFFFFF 50%, #74ACDF 100%)', trails: 1543, popular: true },
    { name: 'Brazil', flag: '🇧🇷', flagBg: 'linear-gradient(135deg, #009639 0%, #FEDD00 50%, #012169 100%)', trails: 2345, popular: true },
    { name: 'Colombia', flag: '🇨🇴', flagBg: 'linear-gradient(90deg, #FCD116 0%, #003893 50%, #CE1126 100%)', trails: 987, popular: false },
    { name: 'Ecuador', flag: '🇪🇨', flagBg: 'linear-gradient(90deg, #FFD100 0%, #0033A0 50%, #CE1126 100%)', trails: 765, popular: false },
    { name: 'Bolivia', flag: '🇧🇴', flagBg: 'linear-gradient(90deg, #D52B1E 0%, #FCD116 50%, #007934 100%)', trails: 654, popular: false },
    { name: 'Venezuela', flag: '🇻🇪', flagBg: 'linear-gradient(90deg, #FCD116 0%, #003893 50%, #CE1126 100%)', trails: 543, popular: false },
    { name: 'Costa Rica', flag: '🇨🇷', flagBg: 'linear-gradient(90deg, #002868 0%, #FFFFFF 25%, #002868 50%, #FFFFFF 75%, #002868 100%)', trails: 876, popular: false },
    { name: 'Panama', flag: '🇵🇦', flagBg: 'linear-gradient(90deg, #0052CC 0%, #FFFFFF 25%, #0052CC 50%, #FFFFFF 75%, #0052CC 100%)', trails: 432, popular: false },
    { name: 'South Africa', flag: '🇿🇦', flagBg: 'linear-gradient(90deg, #000000 0%, #FFB81C 25%, #FFFFFF 50%, #007A4D 75%, #000000 100%)', trails: 1234, popular: true },
    { name: 'Kenya', flag: '🇰🇪', flagBg: 'linear-gradient(90deg, #000000 0%, #FFFFFF 25%, #000000 50%, #FFFFFF 75%, #000000 100%)', trails: 876, popular: false },
    { name: 'Tanzania', flag: '🇹🇿', flagBg: 'linear-gradient(135deg, #1EB53A 0%, #FCD116 50%, #1EB53A 100%)', trails: 765, popular: false },
    { name: 'Uganda', flag: '🇺🇬', flagBg: 'linear-gradient(90deg, #000000 0%, #FCD116 25%, #000000 50%, #FCD116 75%, #000000 100%)', trails: 543, popular: false },
    { name: 'Ethiopia', flag: '🇪🇹', flagBg: 'linear-gradient(90deg, #078930 0%, #FCD116 25%, #DA1219 50%, #FCD116 75%, #078930 100%)', trails: 654, popular: false },
    { name: 'Madagascar', flag: '🇲🇬', flagBg: 'linear-gradient(90deg, #FFFFFF 0%, #FC3D32 50%, #007E3A 100%)', trails: 432, popular: false },
    { name: 'Namibia', flag: '🇳🇦', flagBg: 'linear-gradient(135deg, #FF0000 0%, #FFFFFF 25%, #0033A0 50%, #FFFFFF 75%, #FF0000 100%)', trails: 567, popular: false },
    { name: 'Botswana', flag: '🇧🇼', flagBg: 'linear-gradient(90deg, #000000 0%, #FFFFFF 25%, #000000 50%, #FFFFFF 75%, #000000 100%)', trails: 345, popular: false },
    { name: 'Zimbabwe', flag: '🇿🇼', flagBg: 'linear-gradient(90deg, #FFD100 0%, #000000 25%, #FF0000 50%, #000000 75%, #FFD100 100%)', trails: 456, popular: false },
    { name: 'Zambia', flag: '🇿🇲', flagBg: 'linear-gradient(90deg, #198A00 0%, #FF0000 25%, #000000 50%, #FF0000 75%, #198A00 100%)', trails: 234, popular: false },
    { name: 'Malawi', flag: '🇲🇼', flagBg: 'linear-gradient(90deg, #000000 0%, #FF0000 25%, #000000 50%, #FF0000 75%, #000000 100%)', trails: 321, popular: false },
    { name: 'Mozambique', flag: '🇲🇿', flagBg: 'linear-gradient(90deg, #000000 0%, #FFD100 25%, #000000 50%, #FFD100 75%, #000000 100%)', trails: 234, popular: false },
    { name: 'China', flag: '🇨🇳', flagBg: 'linear-gradient(90deg, #EE1C25 0%, #FFD100 100%)', trails: 3456, popular: true },
    { name: 'India', flag: '🇮🇳', flagBg: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)', trails: 2876, popular: true },
    { name: 'Thailand', flag: '🇹🇭', flagBg: 'linear-gradient(90deg, #ED1C24 0%, #FFFFFF 25%, #ED1C24 50%, #FFFFFF 75%, #ED1C24 100%)', trails: 1234, popular: true },
    { name: 'Indonesia', flag: '🇮🇩', flagBg: 'linear-gradient(90deg, #FF0000 0%, #FFFFFF 100%)', trails: 1876, popular: true },
    { name: 'Malaysia', flag: '🇲🇾', flagBg: 'linear-gradient(90deg, #000000 0%, #FF0000 25%, #000000 50%, #FF0000 75%, #000000 100%)', trails: 987, popular: false },
    { name: 'Singapore', flag: '🇸🇬', flagBg: 'linear-gradient(90deg, #FFFFFF 0%, #ED2939 50%, #FFFFFF 100%)', trails: 234, popular: false },
    { name: 'South Korea', flag: '🇰🇷', flagBg: 'linear-gradient(90deg, #FFFFFF 0%, #000000 25%, #FFFFFF 50%, #000000 75%, #FFFFFF 100%)', trails: 1543, popular: true },
    { name: 'Taiwan', flag: '🇹🇼', flagBg: 'linear-gradient(90deg, #FE0000 0%, #FFFFFF 50%, #000095 100%)', trails: 876, popular: false },
    { name: 'Mongolia', flag: '🇲🇳', flagBg: 'linear-gradient(90deg, #C8102E 0%, #0066CC 50%, #C8102E 100%)', trails: 654, popular: false },
    { name: 'Pakistan', flag: '🇵🇰', flagBg: 'linear-gradient(90deg, #01411C 0%, #FFFFFF 100%)', trails: 1234, popular: false },
    { name: 'Sri Lanka', flag: '🇱🇰', flagBg: 'linear-gradient(90deg, #FFBE29 0%, #8D153A 50%, #FFBE29 100%)', trails: 543, popular: false },
    { name: 'Bhutan', flag: '🇧🇹', flagBg: 'linear-gradient(135deg, #FF4E12 0%, #FCDD09 50%, #FF4E12 100%)', trails: 432, popular: false },
    { name: 'Myanmar', flag: '🇲🇲', flagBg: 'linear-gradient(90deg, #FECB00 0%, #34B233 50%, #EA2839 100%)', trails: 567, popular: false },
    { name: 'Laos', flag: '🇱🇦', flagBg: 'linear-gradient(90deg, #CE1126 0%, #002868 50%, #CE1126 100%)', trails: 345, popular: false },
    { name: 'Cambodia', flag: '🇰🇭', flagBg: 'linear-gradient(90deg, #032EA1 0%, #FFFFFF 25%, #032EA1 50%, #FFFFFF 75%, #032EA1 100%)', trails: 456, popular: false },
    { name: 'Russia', flag: '🇷🇺', flagBg: 'linear-gradient(90deg, #FFFFFF 0%, #0039A6 50%, #D52B1E 100%)', trails: 4567, popular: true },
    { name: 'Ukraine', flag: '🇺🇦', flagBg: 'linear-gradient(90deg, #005BBB 0%, #FFD500 100%)', trails: 876, popular: false },
    { name: 'Romania', flag: '🇷🇴', flagBg: 'linear-gradient(90deg, #002B7F 0%, #FCD116 50%, #CE1126 100%)', trails: 765, popular: false },
    { name: 'Bulgaria', flag: '🇧🇬', flagBg: 'linear-gradient(90deg, #FFFFFF 0%, #00966E 50%, #D62612 100%)', trails: 654, popular: false },
    { name: 'Serbia', flag: '🇷🇸', flagBg: 'linear-gradient(90deg, #C6363C 0%, #0C4B99 50%, #FFFFFF 100%)', trails: 543, popular: false },
    { name: 'Bosnia', flag: '🇧🇦', flagBg: 'linear-gradient(90deg, #002395 0%, #FFFFFF 25%, #002395 50%, #FFFFFF 75%, #002395 100%)', trails: 432, popular: false },
    { name: 'Albania', flag: '🇦🇱', flagBg: 'linear-gradient(90deg, #000000 0%, #E41E13 100%)', trails: 456, popular: false },
    { name: 'North Macedonia', flag: '🇲🇰', flagBg: 'linear-gradient(90deg, #D20000 0%, #FFE600 50%, #D20000 100%)', trails: 345, popular: false },
    { name: 'Montenegro', flag: '🇲🇪', flagBg: 'linear-gradient(90deg, #C8102E 0%, #FFD100 50%, #C8102E 100%)', trails: 234, popular: false },
    { name: 'Kosovo', flag: '🇽🇰', flagBg: 'linear-gradient(90deg, #000000 0%, #FFFFFF 25%, #000000 50%, #FFFFFF 75%, #000000 100%)', trails: 123, popular: false },
  ];

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountrySelect = async (country) => {
    setSelectedCountry(country);
    setLoadingRoutes(true);
    
    try {
      // Load routes for the selected country
      const routes = await geospatialService.getMockOSMRoutes();
      setCountryRoutes(routes);
      
      // Call parent callback if provided
      if (onCountrySelect) {
        onCountrySelect(country);
      }
    } catch (error) {
      console.error('Error loading country routes:', error);
    } finally {
      setLoadingRoutes(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto relative">
      {/* Spain Map Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <svg className="w-full h-full" viewBox="0 0 800 600" style={{ transform: `rotate(${mapRotation * 0.05}deg)` }}>
          {/* Spain Map Outline */}
          <path d="M150,200 L200,180 L250,190 L300,185 L350,200 L400,210 L450,200 L500,220 L550,230 L600,240 L650,250 L700,260 L750,270 L780,280 L800,300 L780,320 L750,340 L700,350 L650,360 L600,370 L550,380 L500,390 L450,400 L400,410 L350,420 L300,430 L250,440 L200,450 L150,460 L100,470 L50,480 L0,490 L20,470 L40,450 L60,430 L80,410 L100,390 L120,370 L140,350 L160,330 L180,310 L200,290 L220,270 L240,250 L260,230 L280,210 L300,190 L320,180 L340,170 L360,160 L380,150 L400,140 L420,130 L440,120 L460,110 L480,100 L500,90 L520,80 L540,70 L560,60 L580,50 L600,40 L620,30 L640,20 L660,10 L680,0 L700,10 L720,20 L740,30 L760,40 L780,50 L800,60 L780,80 L760,100 L740,120 L720,140 L700,160 L680,180 L660,200 L640,220 L620,240 L600,260 L580,280 L560,300 L540,320 L520,340 L500,360 L480,380 L460,400 L440,420 L420,440 L400,460 L380,480 L360,500 L340,520 L320,540 L300,560 L280,580 L260,600 L240,580 L220,560 L200,540 L180,520 L160,500 L140,480 L120,460 L100,440 L80,420 L60,400 L40,380 L20,360 L0,340 L20,320 L40,300 L60,280 L80,260 L100,240 L120,220 L140,200 Z"
                fill="#10b981" 
                stroke="#059669" 
                strokeWidth="2" 
                className="animate-pulse" />
          
          {/* Major Spanish Cities */}
          <circle cx="200" cy="250" r="8" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: '0.2s' }}>
            <title>Madrid</title>
          </circle>
          <circle cx="300" cy="200" r="6" fill="#8b5cf6" className="animate-pulse" style={{ animationDelay: '0.4s' }}>
            <title>Barcelona</title>
          </circle>
          <circle cx="150" cy="300" r="5" fill="#f59e0b" className="animate-pulse" style={{ animationDelay: '0.6s' }}>
            <title>Sevilla</title>
          </circle>
          <circle cx="400" cy="180" r="5" fill="#ef4444" className="animate-pulse" style={{ animationDelay: '0.8s' }}>
            <title>Valencia</title>
          </circle>
          <circle cx="250" cy="350" r="4" fill="#06b6d4" className="animate-pulse" style={{ animationDelay: '1s' }}>
            <title>Málaga</title>
          </circle>
          
          {/* Mountain Ranges */}
          <path d="M100,200 L150,180 L200,190 L250,170 L300,185 L350,175 L400,190 L450,180 L500,195 L550,185 L600,200"
                stroke="#059669" strokeWidth="3" fill="none" opacity="0.7" />
          <path d="M200,300 L250,290 L300,305 L350,295 L400,310 L450,300 L500,315 L550,305"
                stroke="#059669" strokeWidth="3" fill="none" opacity="0.7" />
          
          {/* Coastline */}
          <path d="M0,200 L50,190 L100,200 L150,210 L200,220 L250,230 L300,240 L350,250 L400,260 L450,270 L500,280 L550,290 L600,300 L650,310 L700,320 L750,330 L800,340"
                stroke="#0ea5e9" strokeWidth="2" fill="none" opacity="0.6" />
          
          {/* Animated Connection Lines */}
          <path d="M200,250 L300,200" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.4" className="animate-pulse" />
          <path d="M200,250 L150,300" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.4" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
          <path d="M300,200 L400,180" stroke="#10b981" strokeWidth="1" fill="none" opacity="0.4" className="animate-pulse" style={{ animationDelay: '1s' }} />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto p-8 relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Globe className="w-12 h-12 mr-4 text-blue-600 animate-spin" style={{ animationDuration: '20s' }} />
            A World to Explore
          </h1>
          <p className="text-gray-600 text-xl">Descubre rutas increíbles en más de 85 países</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar país..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
            />
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-orange-600" />
            Destinos Populares
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {countries.filter(c => c.popular).slice(0, 12).map((country) => (
              <div
                key={country.name}
                onClick={() => handleCountrySelect(country)}
                className="rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-transparent hover:border-white relative overflow-hidden group"
                style={{ background: country.flagBg }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="relative text-center">
                  <div className="text-6xl mb-3 drop-shadow-lg group-hover:scale-110 transition-transform">{country.flag}</div>
                  <h3 className="font-bold text-white mb-1 drop-shadow-lg">{country.name}</h3>
                  <p className="text-sm text-white drop-shadow-lg">{country.trails.toLocaleString()} rutas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Countries */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-green-600" />
            Todos los Países ({filteredCountries.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredCountries.map((country) => (
              <div
                key={country.name}
                onClick={() => handleCountrySelect(country)}
                className="rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group relative overflow-hidden"
                style={{ background: country.flagBg }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="relative flex items-center space-x-3">
                  <div className="text-4xl group-hover:scale-110 transition-transform drop-shadow-lg">{country.flag}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white group-hover:text-yellow-200 transition-colors drop-shadow-lg">
                      {country.name}
                    </h3>
                    <p className="text-sm text-white drop-shadow-lg">{country.trails.toLocaleString()} rutas</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Country Routes */}
        {selectedCountry && (
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                <MapPin className="w-8 h-8 mr-3 text-blue-600" />
                Rutas en {selectedCountry.name}
              </h2>
              <button
                onClick={() => setSelectedCountry(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            {loadingRoutes ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando rutas...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {countryRoutes.map((route) => (
                  <div key={route.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-800 text-lg">{route.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(route.difficulty)}`}>
                        {route.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{route.description}</p>
                    
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
                    
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">{route.terrain} • {route.surface}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* World Map Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <Globe className="w-8 h-8 mr-3 text-blue-600" />
            World Map
          </h2>
          <div className="relative h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-32 h-32 text-blue-600 mx-auto mb-4 animate-pulse" />
                <p className="text-2xl font-bold text-gray-700">Mapa Interactivo</p>
                <p className="text-gray-600 mt-2">Próximamente: Explora rutas en un mapa mundial interactivo</p>
                <button className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-bold shadow-lg">
                  Ver Mapa Completo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-4xl font-bold mb-2">{countries.length}</p>
            <p className="text-blue-100">Países</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-4xl font-bold mb-2">{countries.reduce((sum, c) => sum + c.trails, 0).toLocaleString()}</p>
            <p className="text-green-100">Rutas Totales</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-4xl font-bold mb-2">{countries.filter(c => c.popular).length}</p>
            <p className="text-purple-100">Destinos Populares</p>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-4xl font-bold mb-2">24/7</p>
            <p className="text-orange-100">Disponible</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;

