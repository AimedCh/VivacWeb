# VivacWeb 30b️

Plataforma web para **explorar, guardar y crear zonas de vivac** (acampada al raso) sobre un mapa interactivo. Incluye **autenticación con email y Google**, gestión de spots, favoritos y una experiencia visual cuidada pensada para móvil y desktop.

> Proyecto desarrollado con **React + Vite** y un backend en Node/Express (API `/api` o backend desplegado en Railway).

---

## ✨ Características principales

- **Autenticación completa**
  - Registro e inicio de sesión con email/contraseña
  - Login con **Google Identity Services**
  - Recuperación de contraseña vía email
- **Mapa interactivo de vivacs**
  - Visualización de puntos de vivac con Leaflet
  - Detalle de spot con fotos, descripción y valoraciones
- **Gestión de vivacs**
  - Crear nuevos vivacs desde el mapa
  - Guardar vivacs como **favoritos** (persistidos en `localStorage`)
- **Experiencia de usuario**
  - Diseño moderno tipo app móvil
  - Pantallas separadas: *Home*, *Explorar*, *Perfil*, *Crear Vivac*, *Detalle de Vivac*
  - Soporte para modo responsive (móvil / tablet / escritorio)

---

## 🛠️ Tecnologías utilizadas

- **Frontend**
  - [React](https://react.dev/) (con hooks)
  - [Vite](https://vitejs.dev/) como bundler y dev server
  - [React Leaflet](https://react-leaflet.js.org/) + [Leaflet](https://leafletjs.com/) para mapas
  - CSS puro (`auth.css`, `index.css`) para el diseño y layout
  - Google Identity Services para login con Google

- **Backend (API)**
  - Node.js / Express (o API compatible) expuesta en:
    - Desarrollo: `http://localhost:5173/api` (proxy de Vite)
    - Producción: `https://vivac-backend-production.up.railway.app`

---

## 📂 Estructura del proyecto (frontend)

```bash
frontend/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── background-login.jpg
│   ├── logo.png
│   └── vite.svg
└── src/
    ├── main.jsx          # Punto de entrada de React
    ├── App.jsx           # Componente principal (rutas y pantallas)
    ├── auth.css          # Estilos de la página de autenticación y layout
    ├── index.css         # Estilos globales
    └── assets/
        └── react.svg
```

---

## 🚀 Puesta en marcha (desarrollo)

Desde la carpeta `frontend`:

```bash
# Instalar dependencias
npm install

# Lanzar el servidor de desarrollo
npm run dev
```

Por defecto Vite usa el puerto `5173`. Abre el navegador en:

```text
http://localhost:5173
```

### Proxy de API en desarrollo

En desarrollo, las peticiones a `/api` se pueden redirigir a tu backend local mediante la configuración de `vite.config.js` (proxy). Asegúrate de que tu backend esté corriendo (por ejemplo en `http://localhost:3000`).

---

## 🧱 Scripts disponibles

En la carpeta `frontend` puedes ejecutar:

```bash
npm run dev       # Modo desarrollo con HMR
npm run build     # Build de producción
npm run preview   # Previsualizar el build
npm run lint      # Ejecutar ESLint
```

---

## 🔐 Configuración de Google Sign-In

El login con Google usa **Google Identity Services**.

- El Client ID se define en `App.jsx` como `GOOGLE_CLIENT_ID`.
- El script de Google se carga en `index.html`:

```html
<script>
  var script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.onload = function () {
    window.googleLoaded = true;
  };
  document.head.appendChild(script);
</script>
```

Asegúrate de:

1. Tener un **Client ID de OAuth 2.0** de tipo *Web* en Google Cloud Console.
2. Configurar los **orígenes autorizados** (por ejemplo `http://localhost:5173` y tu dominio en producción).
3. Actualizar el valor de `GOOGLE_CLIENT_ID` en `App.jsx` si es necesario.

---

## 🧪 Pruebas rápidas del frontend

1. **Registro** de un usuario nuevo con email/contraseña.
2. **Login** con esas credenciales.
3. Probar el botón **"Continuar con Google"** en la pantalla de login.
4. Crear un nuevo vivac desde la pantalla correspondiente.
5. Marcar/desmarcar vivacs como **favoritos** y recargar la página para comprobar que se guardan en `localStorage`.

---

## 📤 Subir este proyecto a GitHub

Desde la carpeta raíz del proyecto (`c:\xampp\htdocs\400web`):

```bash
# 1. Inicializar el repositorio (solo la primera vez)
git init

# 2. Añadir todos los archivos
git add .

# 3. Crear el primer commit
git commit -m "Inicializar proyecto VivacWeb (frontend + backend)"

# 4. Añadir el remoto (cambia la URL por la de tu nuevo repo)
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git

# 5. Subir la rama principal
git branch -M main
git push -u origin main
```

> Nota: crea primero el repositorio vacío en GitHub (sin README ni .gitignore) y sustituye `TU_USUARIO/TU_REPO` por tu usuario y el nombre que quieras para este proyecto.

---

## 👨‍💻 Autor

Proyecto desarrollado por **Aimed Dine Chebili** como práctica de frontend y experiencia de usuario con React + Vite.

Si quieres usar este proyecto como base, siéntete libre de hacer **fork** o adaptarlo a tus necesidades.
