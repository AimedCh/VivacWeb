import React, { useState } from 'react';
import { Sparkles, MapPin, Cloud, TrendingUp, AlertTriangle, Info, Loader } from 'lucide-react';

const AIRouteGenerator = ({ onRouteGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    location: '',
    difficulty: 'medium',
    distance: '10',
    terrain: 'mountain',
    experience: 'intermediate',
    weather: true,
    safety: true,
  });

  const [generatedRoute, setGeneratedRoute] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockRoute = {
        name: `Ruta ${preferences.terrain} - ${preferences.location || 'Sierra de Gredos'}`,
        description: `Ruta personalizada generada por IA basada en tus preferencias. Nivel ${preferences.difficulty}, distancia aproximada ${preferences.distance}km.`,
        difficulty: preferences.difficulty,
        distance: `${preferences.distance} km`,
        duration: `${Math.ceil(parseInt(preferences.distance) / 3)}-${Math.ceil(parseInt(preferences.distance) / 2)} horas`,
        elevation: `+${Math.floor(parseInt(preferences.distance) * 50)}m`,
        waypoints: [
          { name: 'Punto de Inicio', lat: 40.3, lng: -5.7, description: 'Parking y acceso principal' },
          { name: 'Mirador', lat: 40.32, lng: -5.68, description: 'Vistas panorámicas espectaculares' },
          { name: 'Zona de Vivac', lat: 40.34, lng: -5.66, description: 'Área ideal para acampar' },
          { name: 'Cumbre', lat: 40.36, lng: -5.64, description: 'Punto más alto de la ruta' },
        ],
        weather: {
          temp: '18°C',
          condition: 'Soleado',
          wind: '15 km/h',
          precipitation: '10%',
        },
        safetyTips: [
          'Lleva suficiente agua (mínimo 2L por persona)',
          'Informa a alguien de tu ruta y hora estimada de regreso',
          'Revisa el pronóstico del tiempo antes de salir',
          'Lleva un botiquín de primeros auxilios',
          'Descarga mapas offline en tu dispositivo',
        ],
        pointsOfInterest: [
          { name: 'Laguna Glaciar', type: 'Natural', description: 'Hermosa laguna de origen glaciar' },
          { name: 'Refugio de Montaña', type: 'Refugio', description: 'Refugio abierto todo el año' },
          { name: 'Bosque de Pinos', type: 'Natural', description: 'Denso bosque de pinos centenarios' },
        ],
        aiRecommendations: [
          `Basado en tu nivel ${preferences.experience}, esta ruta es perfecta para ti`,
          `El terreno ${preferences.terrain} ofrece vistas espectaculares`,
          `Mejor época: Primavera y Otoño para evitar temperaturas extremas`,
          `Recomendamos salir temprano (7-8 AM) para aprovechar la luz del día`,
        ],
      };

      setGeneratedRoute(mockRoute);
      setLoading(false);
      if (onRouteGenerated) {
        onRouteGenerated(mockRoute);
      }
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
          <Sparkles className="w-7 h-7 mr-3 animate-pulse" />
          Generador de Rutas con IA
        </h2>
        <p className="text-white/90">Crea rutas personalizadas con inteligencia artificial GPT-4</p>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6">
        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-green-600" />
            Ubicación
          </label>
          <input
            type="text"
            value={preferences.location}
            onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
            placeholder="Ej: Sierra de Gredos, Picos de Europa..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Dificultad</label>
          <div className="grid grid-cols-3 gap-3">
            {['easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                onClick={() => setPreferences({ ...preferences, difficulty: level })}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  preferences.difficulty === level
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level === 'easy' ? 'Fácil' : level === 'medium' ? 'Media' : 'Difícil'}
              </button>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Distancia: {preferences.distance} km
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={preferences.distance}
            onChange={(e) => setPreferences({ ...preferences, distance: e.target.value })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>5 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Terrain */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Terreno</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'mountain', label: 'Montaña', emoji: '🏔️' },
              { value: 'forest', label: 'Bosque', emoji: '🌲' },
              { value: 'coastal', label: 'Costa', emoji: '🌊' },
              { value: 'desert', label: 'Desierto', emoji: '🏜️' },
            ].map((terrain) => (
              <button
                key={terrain.value}
                onClick={() => setPreferences({ ...preferences, terrain: terrain.value })}
                className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                  preferences.terrain === terrain.value
                    ? 'bg-purple-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl">{terrain.emoji}</span>
                <span>{terrain.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tu Nivel de Experiencia</label>
          <select
            value={preferences.experience}
            onChange={(e) => setPreferences({ ...preferences, experience: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
            <option value="expert">Experto</option>
          </select>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.weather}
              onChange={(e) => setPreferences({ ...preferences, weather: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-gray-700 flex items-center">
              <Cloud className="w-4 h-4 mr-2 text-blue-600" />
              Incluir información meteorológica
            </span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.safety}
              onChange={(e) => setPreferences({ ...preferences, safety: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className="text-gray-700 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
              Incluir consejos de seguridad
            </span>
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white px-6 py-4 rounded-xl hover:shadow-2xl transition-all font-bold text-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="w-6 h-6 animate-spin" />
              <span>Generando ruta con IA...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              <span>Generar Ruta Personalizada</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Route */}
      {generatedRoute && (
        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
            Ruta Generada
          </h3>

          <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
            <h4 className="text-2xl font-bold text-gray-800 mb-2">{generatedRoute.name}</h4>
            <p className="text-gray-600 mb-4">{generatedRoute.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-green-700 mb-1">Distancia</p>
                <p className="font-bold text-green-800">{generatedRoute.distance}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-700 mb-1">Duración</p>
                <p className="font-bold text-blue-800">{generatedRoute.duration}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-xs text-orange-700 mb-1">Desnivel</p>
                <p className="font-bold text-orange-800">{generatedRoute.elevation}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs text-purple-700 mb-1">Dificultad</p>
                <p className="font-bold text-purple-800 capitalize">{generatedRoute.difficulty}</p>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
            <h5 className="font-bold text-gray-800 mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Recomendaciones de IA
            </h5>
            <ul className="space-y-2">
              {generatedRoute.aiRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start space-x-2 text-gray-700">
                  <span className="text-purple-600 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety Tips */}
          {preferences.safety && (
            <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
              <h5 className="font-bold text-gray-800 mb-3 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                Consejos de Seguridad
              </h5>
              <ul className="space-y-2">
                {generatedRoute.safetyTips.map((tip, i) => (
                  <li key={i} className="flex items-start space-x-2 text-gray-700">
                    <span className="text-orange-600 mt-1">⚠️</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weather */}
          {preferences.weather && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h5 className="font-bold text-gray-800 mb-3 flex items-center">
                <Cloud className="w-5 h-5 mr-2 text-blue-600" />
                Condiciones Meteorológicas
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Temperatura</p>
                  <p className="font-bold text-gray-800">{generatedRoute.weather.temp}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Condición</p>
                  <p className="font-bold text-gray-800">{generatedRoute.weather.condition}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Viento</p>
                  <p className="font-bold text-gray-800">{generatedRoute.weather.wind}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Precipitación</p>
                  <p className="font-bold text-gray-800">{generatedRoute.weather.precipitation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRouteGenerator;

