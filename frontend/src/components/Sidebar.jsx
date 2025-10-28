import React, { useState, useEffect } from 'react';
import { Home, MapPin, Map, User, MessageCircle, BookOpen, LogOut, Settings, Users, MessageSquare, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';
import VivacLogo from './VivacLogo';

const Sidebar = ({ activeTab, setActiveTab, user: propUser, onLogout }) => {
  const [user, setUser] = useState(propUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    } else {
      fetchUserProfile();
    }
  }, [propUser]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await apiService.getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to prop user or default
      if (!user) {
        setUser({
          name: 'Explorer',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c4a2?w=100&h=100&fit=crop&crop=face',
          role: 'Community Guide',
          description: 'Trail Explorer'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'explore', label: 'Explorar', icon: MapPin },
    { id: 'maps', label: 'Mapas & Rutas', icon: Map },
    { id: 'geospatial', label: 'Explorador Geoespacial', icon: Map, highlight: true },
    { id: 'ai-generator', label: 'IA Generador', icon: Sparkles },
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'groups', label: 'Grupos', icon: Users },
    { id: 'community', label: 'Feed', icon: MessageCircle },
    { id: 'guides', label: 'Guías', icon: BookOpen }
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  if (loading) {
    return (
      <div className="w-64 bg-slate-800 text-white h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-slate-800 text-white h-screen flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">VivacWeb</h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? item.highlight
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                      : 'bg-green-600 hover:bg-green-600'
                    : item.highlight
                    ? 'hover:bg-purple-900/30'
                    : 'hover:bg-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${item.highlight && activeTab !== item.id ? 'animate-pulse' : ''}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {item.highlight && activeTab !== item.id && (
                  <span className="ml-auto text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">AI</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings & Logout */}
        <div className="mt-8 space-y-2">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-700 text-slate-300 ${
              activeTab === 'settings' ? 'bg-slate-700' : ''
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-red-600 text-slate-300 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;