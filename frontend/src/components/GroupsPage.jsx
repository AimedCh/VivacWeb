import React, { useState } from 'react';
import { Users, Plus, Search, TrendingUp, Lock, Globe, MessageCircle, UserPlus, Settings } from 'lucide-react';

const GroupsPage = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('my-groups');

  const myGroups = [
    {
      id: 1,
      name: 'Montañeros España',
      description: 'Comunidad de montañeros y amantes del vivac en España',
      members: 1234,
      posts: 456,
      image: '🏔️',
      isPrivate: false,
      isMember: true,
      lastActivity: 'Hace 5 minutos',
      category: 'Montañismo'
    },
    {
      id: 2,
      name: 'Vivac Responsable',
      description: 'Promovemos el vivac sostenible y respetuoso con el medio ambiente',
      members: 856,
      posts: 234,
      image: '⛺',
      isPrivate: false,
      isMember: true,
      lastActivity: 'Hace 1 hora',
      category: 'Sostenibilidad'
    },
    {
      id: 3,
      name: 'Rutas Extremas',
      description: 'Para los más aventureros. Rutas de alta dificultad y desafíos',
      members: 543,
      posts: 189,
      image: '🥾',
      isPrivate: true,
      isMember: true,
      lastActivity: 'Hace 3 horas',
      category: 'Aventura'
    },
  ];

  const suggestedGroups = [
    {
      id: 4,
      name: 'Fotografía de Montaña',
      description: 'Comparte tus mejores fotos de paisajes y montañas',
      members: 2341,
      posts: 1234,
      image: '📸',
      isPrivate: false,
      isMember: false,
      category: 'Fotografía'
    },
    {
      id: 5,
      name: 'Senderismo Familiar',
      description: 'Rutas aptas para toda la familia con niños',
      members: 987,
      posts: 456,
      image: '👨‍👩‍👧‍👦',
      isPrivate: false,
      isMember: false,
      category: 'Familia'
    },
    {
      id: 6,
      name: 'Escalada y Boulder',
      description: 'Comunidad de escaladores y amantes del boulder',
      members: 1543,
      posts: 789,
      image: '🧗',
      isPrivate: false,
      isMember: false,
      category: 'Escalada'
    },
  ];

  const trendingGroups = [
    {
      id: 7,
      name: 'Picos de Europa',
      description: 'Todo sobre rutas y vivac en Picos de Europa',
      members: 1876,
      posts: 654,
      image: '⛰️',
      isPrivate: false,
      isMember: false,
      trending: true,
      category: 'Regional'
    },
    {
      id: 8,
      name: 'Equipo y Gear',
      description: 'Reviews, consejos y recomendaciones de equipo',
      members: 2456,
      posts: 1123,
      image: '🎒',
      isPrivate: false,
      isMember: false,
      trending: true,
      category: 'Equipo'
    },
  ];

  const filteredMyGroups = myGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggested = suggestedGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderGroupCard = (group, showJoinButton = false) => (
    <div
      key={group.id}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl">{group.image}</div>
        </div>
        {group.isPrivate && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center space-x-1">
            <Lock className="w-3 h-3 text-gray-700" />
            <span className="text-xs font-semibold text-gray-700">Privado</span>
          </div>
        )}
        {group.trending && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs font-semibold">Trending</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{group.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{group.members.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{group.posts}</span>
            </div>
          </div>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {group.category}
          </span>
        </div>

        {group.lastActivity && (
          <p className="text-xs text-gray-500 mb-4">{group.lastActivity}</p>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          {showJoinButton ? (
            <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>Unirse</span>
            </button>
          ) : (
            <>
              <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                Ver Grupo
              </button>
              <button className="p-2 border-2 border-gray-300 rounded-lg hover:border-green-500 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            <Users className="w-10 h-10 mr-3 text-green-600" />
            Grupos
          </h1>
          <p className="text-gray-600 text-lg">Únete a comunidades y conecta con otros exploradores</p>
        </div>

        {/* Search and Create */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar grupos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Crear Grupo</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('my-groups')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'my-groups'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Mis Grupos ({myGroups.length})
          </button>
          <button
            onClick={() => setActiveTab('suggested')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'suggested'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sugeridos
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'trending'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Trending
          </button>
        </div>

        {/* Content */}
        {activeTab === 'my-groups' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMyGroups.map(group => renderGroupCard(group, false))}
          </div>
        )}

        {activeTab === 'suggested' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuggested.map(group => renderGroupCard(group, true))}
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingGroups.map(group => renderGroupCard(group, true))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-4xl font-bold mb-2">{myGroups.length}</p>
            <p className="text-green-100">Grupos Unidos</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-4xl font-bold mb-2">{myGroups.reduce((sum, g) => sum + g.members, 0).toLocaleString()}</p>
            <p className="text-blue-100">Miembros Totales</p>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-4xl font-bold mb-2">{myGroups.reduce((sum, g) => sum + g.posts, 0)}</p>
            <p className="text-purple-100">Publicaciones</p>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-4xl font-bold mb-2">{suggestedGroups.length}</p>
            <p className="text-orange-100">Sugeridos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;

