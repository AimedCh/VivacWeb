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

function initializeMap() {
    try {
        // Crear mapa centrado en España
        map = L.map('map').setView([40.4637, -3.7492], 6);

        // Agregar capa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        // Datos de ubicaciones
        const locationsData = [
            {
                id: 1,
                name: 'Mirador del Alto de la Sierra',
                location: 'Tibi, España',
                lat: 38.6295,
                lng: -0.5167,
                rating: 4.5,
                reviews: 10,
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
                coordinates: '38.6295, -0.5167',
                specifications: {
                    'Altitud': '850m',
                    'Aislamiento': 'Alto',
                    'Dificultad': 'Media',
                    'Agua': 'Sí'
                },
                reviews_list: [
                    {
                        author: 'Carmen',
                        rating: 4.5,
                        date: '28/02/2025',
                        text: 'Lugar increíble con vistas espectaculares. Muy recomendado.'
                    }
                ]
            },
            {
                id: 2,
                name: 'Bosque de Pinos',
                location: 'Segovia, España',
                lat: 40.9429,
                lng: -4.1186,
                rating: 4.0,
                reviews: 8,
                image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
                coordinates: '40.9429, -4.1186',
                specifications: {
                    'Altitud': '1200m',
                    'Aislamiento': 'Medio',
                    'Dificultad': 'Fácil',
                    'Agua': 'No'
                },
                reviews_list: [
                    {
                        author: 'Juan',
                        rating: 4.0,
                        date: '15/02/2025',
                        text: 'Bosque tranquilo y bien conservado.'
                    }
                ]
            },
            {
                id: 3,
                name: 'Lago de Montaña',
                location: 'Asturias, España',
                lat: 43.2627,
                lng: -5.0236,
                rating: 4.7,
                reviews: 15,
                image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=300&fit=crop',
                coordinates: '43.2627, -5.0236',
                specifications: {
                    'Altitud': '1500m',
                    'Aislamiento': 'Muy Alto',
                    'Dificultad': 'Difícil',
                    'Agua': 'Sí'
                },
                reviews_list: [
                    {
                        author: 'María',
                        rating: 4.7,
                        date: '10/02/2025',
                        text: 'Hermoso lago de montaña. Acceso un poco complicado pero vale la pena.'
                    }
                ]
            },
            {
                id: 4,
                name: 'Playa Escondida',
                location: 'Málaga, España',
                lat: 36.7213,
                lng: -3.7345,
                rating: 4.6,
                reviews: 18,
                image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
                coordinates: '36.7213, -3.7345',
                specifications: {
                    'Altitud': '50m',
                    'Aislamiento': 'Bajo',
                    'Dificultad': 'Fácil',
                    'Agua': 'Sí'
                },
                reviews_list: [
                    {
                        author: 'Pedro',
                        rating: 4.6,
                        date: '05/02/2025',
                        text: 'Playa perfecta para relajarse. Muy bonita al atardecer.'
                    }
                ]
            },
            {
                id: 5,
                name: 'Valle Verde',
                location: 'Navarra, España',
                lat: 42.8139,
                lng: -1.6432,
                rating: 4.8,
                reviews: 25,
                image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
                coordinates: '42.8139, -1.6432',
                specifications: {
                    'Altitud': '900m',
                    'Aislamiento': 'Alto',
                    'Dificultad': 'Media',
                    'Agua': 'Sí'
                },
                reviews_list: [
                    {
                        author: 'Ana',
                        rating: 4.8,
                        date: '01/02/2025',
                        text: 'Valle hermoso con mucha naturaleza. Ideal para desconectar.'
                    }
                ]
            }
        ];

        // Agregar marcadores
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

            // Agregar evento click al marcador para mostrar la tarjeta detallada
            marker.on('click', function() {
                showVivacDetail(location);
            });
        });

        console.log('✅ Mapa inicializado correctamente');
    } catch (error) {
        console.error('❌ Error inicializando mapa:', error);
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

