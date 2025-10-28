import React, { useState } from 'react';
import { Users, MessageCircle, Send, Heart, MessageSquare, Share2, Search, Plus, TrendingUp } from 'lucide-react';

const CommunityPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [newMessage, setNewMessage] = useState('');
  const [newComment, setNewComment] = useState('');

  const groups = [
    { id: 1, name: 'Montañeros España', members: 1234, image: '🏔️', active: true },
    { id: 2, name: 'Vivac Responsable', members: 856, image: '⛺', active: true },
    { id: 3, name: 'Rutas Extremas', members: 543, image: '🥾', active: false },
    { id: 4, name: 'Fotografía de Montaña', members: 2341, image: '📸', active: false },
  ];

  const posts = [
    {
      id: 1,
      author: 'María González',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c4a2?w=100',
      time: 'Hace 2 horas',
      content: '¡Increíble ruta por la Sierra de Guadarrama! El amanecer desde el pico fue espectacular. Recomiendo llevar ropa de abrigo, hace bastante frío en la cima.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
      likes: 45,
      comments: 12,
      shares: 3,
    },
    {
      id: 2,
      author: 'Carlos Ruiz',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      time: 'Hace 5 horas',
      content: '¿Alguien ha estado en Picos de Europa recientemente? Planeo ir el próximo fin de semana y me gustaría saber las condiciones actuales.',
      likes: 23,
      comments: 8,
      shares: 1,
    },
    {
      id: 3,
      author: 'Ana Martínez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      time: 'Hace 1 día',
      content: 'Nuevo video tutorial sobre cómo montar un vivac seguro en condiciones de viento. ¡Espero que os sea útil!',
      image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600',
      likes: 89,
      comments: 24,
      shares: 15,
    },
  ];

  const chatMessages = [
    { id: 1, user: 'Pedro', message: 'Hola! ¿Alguien para una ruta este sábado?', time: '10:30', avatar: '👨' },
    { id: 2, user: 'Laura', message: 'Yo me apunto! ¿Qué nivel?', time: '10:32', avatar: '👩' },
    { id: 3, user: 'Miguel', message: 'Yo también! Nivel medio-alto', time: '10:35', avatar: '👨‍🦱' },
    { id: 4, user: user?.name || 'Tú', message: 'Perfecto! Propongo Sierra de Gredos', time: '10:40', avatar: '😊', isMe: true },
  ];

  const renderFeed = () => (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <input
            type="text"
            placeholder="¿Qué estás pensando?"
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors font-semibold">
            Publicar
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-shadow">
          {/* Post Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center space-x-3 mb-4">
              <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{post.author}</h3>
                <p className="text-sm text-gray-500">{post.time}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <p className="text-gray-700 mb-4">{post.content}</p>
          </div>

          {/* Post Image */}
          {post.image && (
            <img src={post.image} alt="Post" className="w-full h-96 object-cover" />
          )}

          {/* Post Actions */}
          <div className="p-6 pt-4">
            <div className="flex items-center justify-between text-gray-500 mb-4">
              <span className="text-sm">{post.likes} me gusta</span>
              <span className="text-sm">{post.comments} comentarios • {post.shares} compartidos</span>
            </div>
            <div className="flex items-center justify-around border-t border-gray-200 pt-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="font-medium">Me gusta</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Comentar</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Compartir</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGroups = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Mis Grupos</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Crear Grupo</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group) => (
            <div key={group.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-green-500 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="text-5xl">{group.image}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{group.name}</h3>
                  <p className="text-sm text-gray-600">{group.members.toLocaleString()} miembros</p>
                  {group.active && (
                    <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Activo
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2 text-green-600" />
          Chat Grupal - Montañeros España
        </h2>
        <p className="text-sm text-gray-600 mt-1">234 miembros en línea</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex items-start space-x-3 ${msg.isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <div className="text-3xl">{msg.avatar}</div>
            <div className={`flex-1 ${msg.isMe ? 'text-right' : ''}`}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-gray-800">{msg.user}</span>
                <span className="text-xs text-gray-500">{msg.time}</span>
              </div>
              <div className={`inline-block px-4 py-2 rounded-2xl ${msg.isMe ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                {msg.message}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors">
            <Send className="w-5 h-5" />
          </button>
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
            Comunidad VivacWeb
          </h1>
          <p className="text-gray-600 text-lg">Conecta con otros exploradores y comparte tus experiencias</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'feed'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'groups'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Grupos
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'chat'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Chat
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'feed' && renderFeed()}
            {activeTab === 'groups' && renderGroups()}
            {activeTab === 'chat' && renderChat()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                Tendencias
              </h3>
              <div className="space-y-3">
                <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <p className="font-semibold text-gray-800">#SierraDeGredos</p>
                  <p className="text-sm text-gray-600">1.2k publicaciones</p>
                </div>
                <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <p className="font-semibold text-gray-800">#VivacResponsable</p>
                  <p className="text-sm text-gray-600">856 publicaciones</p>
                </div>
                <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <p className="font-semibold text-gray-800">#RutasDeOtoño</p>
                  <p className="text-sm text-gray-600">543 publicaciones</p>
                </div>
              </div>
            </div>

            {/* Suggested Users */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Usuarios Sugeridos</h3>
              <div className="space-y-3">
                {['Juan Pérez', 'Sofia López', 'David García'].map((name, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                      <span className="font-medium text-gray-800">{name}</span>
                    </div>
                    <button className="text-green-600 hover:text-green-700 font-semibold text-sm">
                      Seguir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;

