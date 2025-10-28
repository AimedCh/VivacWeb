import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import VivacLogo from './VivacLogo';

const Header = ({ user, onLogout }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo and Tagline */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <VivacLogo size={40} showText={false} />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              VivacWeb
            </h1>
          </div>
          <div className="hidden sm:block">
            <h2 className="text-sm font-semibold text-slate-600 tracking-wide uppercase">
              EXPLORA • ACAMPA • CONECTA
            </h2>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar rutas, lugares..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center overflow-hidden">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616b332c4a2?w=100&h=100&fit=crop&crop=face';
                }}
              />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Explorador'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
