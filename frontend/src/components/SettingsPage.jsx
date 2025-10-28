import React, { useState } from 'react';
import { Settings, User, Bell, Lock, Globe, Moon, Eye, Shield, Database, HelpCircle } from 'lucide-react';

const SettingsPage = ({ user }) => {
  const [activeSection, setActiveSection] = useState('account');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newRoutes: true,
    comments: true,
    followers: false,
  });
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showLocation: true,
    allowMessages: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('es');

  const sections = [
    { id: 'account', label: 'Cuenta', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'privacy', label: 'Privacidad', icon: Lock },
    { id: 'appearance', label: 'Apariencia', icon: Moon },
    { id: 'language', label: 'Idioma', icon: Globe },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'data', label: 'Datos', icon: Database },
    { id: 'help', label: 'Ayuda', icon: HelpCircle },
  ];

  const renderAccount = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Información de la Cuenta</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
              type="text"
              defaultValue={user?.name || 'Usuario'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user?.email || 'usuario@example.com'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
            <textarea
              rows="4"
              defaultValue="Amante de la montaña y el vivac responsable"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Preferencias de Notificaciones</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4">Canales de Notificación</h3>
          <div className="space-y-3">
            {Object.entries({
              email: 'Notificaciones por Email',
              push: 'Notificaciones Push',
              sms: 'Notificaciones SMS',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700">{label}</span>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications[key] ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications[key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4">Tipos de Notificaciones</h3>
          <div className="space-y-3">
            {Object.entries({
              newRoutes: 'Nuevas rutas recomendadas',
              comments: 'Comentarios en mis publicaciones',
              followers: 'Nuevos seguidores',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-700">{label}</span>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications[key] ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications[key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración de Privacidad</h2>
      
      <div className="space-y-4">
        {Object.entries({
          profilePublic: 'Perfil público',
          showEmail: 'Mostrar email en perfil',
          showLocation: 'Mostrar ubicación',
          allowMessages: 'Permitir mensajes de otros usuarios',
        }).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium text-gray-800">{label}</span>
              <p className="text-sm text-gray-600 mt-1">
                {key === 'profilePublic' && 'Tu perfil será visible para todos los usuarios'}
                {key === 'showEmail' && 'Otros usuarios podrán ver tu dirección de email'}
                {key === 'showLocation' && 'Tu ubicación será visible en tus publicaciones'}
                {key === 'allowMessages' && 'Otros usuarios podrán enviarte mensajes directos'}
              </p>
            </div>
            <button
              onClick={() => setPrivacy({ ...privacy, [key]: !privacy[key] })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                privacy[key] ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  privacy[key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Apariencia</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-800">Modo Oscuro</span>
              <p className="text-sm text-gray-600 mt-1">Activa el tema oscuro para reducir la fatiga visual</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-3">Tamaño de Fuente</h3>
          <div className="flex space-x-4">
            {['Pequeño', 'Mediano', 'Grande'].map((size) => (
              <button
                key={size}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-green-500 transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLanguage = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Idioma y Región</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Idioma de la Interfaz</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Zona Horaria</label>
          <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
            <option>GMT+1 (Madrid)</option>
            <option>GMT+0 (Londres)</option>
            <option>GMT-5 (Nueva York)</option>
            <option>GMT+9 (Tokio)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Seguridad</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-3">Cambiar Contraseña</h3>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Contraseña actual"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
              Actualizar Contraseña
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-3">Autenticación de Dos Factores</h3>
          <p className="text-sm text-gray-600 mb-3">Añade una capa extra de seguridad a tu cuenta</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Activar 2FA
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'account': return renderAccount();
      case 'notifications': return renderNotifications();
      case 'privacy': return renderPrivacy();
      case 'appearance': return renderAppearance();
      case 'language': return renderLanguage();
      case 'security': return renderSecurity();
      case 'data':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Datos</h2>
            <div className="space-y-4">
              <button className="w-full p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left font-semibold">
                Descargar mis datos
              </button>
              <button className="w-full p-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-left font-semibold">
                Eliminar mi cuenta
              </button>
            </div>
          </div>
        );
      case 'help':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Centro de Ayuda</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Preguntas Frecuentes</h3>
                <p className="text-gray-600">Encuentra respuestas a las preguntas más comunes</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Contactar Soporte</h3>
                <p className="text-gray-600">Nuestro equipo está aquí para ayudarte</p>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
            <Settings className="w-10 h-10 mr-3 text-green-600" />
            Configuración
          </h1>
          <p className="text-gray-600 text-lg">Personaliza tu experiencia en VivacWeb</p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

