const API_URL = 'http://localhost/400web/api/public/api/auth';

// Verificar autenticación
window.addEventListener('load', async function() {
    console.log('📄 Página cargada, verificando autenticación...');
    const token = localStorage.getItem('vivacweb_token');
    const user = localStorage.getItem('vivacweb_user');

    if (!token || !user) {
        console.warn('⚠️ No hay token o usuario, redirigiendo a login...');
        // No mostrar alerta, solo redirigir silenciosamente
        window.location.href = 'login.html';
        return;
    }

    console.log('✅ Token encontrado');

    // Cargar vivacs desde la API
    if (typeof loadVivacs === 'function') {
        await loadVivacs();
    }

    // Inicializar favoritos si la función existe
    if (typeof initializeFavorites === 'function') {
        initializeFavorites();
    }
});

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

function initializeApp() {
    console.log('🚀 Inicializando aplicación...');
    setupMenuToggle();
    setupLogout();
    setupMap();
}

// ============================================
// MENU TOGGLE (MOBILE)
// ============================================

function setupMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const headerNav = document.querySelector('.header-nav');

    if (!menuToggle || !headerNav) return;

    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        headerNav.classList.toggle('active');
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!headerNav.contains(e.target) && !menuToggle.contains(e.target)) {
            headerNav.classList.remove('active');
        }
    });
}

// ============================================
// LOGOUT
// ============================================

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    });
}

// ============================================
// FAVORITOS
// ============================================

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

// ============================================
// MAPA
// ============================================

let map = null;
let isMapView = false;

function setupMap() {
    const mapViewBtn = document.getElementById('mapViewBtn');
    const mapContainer = document.getElementById('mapContainer');
    const locationsContent = document.querySelector('.locations-content');

    if (!mapViewBtn || !mapContainer || !locationsContent) return;

    mapViewBtn.addEventListener('click', function() {
        isMapView = !isMapView;

        if (isMapView) {
            mapContainer.style.display = 'block';
            locationsContent.style.display = 'none';
            mapViewBtn.style.backgroundColor = '#2d7a4a';
            mapViewBtn.style.color = 'white';

            if (!map) {
                initializeMap();
            } else {
                map.invalidateSize();
            }
        } else {
            mapContainer.style.display = 'none';
            locationsContent.style.display = 'block';
            mapViewBtn.style.backgroundColor = 'white';
            mapViewBtn.style.color = '#2d7a4a';
        }
    });
}

