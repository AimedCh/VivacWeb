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
    setupFilters();
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
                name: 'Mirador del Alto de la Sierra',
                location: 'Tibi, España',
                lat: 38.6295,
                lng: -0.5167,
                rating: 4.5,
                reviews: 10
            },
            {
                name: 'Bosque de Pinos',
                location: 'Segovia, España',
                lat: 40.9429,
                lng: -4.1186,
                rating: 4.0,
                reviews: 8
            },
            {
                name: 'Lago de Montaña',
                location: 'Asturias, España',
                lat: 43.2627,
                lng: -5.0236,
                rating: 4.7,
                reviews: 15
            },
            {
                name: 'Playa Escondida',
                location: 'Málaga, España',
                lat: 36.7213,
                lng: -3.7345,
                rating: 4.6,
                reviews: 18
            },
            {
                name: 'Valle Verde',
                location: 'Navarra, España',
                lat: 42.8139,
                lng: -1.6432,
                rating: 4.8,
                reviews: 25
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
        });

        console.log('✅ Mapa inicializado correctamente');
    } catch (error) {
        console.error('❌ Error inicializando mapa:', error);
    }
}

// ============================================
// FILTROS
// ============================================

function setupFilters() {
    const filterBtn = document.getElementById('filterBtn');
    const filterModal = document.getElementById('filterModal');
    const filterModalOverlay = document.getElementById('filterModalOverlay');
    const filterCloseBtn = document.getElementById('filterCloseBtn');
    const filterResetBtn = document.getElementById('filterResetBtn');
    const filterApplyBtn = document.getElementById('filterApplyBtn');

    if (!filterBtn || !filterModal || !filterModalOverlay) return;

    // Abrir modal
    filterBtn.addEventListener('click', function() {
        filterModal.classList.add('active');
        filterModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Cerrar modal
    function closeFilterModal() {
        filterModal.classList.remove('active');
        filterModalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (filterCloseBtn) {
        filterCloseBtn.addEventListener('click', closeFilterModal);
    }

    filterModalOverlay.addEventListener('click', closeFilterModal);

    // Sliders de altitud
    const altitudeMinSlider = document.getElementById('altitudeMinSlider');
    const altitudeMaxSlider = document.getElementById('altitudeMaxSlider');
    const altitudeMinDisplay = document.getElementById('altitudeMin');
    const altitudeMaxDisplay = document.getElementById('altitudeMax');

    function updateAltitudeSliders() {
        if (!altitudeMinSlider || !altitudeMaxSlider) return;

        let minVal = parseInt(altitudeMinSlider.value);
        let maxVal = parseInt(altitudeMaxSlider.value);

        if (minVal > maxVal) {
            [minVal, maxVal] = [maxVal, minVal];
            altitudeMinSlider.value = minVal;
            altitudeMaxSlider.value = maxVal;
        }

        if (altitudeMinDisplay) altitudeMinDisplay.textContent = minVal;
        if (altitudeMaxDisplay) altitudeMaxDisplay.textContent = maxVal;
    }

    if (altitudeMinSlider && altitudeMaxSlider) {
        altitudeMinSlider.addEventListener('input', updateAltitudeSliders);
        altitudeMaxSlider.addEventListener('input', updateAltitudeSliders);
    }

    // Limpiar filtros
    if (filterResetBtn) {
        filterResetBtn.addEventListener('click', function() {
            if (altitudeMinSlider) altitudeMinSlider.value = 0;
            if (altitudeMaxSlider) altitudeMaxSlider.value = 100;
            updateAltitudeSliders();

            document.querySelectorAll('.checkbox-label input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });
        });
    }

    // Aplicar filtros
    if (filterApplyBtn) {
        filterApplyBtn.addEventListener('click', function() {
            const altitudeMin = altitudeMinSlider ? parseInt(altitudeMinSlider.value) : 0;
            const altitudeMax = altitudeMaxSlider ? parseInt(altitudeMaxSlider.value) : 100;

            const isolationFilters = Array.from(document.querySelectorAll('input[name="isolation"]:checked')).map(cb => cb.value);
            const difficultyFilters = Array.from(document.querySelectorAll('input[name="difficulty"]:checked')).map(cb => cb.value);

            console.log('✅ Filtros aplicados:', {
                altitud: { min: altitudeMin, max: altitudeMax },
                aislamiento: isolationFilters,
                dificultad: difficultyFilters
            });

            closeFilterModal();
            alert('Filtros aplicados: Altitud ' + altitudeMin + 'm - ' + altitudeMax + 'm');
        });
    }
}

// ============================================
// EJECUTAR CUANDO EL DOM ESTÉ LISTO
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

