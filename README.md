# 🏞️ VivacWeb (Adaptación del Proyecto VivacApp)
<img width="1024" height="1024" alt="vivac logo" src="https://github.com/user-attachments/assets/4c4c33af-dd8e-457f-93ae-ec9e3dde6b04" />

## 🚀 Descripción del Proyecto

**VivacWeb** es la implementación web del concepto original de **VivacApp**. Nuestro objetivo es crear una **plataforma web moderna y responsive** que conecte a personas interesadas en el **vivac (pernocta al aire libre)**, ofreciendo herramientas para planificar rutas, descubrir localizaciones seguras y fomentar una comunidad responsable con el entorno natural.

Inspirado en el modelo de Wikiloc, VivacWeb se diferencia por la integración de un **motor de Inteligencia Artificial (IA)** que recomienda puntos de vivac y rutas personalizadas, basándose en el perfil detallado del usuario (nivel de experiencia, material disponible) y condiciones externas (clima, altitud, dificultad, distancia a núcleos de población).

![WhatsApp Image 2025-10-02 at 20 13 49_80f964e8](https://github.com/user-attachments/assets/f5170337-2d93-4c65-9497-afddc8233140)


### Adaptación Técnica (Justificación de la Plataforma)

Inicialmente, el pliego de requisitos técnicos planteaba una aplicación móvil multiplataforma. Sin embargo, tras una evaluación de viabilidad y adecuación para los plazos del MVP, hemos optado por desarrollar **VivacWeb** como una **aplicación web**. Esta decisión nos permite maximizar la accesibilidad del producto y agilizar el desarrollo del MVP, manteniendo intacta la funcionalidad central y la visión del proyecto.

## ✨ Características Principales del MVP

* **Autenticación de Usuarios:** Registro y login seguro.
* **Perfiles Detallados:** Gestión de perfiles con experiencia, material y preferencias del usuario.
* **Mapas Interactivos:** Visualización de la ubicación actual, puntos de vivac y rutas recomendadas.
* **Recomendaciones Inteligentes:** Generación de rutas y localizaciones de vivac por **IA (GPT)**, personalizadas según el perfil del usuario, clima y geografía.
* **Información Detallada de Rutas:** Datos sobre dificultad, clima, altitud y proximidad a poblaciones.
* **Módulo Comunitario:** Sistema de valoraciones para rutas y puntos de vivac.
* **Guías Educativas:** Contenido sobre vivac responsable y cuidado del medio ambiente.

## 🛠️ Tecnologías Utilizadas (Stack Full-Stack)

### Frontend (Interfaz de Usuario)

* **Framework:** [React 19](https://react.dev/) (con Hooks modernos)
* **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
* **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
* **Enrutamiento:** [React Router (v6)](https://reactrouter.com/en/main)
* **SEO/Meta Tags:** [React Helmet Async](https://www.npmjs.com/package/react-helmet-async)
* **Cliente HTTP:** [Axios](https://axios-http.com/)
* **Herramienta de Build:** [Vite](https://vitejs.dev/)

### Backend (Lógica de Negocio y API)

* **Framework:** [PHP Laravel](https://laravel.com/) (para API RESTful y CRUD)
* **Base de Datos:** [MySQL](https://www.mysql.com/) (`404vivacweb`)
* **Autenticación:** [Laravel Sanctum](https://laravel.com/docs/10.x/sanctum) o JWT (JSON Web Tokens)
* **Integración IA:** [GPT API](https://openai.com/gpt/) (a través de Laravel)
* **API Clima:** [OpenWeatherMap API](https://openweathermap.org/api) (a través de Laravel)
* **Mapas y Geocodificación:** [Mapbox API](https://docs.mapbox.com/api/) (con datos de OpenStreetMap, a través de Laravel)

## ⚙️ Instalación y Configuración del Proyecto

Sigue estos pasos para levantar el proyecto en tu entorno local.

### 1. Prerequisitos

Asegúrate de tener instalado lo siguiente:

* [PHP](https://www.php.net/downloads.php) (versión 8.1 o superior)
* [Composer](https://getcomposer.org/download/)
* [Node.js](https://nodejs.org/en/download/) (LTS recomendado) y [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (o [Yarn](https://yarnpkg.com/))
* [MySQL](https://dev.mysql.com/downloads/mysql/) o [MariaDB](https://mariadb.org/download/)
* [Git](https://git-scm.com/downloads)

### 2. Backend (Laravel)

```bash
# 1. Clona el repositorio
git clone https://github.com/AimedCh/VivacWeb.git

# 2. Instala las dependencias de Composer
composer install

# 3. Copia el archivo de configuración de entorno
cp .env.example .env

# 4. Configura tu base de datos en el archivo .env:
#    DB_CONNECTION=mysql
#    DB_HOST=127.0.0.1
#    DB_PORT=3306
#    DB_DATABASE=404vivacweb
#    DB_USERNAME=root
#    DB_PASSWORD=

# 5. Genera la clave de la aplicación
php artisan key:generate

# 6. Ejecuta las migraciones de la base de datos (creará las tablas)
php artisan migrate

# 7. Inicia el servidor de Laravel
php artisan serve
