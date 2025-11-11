const API_URL = 'http://localhost/400web/api/public/api/auth';

// Verificar autenticación
window.addEventListener('load', async function() {
    const token = localStorage.getItem('vivacweb_token');
    const user = localStorage.getItem('vivacweb_user');

    if (!token || !user) {
        alert('Debes iniciar sesión primero');
        window.location.href = 'login.html';
        return;
    }

    try {
        // Obtener usuario del backend
        const response = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!data.success) {
            alert('Sesión expirada. Por favor inicia sesión de nuevo');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error:', error);
    }

    // Inicializar favoritos
    initializeFavorites();
});

// Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const closeMenu = document.getElementById('closeMenu');

menuToggle.addEventListener('click', function() {
    sidebar.classList.add('active');
    closeMenu.classList.add('show');
});

closeMenu.addEventListener('click', function() {
    sidebar.classList.remove('active');
    closeMenu.classList.remove('show');
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', function(event) {
    if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
        sidebar.classList.remove('active');
        closeMenu.classList.remove('show');
    }
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        if (window.innerWidth < 1024) {
            sidebar.classList.remove('active');
            closeMenu.classList.remove('show');
        }
    });
});

// Logout Button
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', function() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('vivacweb_token');
        localStorage.removeItem('vivacweb_user');
        window.location.href = 'login.html';
    }
});

// Favoritos
function initializeFavorites() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    const favorites = JSON.parse(localStorage.getItem('vivacweb_favorites') || '[]');

    favoriteButtons.forEach((btn, index) => {
        if (favorites.includes(index)) {
            btn.classList.add('liked');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        }

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (btn.classList.contains('liked')) {
                btn.classList.remove('liked');
                btn.innerHTML = '<i class="far fa-heart"></i>';
                favorites.splice(favorites.indexOf(index), 1);
            } else {
                btn.classList.add('liked');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
                favorites.push(index);
            }

            localStorage.setItem('vivacweb_favorites', JSON.stringify(favorites));
        });
    });
}

// Map Functionality
let map = null;
let isMapView = false;

const mapViewBtn = document.getElementById('mapViewBtn');
const filterBtn = document.getElementById('filterBtn');
const mapContainer = document.getElementById('mapContainer');
const locationsSection = document.querySelectorAll('.locations-section');

// Datos de ejemplo de ubicaciones
const locationsData = [
    {
        name: 'Mirador del Alto de la Sierra',
        location: 'Tibi, España',
        lat: 38.6295,
        lng: -0.5167,
        rating: 4.5,
        reviews: 10
    },
    {
        name: 'Mirador del Alto',
        location: 'Tibi, España',
        lat: 38.6300,
        lng: -0.5160,
        rating: 4.0,
        reviews: 8
    },
    {
        name: 'Sitio Popular 1',
        location: 'España',
        lat: 40.4168,
        lng: -3.7038,
        rating: 4.8,
        reviews: 25
    },
    {
        name: 'Sitio Popular 2',
        location: 'España',
        lat: 41.3851,
        lng: 2.1734,
        rating: 4.6,
        reviews: 18
    }
];

mapViewBtn.addEventListener('click', function() {
    isMapView = !isMapView;

    if (isMapView) {
        // Mostrar mapa
        mapContainer.style.display = 'block';
        locationsSection.forEach(section => {
            section.style.display = 'none';
        });
        mapViewBtn.style.backgroundColor = '#2d7a4a';
        mapViewBtn.style.color = 'white';

        // Inicializar mapa si no existe
        if (!map) {
            initializeMap();
        } else {
            map.invalidateSize();
        }
    } else {
        // Mostrar lista
        mapContainer.style.display = 'none';
        locationsSection.forEach(section => {
            section.style.display = 'block';
        });
        mapViewBtn.style.backgroundColor = 'white';
        mapViewBtn.style.color = '#2d7a4a';
    }
});

function initializeMap() {
    // Crear mapa centrado en España
    map = L.map('map').setView([40.4637, -3.7492], 6);

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Agregar marcadores para cada ubicación
    locationsData.forEach(location => {
        const marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup(`
            <div style="font-family: Inter, sans-serif; width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${location.name}</h3>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${location.location}</p>
                <div style="display: flex; align-items: center; gap: 4px; font-size: 12px;">
                    <i class="fas fa-star" style="color: #fbbf24;"></i>
                    <span style="font-weight: 600;">${location.rating}</span>
                    <span style="color: #999;">${location.reviews} reviews</span>
                </div>
            </div>
        `);
    });
}

filterBtn.addEventListener('click', function() {
    alert('Filtros - Próximamente');
});