async function initializeMap() {
    try {
        // Crear mapa centrado en España
        map = L.map('map').setView([40.4637, -3.7492], 6);

        // Agregar capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        // Traer todos los vivacs de la API
        console.log('📡 Obteniendo vivacs de la API...');
        const token = localStorage.getItem('vivacweb_token');

        // Agregar parámetros de paginación para obtener todos los vivacs
        const url = new URL('http://localhost:3001/vivacs');
        url.searchParams.append('page', '1');
        url.searchParams.append('limit', '100'); // Obtener hasta 100 vivacs

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la API: ${response.status}`);
        }

        const data = await response.json();

        // Manejar respuesta que puede ser un array o un objeto con data
        const vivacs = Array.isArray(data) ? data : (data.data || data.vivacs || []);
        console.log(`✅ Se obtuvieron ${vivacs.length} vivacs de la API`);

        // Procesar y agregar marcadores para cada vivac
        vivacs.forEach(vivac => {
            // Crear objeto de ubicación con datos de la API
            const location = {
                id: vivac.id,
                name: vivac.name,
                location: `${vivac.name}, España`, // Usar el nombre como ubicación
                lat: parseFloat(vivac.latitude),
                lng: parseFloat(vivac.longitude),
                rating: vivac.avgRating || 0,
                reviews: vivac.reviewCount || 0,
                image: vivac.photoUrls && vivac.photoUrls.length > 0
                    ? vivac.photoUrls[0]
                    : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                coordinates: `${vivac.latitude}, ${vivac.longitude}`,
                specifications: {
                    'Altitud': `${vivac.elevation}m`,
                    'Dificultad': vivac.accessDifficulty || 'No especificada',
                    'Tipo de terreno': vivac.terrainType || 'No especificado',
                    'Mascotas': vivac.petFriendly ? 'Sí' : 'No'
                },
                reviews_list: []
            };

            // Agregar marcador al mapa
            const marker = L.marker([location.lat, location.lng]).addTo(map);
            marker.bindPopup(`
                <div style="font-family: Inter, sans-serif; width: 200px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${location.name}</h3>
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${location.location}</p>
                    <div style="display: flex; align-items: center; gap: 4px; font-size: 12px;">
                        <i class="fas fa-star" style="color: #fbbf24;"></i>
                        <span style="font-weight: 600;">${location.rating.toFixed(1)}</span>
                        <span style="color: #999;">${location.reviews} reviews</span>
                    </div>
                </div>
            `);

            // Agregar evento click al marcador para mostrar la tarjeta detallada
            marker.on('click', function() {
                showVivacDetail(location);
            });
        });

        console.log('✅ Mapa inicializado correctamente con todos los vivacs');
    } catch (error) {
        console.error('❌ Error inicializando mapa:', error);
        alert('Error al cargar los vivacs en el mapa. Por favor, recarga la página.');
    }
}

// ============================================
// VIVAC DETAIL MODAL
// ============================================

function showVivacDetail(location) {
    const modal = document.getElementById('vivacDetailModal');

    // Llenar datos de la tarjeta
    document.getElementById('detailImage').src = location.image;
    document.getElementById('detailName').textContent = location.name;
    document.getElementById('detailLocation').textContent = location.location;
    document.getElementById('detailRating').textContent = location.rating;
    document.getElementById('detailReviews').textContent = `${location.reviews} reviews`;
    document.getElementById('detailCoordinates').textContent = location.coordinates;

    // Llenar especificaciones
    const specsList = document.getElementById('detailSpecifications');
    specsList.innerHTML = '';
    for (const [key, value] of Object.entries(location.specifications)) {
        const specItem = document.createElement('div');
        specItem.className = 'spec-item';
        specItem.innerHTML = `<span class="spec-label">${key}</span>${value}`;
        specsList.appendChild(specItem);
    }

    // Llenar reseñas
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '';
    if (location.reviews_list && location.reviews_list.length > 0) {
        location.reviews_list.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            const starsHTML = Array(5).fill(0).map((_, i) =>
                `<i class="fas fa-star" style="color: ${i < Math.floor(review.rating) ? '#fbbf24' : '#ddd'};"></i>`
            ).join('');
            reviewItem.innerHTML = `
                <div class="review-header">
                    <span class="review-author">${review.author}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">${starsHTML}</div>
                <p class="review-text">${review.text}</p>
            `;
            reviewsList.appendChild(reviewItem);
        });
    }

    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVivacDetail() {
    const modal = document.getElementById('vivacDetailModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ============================================
// EJECUTAR CUANDO EL DOM ESTÉ LISTO
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Configurar eventos del modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('vivacDetailModal');
    const closeBtn = document.getElementById('closeDetailBtn');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeVivacDetail);
    }

    // Cerrar modal al hacer clic fuera
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeVivacDetail();
            }
        });
    }

    // Configurar estrellas de rating
    const starsInput = document.getElementById('starsInput');
    if (starsInput) {
        const stars = starsInput.querySelectorAll('i');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.dataset.rating;
                document.getElementById('selectedRating').textContent = `${rating} estrellas`;

                stars.forEach(s => s.classList.remove('active'));
                for (let i = 0; i < rating; i++) {
                    stars[i].classList.add('active');
                }
            });

            star.addEventListener('mouseover', function() {
                const rating = this.dataset.rating;
                stars.forEach((s, index) => {
                    if (index < rating) {
                        s.style.color = '#fbbf24';
                    } else {
                        s.style.color = '#ddd';
                    }
                });
            });
        });

        starsInput.addEventListener('mouseleave', function() {
            stars.forEach(s => {
                if (s.classList.contains('active')) {
                    s.style.color = '#fbbf24';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
    }
});

// ============================================
// CARGAR VIVACS DESDE LA API
// ============================================

async function loadVivacs() {
    try {
        console.log('📡 Cargando vivacs desde la API...');
        const token = localStorage.getItem('vivacweb_token');

        // Agregar parámetros de paginación para obtener todos los vivacs
        const url = new URL('http://localhost:3001/vivacs');
        url.searchParams.append('page', '1');
        url.searchParams.append('limit', '100'); // Obtener hasta 100 vivacs

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la API: ${response.status}`);
        }

        const data = await response.json();

        // Manejar respuesta que puede ser un array o un objeto con data
        const vivacs = Array.isArray(data) ? data : (data.data || data.vivacs || []);
        console.log(`✅ Se obtuvieron ${vivacs.length} vivacs de la API`);

        // Renderizar tarjetas de vivacs
        renderVivacCards(vivacs);
    } catch (error) {
        console.error('❌ Error cargando vivacs:', error);
    }
}

function renderVivacCards(vivacs) {
    const locationsGrid = document.querySelector('.locations-grid');
    if (!locationsGrid) return;

    // Limpiar tarjetas existentes
    locationsGrid.innerHTML = '';

    // Crear tarjeta para cada vivac
    vivacs.forEach(vivac => {
        const card = document.createElement('div');
        card.className = 'location-card';

        const imageUrl = vivac.photoUrls && vivac.photoUrls.length > 0
            ? vivac.photoUrls[0]
            : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';

        const rating = vivac.avgRating || 0;
        const reviews = vivac.reviewCount || 0;

        card.innerHTML = `
            <div class="card-image">
                <img src="${imageUrl}" alt="${vivac.name}" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'">
                <button class="favorite-btn" title="Agregar a favoritos">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="card-content">
                <h3>${vivac.name}</h3>
                <p class="location-name">${vivac.name}, España</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>${rating.toFixed(1)}</span>
                    <span class="reviews">${reviews} reviews</span>
                </div>
            </div>
        `;

        // Agregar evento click para mostrar detalle
        card.addEventListener('click', function() {
            const location = {
                id: vivac.id,
                name: vivac.name,
                location: `${vivac.name}, España`,
                lat: parseFloat(vivac.latitude),
                lng: parseFloat(vivac.longitude),
                rating: rating,
                reviews: reviews,
                image: imageUrl,
                coordinates: `${vivac.latitude}, ${vivac.longitude}`,
                specifications: {
                    'Altitud': `${vivac.elevation}m`,
                    'Dificultad': vivac.accessDifficulty || 'No especificada',
                    'Tipo de terreno': vivac.terrainType || 'No especificado',
                    'Mascotas': vivac.petFriendly ? 'Sí' : 'No'
                },
                reviews_list: []
            };
            showVivacDetail(location);
        });

        locationsGrid.appendChild(card);
    });

    // Reinicializar favoritos
    if (typeof initializeFavorites === 'function') {
        initializeFavorites();
    }
}
