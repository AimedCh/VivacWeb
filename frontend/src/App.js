import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import RealMapView from './components/RealMapView';
import RightPanel from './components/RightPanel';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import GuidesPage from './components/GuidesPage';
import HomePage from './components/HomePage';
import CommunityPage from './components/CommunityPage';
import ExplorePage from './components/ExplorePage';
import CountryRoutesPage from './components/CountryRoutesPage';
import SettingsPage from './components/SettingsPage';
import RoutesPage from './components/RoutesPage';
import ChatPage from './components/ChatPage';
import GroupsPage from './components/GroupsPage';
import AIRouteGenerator from './components/AIRouteGenerator';
import MapPage from './components/MapPage';
import GeospatialApp from './components/GeospatialApp';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import { apiService } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [generatedRoute, setGeneratedRoute] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Check for stored user session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('vivacweb_user');
    const storedToken = localStorage.getItem('vivacweb_token');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure equipment is always an array
        const userWithSafeEquipment = {
          ...parsedUser,
          equipment: Array.isArray(parsedUser.equipment) ? parsedUser.equipment : []
        };
        setUser(userWithSafeEquipment);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data
        localStorage.removeItem('vivacweb_user');
        localStorage.removeItem('vivacweb_token');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    // Ensure equipment is always an array
    const userWithSafeEquipment = {
      ...userData,
      equipment: Array.isArray(userData.equipment) ? userData.equipment : []
    };
    setUser(userWithSafeEquipment);
    setIsAuthenticated(true);
    setShowWelcome(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    apiService.logout();
  };

  const handleGenerateRoute = (route) => {
    setGeneratedRoute(route);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setActiveTab('country-routes');
  };

  const handleBackToExplore = () => {
    setSelectedCountry(null);
    setActiveTab('explore');
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Post-login welcome screen
  if (showWelcome) {
    return (
      <WelcomeScreen
        user={user}
        onContinue={() => setShowWelcome(false)}
      />
    );
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return <HomePage user={user} />;
      case 'profile':
        return <ProfilePage user={user} />;
      case 'guides':
        return <GuidesPage />;
      case 'community':
        return <CommunityPage user={user} />;
      case 'chat':
        return <ChatPage user={user} />;
      case 'groups':
        return <GroupsPage user={user} />;
      case 'settings':
        return <SettingsPage user={user} />;
      case 'explore':
        return <ExplorePage onCountrySelect={handleCountrySelect} />;
      case 'country-routes':
        return <CountryRoutesPage country={selectedCountry} onBack={handleBackToExplore} />;
      case 'maps':
        return <MapPage />;
      case 'geospatial':
        return <GeospatialApp />;
      case 'routes':
        return <RoutesPage />;
      case 'ai-generator':
        return <AIRouteGenerator onRouteGenerated={handleGenerateRoute} />;
      default:
        return (
          <>
            <RealMapView selectedRoute={generatedRoute} onRouteSelect={handleGenerateRoute} />
            <RightPanel onGenerateRoute={handleGenerateRoute} />
          </>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header user={user} onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onLogout={handleLogout}
        />
        {renderContent()}
      </div>
    </div>
  );
}

export default App;