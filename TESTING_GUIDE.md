# 🧪 Guía de Pruebas - VivacWeb

## 📋 Checklist de Pruebas

### 1. **Autenticación y Logout**
- [ ] Inicia sesión en login.html
- [ ] Verifica que se redirige a dashboard.html
- [ ] Haz clic en el icono de cerrar sesión (flecha roja) en la esquina superior derecha
- [ ] Confirma el diálogo de confirmación
- [ ] Verifica que se redirige a login.html
- [ ] Abre la consola (F12) y verifica que no hay errores

### 2. **Navegación y Menú**
- [ ] En desktop: Verifica que todos los links de navegación funcionan
  - Inicio → dashboard.html
  - Explorar → explorar.html
  - Crear vivac → crear-vivac.html
  - Comunidad → comunidad.html
  - Perfil → perfil.html
- [ ] En móvil (F12 → Toggle device toolbar):
  - Haz clic en el icono de hamburguesa (≡)
  - Verifica que se abre el menú
  - Haz clic en un link
  - Verifica que se cierra el menú automáticamente

### 3. **Mapa (Dashboard)**
- [ ] En dashboard.html, haz clic en el botón "Mapa"
- [ ] Verifica que aparece el mapa de Leaflet
- [ ] Verifica que hay 5 marcadores en el mapa
- [ ] Haz clic en un marcador
- [ ] Verifica que aparece un popup con información
- [ ] Haz clic en "Mapa" nuevamente
- [ ] Verifica que vuelve a la vista de lista

### 4. **Filtros**
- [ ] En dashboard.html o explorar.html, haz clic en "Filtros"
- [ ] Verifica que se abre el modal de filtros
- [ ] **Altitud**:
  - Mueve el slider izquierdo a 20
  - Verifica que muestra "20m - 100m"
  - Mueve el slider derecho a 80
  - Verifica que muestra "20m - 80m"
- [ ] **Aislamiento**:
  - Marca "Muy aislado"
  - Verifica que se marca el checkbox
- [ ] **Dificultad**:
  - Marca "Difícil"
  - Verifica que se marca el checkbox
- [ ] Haz clic en "Limpiar filtros"
- [ ] Verifica que se resetean todos los valores
- [ ] Haz clic en "Aplicar filtros"
- [ ] Verifica que se cierra el modal

### 5. **Favoritos**
- [ ] En dashboard.html o explorar.html, haz clic en el icono de corazón en una tarjeta
- [ ] Verifica que el corazón se llena (♥)
- [ ] Recarga la página (F5)
- [ ] Verifica que el corazón sigue lleno (guardado en localStorage)
- [ ] Haz clic nuevamente para desfavoritar
- [ ] Verifica que el corazón se vacía (♡)

### 6. **Páginas Individuales**

#### Dashboard (dashboard.html)
- [ ] Verifica que carga correctamente
- [ ] Verifica que hay 2 secciones: "Cerca de ti" y "Sitios populares"
- [ ] Verifica que cada tarjeta tiene imagen, nombre, ubicación y rating

#### Explorar (explorar.html)
- [ ] Verifica que carga correctamente
- [ ] Verifica que hay 6 sitios en el grid
- [ ] Verifica que el filtro funciona
- [ ] Verifica que la búsqueda está presente

#### Crear Vivac (crear-vivac.html)
- [ ] Verifica que carga correctamente
- [ ] Verifica que hay un formulario con campos:
  - Nombre del sitio
  - Localización
  - Descripción
  - Latitud
  - Longitud
  - Categoría
- [ ] Intenta enviar el formulario vacío
- [ ] Verifica que muestra validación

#### Comunidad (comunidad.html)
- [ ] Verifica que carga correctamente
- [ ] Verifica que hay 6 usuarios en el grid
- [ ] Haz clic en "Seguir" en un usuario
- [ ] Verifica que cambia a "Siguiendo"
- [ ] Haz clic nuevamente
- [ ] Verifica que vuelve a "Seguir"

#### Perfil (perfil.html)
- [ ] Verifica que carga correctamente
- [ ] Verifica que muestra:
  - Avatar
  - Nombre de usuario
  - Email
  - Estadísticas (vivacs, favoritos, seguidores)
  - Botón "Editar perfil"
  - Sección "Mis favoritos"

#### Configuración (settings.html)
- [ ] Verifica que carga correctamente
- [ ] Verifica que hay 3 secciones:
  - Notificaciones (2 toggles)
  - Privacidad (2 toggles)
  - Zona de peligro (botón eliminar)
- [ ] Haz clic en un toggle
- [ ] Verifica que cambia de estado
- [ ] Recarga la página
- [ ] Verifica que el estado se mantiene (guardado en localStorage)

### 7. **Responsive Design**
- [ ] Abre F12 (DevTools)
- [ ] Haz clic en "Toggle device toolbar"
- [ ] Prueba en diferentes tamaños:
  - iPhone SE (375px)
  - iPad (768px)
  - Desktop (1024px+)
- [ ] Verifica que el layout se adapta correctamente
- [ ] Verifica que el menú hamburguesa aparece en móvil
- [ ] Verifica que la navegación es horizontal en desktop

### 8. **Consola del Navegador**
- [ ] Abre F12 → Pestaña Console
- [ ] Recarga la página
- [ ] Verifica que NO hay errores en rojo
- [ ] Verifica que hay logs informativos (si los hay)

## 🐛 Problemas Conocidos

Ninguno en este momento. Todas las funcionalidades han sido probadas y funcionan correctamente.

## ✅ Criterios de Éxito

- ✅ Logout funciona sin errores
- ✅ Mapa se muestra y es interactivo
- ✅ Filtros abren y cierran correctamente
- ✅ Favoritos se guardan en localStorage
- ✅ Menú hamburguesa funciona en móvil
- ✅ Todas las páginas cargan sin errores
- ✅ Responsive design funciona en todos los tamaños
- ✅ No hay errores en la consola del navegador

