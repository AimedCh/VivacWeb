# 🏕️ VivacWeb

Una plataforma web moderna para descubrir, compartir y explorar lugares de vivac (camping libre) en España. Encuentra los mejores spots para acampar, guarda tus favoritos y comparte tus descubrimientos con la comunidad.

![VivacWeb](https://img.shields.io/badge/VivacWeb-Platform-blue)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?logo=leaflet)

## ✨ Características Principales

### 🗺️ Mapas Interactivos
- **Mapas en tiempo real** con Leaflet para explorar ubicaciones
- **Marcadores personalizados** para identificar spots de vivac
- **Navegación intuitiva** con zoom y pan suave
- **Búsqueda por ubicación** para encontrar spots cercanos

### 🔐 Autenticación Segura
- **Login con Google OAuth** - Inicio de sesión rápido y seguro
- **Registro tradicional** con validación de contraseñas
- **Recuperación de contraseña** por email
- **Gestión de sesiones** con localStorage

### 📍 Gestión de Spots
- **Explorar spots** en el mapa interactivo
- **Crear nuevos vivacs** con ubicación precisa
- **Guardar favoritos** para acceso rápido
- **Detalles completos** de cada ubicación:
  - Coordenadas GPS
  - Dificultad de acceso
  - Tipo de terreno
  - Nivel de privacidad
  - Fotos y descripciones

### 👤 Perfil de Usuario
- **Gestión de cuenta** personalizada
- **Vivacs guardados** - Lista de tus favoritos
- **Historial de actividad** - Tus spots creados
- **Configuración de preferencias**

### 🎨 Interfaz Moderna
- **Diseño responsive** - Funciona en móvil, tablet y desktop
- **UI/UX intuitiva** con Material Symbols
- **Animaciones suaves** y transiciones fluidas
- **Tema oscuro/claro** adaptable

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 19.2.0** - Framework principal con hooks modernos
- **Vite 7.2.4** - Build tool ultra-rápido y dev server
- **React Leaflet 5.0.0** - Integración de mapas interactivos
- **Leaflet 1.9.4** - Biblioteca de mapas open-source
- **Google Identity Services** - Autenticación OAuth
- **Material Symbols** - Iconografía moderna

### Backend
- **API REST** desplegada en Railway
- **Base de datos** para gestión de usuarios y vivacs
- **Autenticación JWT** para sesiones seguras
- **Endpoints optimizados** para rendimiento

## 📁 Estructura del Proyecto

```
400web/
├── frontend/                    # Aplicación React
│   ├── public/                  # Archivos estáticos
│   │   ├── logo.png           # Logo de la aplicación
│   │   └── background-login.jpg # Imagen de fondo
│   ├── src/
│   │   ├── App.jsx            # Componente principal
│   │   ├── auth.css           # Estilos de autenticación
│   │   ├── index.css          # Estilos globales
│   │   └── main.jsx           # Punto de entrada
│   ├── index.html             # HTML principal
│   ├── package.json           # Dependencias
│   └── vite.config.js         # Configuración de Vite
├── test-api.js                # Scripts de prueba de API
└── README.md                  # Este archivo
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

- **Node.js** (v18 o superior)
- **npm** o **yarn**
- **Git** para clonar el repositorio

### 1. Clonar el repositorio

```bash
git clone https://github.com/AimedCh/vivacweb.git
cd vivacweb
```

### 2. Instalar dependencias

```bash
cd frontend
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `frontend/`:

```env
VITE_API_URL=https://vivac-backend-production.up.railway.app
VITE_GOOGLE_CLIENT_ID=tu-google-client-id
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 5. Build para producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

## 🎯 Uso

### Explorar Spots
1. Inicia sesión o regístrate
2. Navega al mapa de exploración
3. Haz clic en los marcadores para ver detalles
4. Guarda tus favoritos para acceso rápido

### Crear un Vivac
1. Accede a la pantalla de creación
2. Selecciona la ubicación en el mapa
3. Completa la información del spot
4. Guarda y comparte con la comunidad

### Gestionar Favoritos
1. Ve a tu perfil
2. Accede a "Vivacs Guardados"
3. Gestiona tu lista de favoritos

## 🔌 API Endpoints

### Autenticación
```
POST   /api/auth/register          # Registro de usuario
POST   /api/auth/login             # Inicio de sesión
POST   /api/auth/google            # Login con Google
POST   /api/auth/request-password-reset  # Recuperar contraseña
```

### Vivacs
```
GET    /api/vivacs                 # Listar todos los vivacs
GET    /api/vivacs/:id             # Obtener un vivac específico
POST   /api/vivacs                 # Crear nuevo vivac
PUT    /api/vivacs/:id             # Actualizar vivac
DELETE /api/vivacs/:id             # Eliminar vivac
```

### Usuarios
```
GET    /api/users/profile          # Obtener perfil de usuario
PUT    /api/users/profile          # Actualizar perfil
```

## 🎨 Características de Diseño

### Paleta de Colores
- **Primario**: Azul (#4a90e2)
- **Secundario**: Verde (#28a745)
- **Fondo**: Gradientes suaves con blur
- **Texto**: Gris oscuro (#111827)

### Componentes Principales
- **Auth Screen** - Login/Registro con Google OAuth
- **Home Screen** - Vista principal con navegación
- **Explore Screen** - Mapa interactivo de spots
- **Profile Screen** - Gestión de perfil y favoritos
- **Create Vivac Screen** - Creación de nuevos spots

## 🚀 Despliegue

### Vercel / Netlify

```bash
npm run build
# Subir carpeta dist/ a tu plataforma de hosting
```

### Railway / Render

```bash
# Configurar build command: npm run build
# Configurar start command: npm run preview
# Configurar output directory: dist
```

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 **Móviles** (320px - 768px)
- 📱 **Tablets** (768px - 1024px)
- 💻 **Desktop** (1024px+)

## 🔒 Seguridad

- ✅ Autenticación OAuth con Google
- ✅ Validación de contraseñas seguras
- ✅ Tokens JWT para sesiones
- ✅ HTTPS en producción
- ✅ Sanitización de inputs

## 🐛 Solución de Problemas

### Error de conexión con la API

Verifica que la URL de la API esté correctamente configurada en las variables de entorno.

### Problemas con Google OAuth

Asegúrate de que el `GOOGLE_CLIENT_ID` esté correctamente configurado y que los dominios autorizados estén registrados en Google Cloud Console.

### Errores de mapa

Verifica que Leaflet CSS esté correctamente importado y que las coordenadas sean válidas.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📈 Próximas Mejoras

- [ ] **Filtros avanzados** - Búsqueda por tipo de terreno, dificultad, etc.
- [ ] **Comentarios y reviews** - Sistema de valoraciones
- [ ] **Fotos múltiples** - Galería de imágenes por spot
- [ ] **Rutas y direcciones** - Navegación GPS integrada
- [ ] **Notificaciones** - Alertas de nuevos spots cercanos
- [ ] **Modo offline** - Funcionalidad sin conexión
- [ ] **Exportar a PDF** - Generar guías de spots
- [ ] **Compartir en redes sociales** - Integración social
- [ ] **App móvil** - Versión nativa con React Native

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Aimed Dine Chebili**

- 📧 Email: chebiliaimed9@gmail.com
- 💼 LinkedIn: [aimed-dine-chebili](https://www.linkedin.com/in/aimed-dine-chebili)
- 🐙 GitHub: [@AimedCh](https://github.com/AimedCh)

## 🙏 Agradecimientos

- **React Team** por el framework excepcional
- **Leaflet** por la biblioteca de mapas open-source
- **Vite** por el build tool ultra-rápido
- **Google** por el servicio de autenticación OAuth
- **Railway** por el hosting del backend
- Todos los usuarios que han probado y mejorado el proyecto

---

⭐ **¡Si te gusta este proyecto, no olvides darle una estrella!** ⭐

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto:

- 📧 Email: chebiliaimed9@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/AimedCh/vivacweb/issues)
- 📖 Documentación: Este README y comentarios en el código

---

**VivacWeb** - Descubre tu próximo destino de camping libre 🏕️✨
