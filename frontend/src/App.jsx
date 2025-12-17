import { useEffect, useState, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "./auth.css";

const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://vivac-backend-production.up.railway.app"
    : "/api";
const GOOGLE_CLIENT_ID =
  "163427094311-tb8bdn1pvplem6dnlb1c8lcjo7ap8coo.apps.googleusercontent.com";

const vivacMarkerIcon = L.divIcon({
  className: "vivac-marker",
  html: '<div class="vivac-marker-inner"><span class="material-symbols-outlined">camping</span></div>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function CreateVivacLocationMarker({ position, onPositionChange }) {
  useMapEvents({
    click(event) {
      if (onPositionChange) {
        onPositionChange([event.latlng.lat, event.latlng.lng]);
      }
    },
  });

  return <Marker position={position} icon={vivacMarkerIcon} />;
}

function ExploreVivacMarker({ spot, onMarkerClick }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.on("click", () => {
        if (onMarkerClick) {
          onMarkerClick(spot);
        }
      });
    }
  }, [spot, onMarkerClick]);

  return (
    <Marker ref={markerRef} position={spot.position} icon={vivacMarkerIcon} />
  );
}

function HomeScreen({ onLogout, onNavigate, spots = [] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    setIsLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutDialogOpen(false);
    onLogout();
  };

  const nearbySpots =
    spots.length > 0
      ? spots.slice(0, 2)
      : [
          {
            id: 1,
            title: "Mirador del Alto de la Sierra",
            location: "Tibi, España",
            rating: "4.5",
            reviews: "10 reviews",
          },
          {
            id: 2,
            title: "Mirador del Alto",
            location: "Tibi, España",
            rating: "4.0",
            reviews: "4 reviews",
          },
        ];

  const popularSpots =
    spots.length > 2
      ? spots.slice(2, 4)
      : [
          {
            id: 3,
            title: "Refugio del Bosque",
            location: "Pirineos, España",
            rating: "4.8",
            reviews: "32 reviews",
          },
          {
            id: 4,
            title: "Playa Salvaje",
            location: "Asturias, España",
            rating: "4.7",
            reviews: "18 reviews",
          },
        ];

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-logo">
          <img src="/logo.png" alt="Logo Vivac" />
        </div>
        <button
          type="button"
          className="home-menu-button"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <span className="home-menu-button-bar" />
          <span className="home-menu-button-bar" />
          <span className="home-menu-button-bar" />
        </button>
      </header>

      <main className="home-main">
        <h1 className="home-title">
          Descubre los mejores sitios
          <br />
          para hacer vivac
        </h1>

        <div className="home-search">
          <span className="home-search-icon material-symbols-outlined">
            search
          </span>
          <input
            type="search"
            placeholder="Buscar una localización..."
            aria-label="Buscar una localización"
          />
        </div>

        <section className="home-section">
          <h2 className="home-section-title">Cerca de ti</h2>
          <div className="home-carousel">
            {nearbySpots.map((spot) => (
              <article
                key={spot.id}
                className="spot-card"
                onClick={() => onNavigate("vivacDetail", spot)}
                role="button"
                tabIndex={0}
              >
                <div className="spot-card-image" />
                <div className="spot-card-body">
                  <h3 className="spot-card-title">{spot.title}</h3>
                  <p className="spot-card-location">{spot.location}</p>
                  <div className="spot-card-meta">
                    <span className="spot-card-rating">★ {spot.rating}</span>
                    <span className="spot-card-reviews">{spot.reviews}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section">
          <h2 className="home-section-title">Popular entre los usuarios</h2>
          <div className="home-carousel">
            {popularSpots.map((spot) => (
              <article
                key={spot.id}
                className="spot-card"
                onClick={() => onNavigate("vivacDetail", spot)}
                role="button"
                tabIndex={0}
              >
                <div className="spot-card-image spot-card-image-alt" />
                <div className="spot-card-body">
                  <h3 className="spot-card-title">{spot.title}</h3>
                  <p className="spot-card-location">{spot.location}</p>
                  <div className="spot-card-meta">
                    <span className="spot-card-rating">★ {spot.rating}</span>
                    <span className="spot-card-reviews">{spot.reviews}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {isMenuOpen && (
        <div className="home-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div
            className="home-menu-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="home-menu-header">
              <img
                src="/logo.png"
                alt="Logo Vivac"
                className="home-menu-logo"
              />
              <button
                type="button"
                className="home-menu-close material-symbols-outlined"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                close
              </button>
            </div>
            <nav className="home-menu-nav">
              <button
                type="button"
                className="home-menu-item home-menu-item-active"
                onClick={() => {
                  if (onNavigate) onNavigate("home");
                  setIsMenuOpen(false);
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">
                  home
                </span>
                <span>Home</span>
              </button>
              <button
                type="button"
                className="home-menu-item"
                onClick={() => {
                  if (onNavigate) onNavigate("explore");
                  setIsMenuOpen(false);
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">
                  explore
                </span>
                <span>Explorar</span>
              </button>
              <button
                type="button"
                className="home-menu-item"
                onClick={() => {
                  if (onNavigate) onNavigate("createVivac");
                  setIsMenuOpen(false);
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">
                  camping
                </span>
                <span>Crear vivac</span>
              </button>
              <button
                type="button"
                className="home-menu-item"
                onClick={() => {
                  if (onNavigate) onNavigate("community");
                  setIsMenuOpen(false);
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">
                  groups
                </span>
                <span>Comunidad</span>
              </button>
              <button
                type="button"
                className="home-menu-item"
                onClick={() => {
                  if (onNavigate) onNavigate("profile");
                  setIsMenuOpen(false);
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">
                  person
                </span>
                <span>Perfil</span>
              </button>
            </nav>

            <div className="home-menu-footer">
              <button
                type="button"
                className="home-menu-secondary"
                onClick={() => {
                  if (onNavigate) onNavigate("settings");
                  setIsMenuOpen(false);
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">
                  settings
                </span>
                <span>Ajustes</span>
              </button>
              <button
                type="button"
                className="home-menu-secondary home-menu-logout"
                onClick={handleLogoutClick}
              >
                <span className="home-menu-icon material-symbols-outlined">
                  logout
                </span>
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isLogoutDialogOpen && (
        <div className="settings-dialog-overlay" onClick={() => setIsLogoutDialogOpen(false)}>
          <div className="settings-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="settings-dialog-title">¿Cerrar sesión?</h3>
            <p className="settings-dialog-text">¿Estás seguro de que quieres cerrar sesión?</p>
            <div className="settings-dialog-actions">
              <button
                type="button"
                className="settings-dialog-btn settings-dialog-btn-cancel"
                onClick={() => setIsLogoutDialogOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="settings-dialog-btn settings-dialog-btn-confirm"
                onClick={handleConfirmLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExploreScreen({ onLogout, onNavigate, spots, savedVivacIds = [], onToggleSave }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mode, setMode] = useState("list"); // 'list' | 'map'
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState("default");
  const [mapInstance, setMapInstance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [altitudeMin, setAltitudeMin] = useState(0);
  const [altitudeMax, setAltitudeMax] = useState(100);
  const [distance, setDistance] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingMapCenter, setPendingMapCenter] = useState(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    setIsLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutDialogOpen(false);
    onLogout();
  };

  const handleToggleLayer = () => {
    setSelectedLayer((previous) =>
      previous === "default" ? "relief" : "default"
    );
  };

  const handleLocateMe = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      console.warn("Geolocalización no soportada en este navegador/contexto");
      if (typeof window !== "undefined") {
        window.alert(
          "La geolocalización no está disponible en este navegador o contexto."
        );
      }
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nextLocation = { lat: latitude, lng: longitude };
        setUserLocation(nextLocation);
        if (mapInstance) {
          mapInstance.flyTo([latitude, longitude], 15, {
            duration: 1.5,
            easeLinearity: 0.25
          });
        }
        console.log("Geolocalización correcta", nextLocation);
        setIsLocating(false);
      },
      (error) => {
        console.warn("Error al obtener geolocalización", error);
        if (typeof window !== "undefined") {
          window.alert(
            "No se ha podido obtener tu ubicación. Revisa los permisos de localización del navegador."
          );
        }
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (mapInstance && userLocation) {
      mapInstance.setView([userLocation.lat, userLocation.lng], 14);
    }
  }, [mapInstance, userLocation]);

  useEffect(() => {
    if (mapInstance && pendingMapCenter) {
      mapInstance.setView([pendingMapCenter.lat, pendingMapCenter.lng], 11);
      setPendingMapCenter(null);
    }
  }, [mapInstance, pendingMapCenter]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const rawQuery = searchQuery.trim();
    if (!rawQuery) {
      return;
    }
    const query = rawQuery.toLowerCase();

    const matchedSpot = spots.find((spot) => {
      const title = spot.title.toLowerCase();
      const location = spot.location.toLowerCase();
      return title.includes(query) || location.includes(query);
    });

    if (!matchedSpot) {
      if (typeof window !== "undefined") {
        window.alert(
          "No se ha encontrado ningún vivac con ese nombre o localización."
        );
      }
      return;
    }

    const [lat, lng] = matchedSpot.position;
    if (mapInstance) {
      setMode("map");
      mapInstance.setView([lat, lng], 13);
    } else {
      setPendingMapCenter({ lat, lng });
      setMode("map");
    }
  };

  const handleAltitudeMinChange = (event) => {
    const value = Number(event.target.value);
    setAltitudeMin((current) => Math.min(value, altitudeMax - 1));
  };

  const handleAltitudeMaxChange = (event) => {
    const value = Number(event.target.value);
    setAltitudeMax((current) => Math.max(value, altitudeMin + 1));
  };

  const formatAltitudeLabel = (value) => `${Math.round((value / 100) * 3500)}m`;
  const formatDistanceLabel = (value) => `${Math.round((value / 100) * 50)} km`;

  return (
    <div className="explore-page">
      <header className="home-header">
        <div className="home-logo">
          <img src="/logo.png" alt="Logo Vivac" />
        </div>
        <button
          type="button"
          className="home-menu-button"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <span className="home-menu-button-bar" />
          <span className="home-menu-button-bar" />
          <span className="home-menu-button-bar" />
        </button>
      </header>

      <main className="explore-main">
        <form className="home-search" onSubmit={handleSearchSubmit}>
          <button
            type="submit"
            className="home-search-icon material-symbols-outlined"
            aria-label="Buscar en el mapa"
          >
            search
          </button>
          <input
            type="search"
            placeholder="Buscar una localización..."
            aria-label="Buscar una localización"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </form>

        <div className="explore-toggle-row">
          {mode === "list" ? (
            <>
              <button
                type="button"
                className="explore-toggle-button"
                onClick={() => setMode("map")}
              >
                <span className="explore-toggle-button-icon material-symbols-outlined">
                  map
                </span>
                <span>Ver mapa</span>
              </button>
              <button
                type="button"
                className="explore-toggle-button explore-toggle-button-secondary"
                onClick={() => setIsFiltersOpen(true)}
              >
                <span className="explore-toggle-button-icon material-symbols-outlined">
                  tune
                </span>
                <span>Filtros</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="explore-toggle-button"
                onClick={() => setMode("list")}
              >
                <span className="explore-toggle-button-icon material-symbols-outlined">
                  list
                </span>
                <span>Ver lista</span>
              </button>
              <button
                type="button"
                className="explore-toggle-button explore-toggle-button-secondary"
                onClick={() => setIsFiltersOpen(true)}
              >
                <span className="explore-toggle-button-icon material-symbols-outlined">
                  tune
                </span>
                <span>Filtros</span>
              </button>
            </>
          )}
        </div>

        {mode === "list" ? (
          <section className="explore-list">
            {spots.map((spot) => (
              <article
                key={spot.id}
                className="explore-card"
                onClick={() => onNavigate("vivacDetail", spot)}
                role="button"
                tabIndex={0}
              >
                <div className="explore-card-image">
                  {spot.photoUrls && spot.photoUrls.length > 0 ? (
                    <img
                      src={spot.photoUrls[0]}
                      alt={spot.title}
                      className="explore-card-img"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className="explore-card-placeholder"
                    style={{ display: spot.photoUrls && spot.photoUrls.length > 0 ? 'none' : 'flex' }}
                  >
                    <span className="material-symbols-outlined">landscape</span>
                  </div>
                  <button
                    type="button"
                    className={`explore-card-favorite ${savedVivacIds.includes(spot.id) ? 'saved' : ''}`}
                    aria-label="Guardar en favoritos"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSave && onToggleSave(spot.id);
                    }}
                  >
                    <span className="material-symbols-outlined">
                      {savedVivacIds.includes(spot.id) ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>
                </div>
                <div className="explore-card-body">
                  <h2 className="explore-card-title">{spot.title}</h2>
                  <p className="explore-card-location">{spot.location}</p>
                  <div className="explore-card-meta">
                    <span className="explore-card-rating">
                      <span className="explore-card-rating-icon material-symbols-outlined">
                        star
                      </span>
                      {spot.rating}
                    </span>
                    <span className="explore-card-reviews">{spot.reviews}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="explore-map-wrapper">
            <MapContainer
              center={[38.64, -0.33]}
              zoom={11}
              scrollWheelZoom={false}
              className="explore-map"
              whenCreated={setMapInstance}
            >
              {selectedLayer === "default" ? (
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
              ) : (
                <TileLayer
                  url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)"
                />
              )}
              {spots.map((spot) => (
                <ExploreVivacMarker
                  key={spot.id}
                  spot={spot}
                  onMarkerClick={() => onNavigate("vivacDetail", spot)}
                />
              ))}
              {userLocation && (
                <CircleMarker
                  center={[userLocation.lat, userLocation.lng]}
                  radius={8}
                  pathOptions={{
                    color: "#b91c1c",
                    weight: 3,
                    fillColor: "#ef4444",
                    fillOpacity: 0.95,
                  }}
                />
              )}
            </MapContainer>

            <div className="explore-map-fab-column">
              <button
                type="button"
                className="explore-map-fab"
                onClick={handleToggleLayer}
                aria-label="Cambiar capa del mapa"
              >
                <span className="material-symbols-outlined">layers</span>
              </button>
              <button
                type="button"
                className="explore-map-fab"
                onClick={handleLocateMe}
                disabled={isLocating}
                aria-label="Localizar mi posición"
              >
                <span className="material-symbols-outlined">
                  {isLocating ? "hourglass_top" : "my_location"}
                </span>
              </button>
              <button
                type="button"
                className="explore-map-fab"
                aria-label="Crear nuevo punto de vivac"
                onClick={() => {
                  if (onNavigate) onNavigate("createVivac");
                }}
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {isMenuOpen && (
        <div className="home-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div
            className="home-menu-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="home-menu-header">
              <img
                src="/logo.png"
                alt="Logo Vivac"
                className="home-menu-logo"
              />
              <button
                type="button"
                className="home-menu-close material-symbols-outlined"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                close
              </button>
            </div>
            <nav className="home-menu-nav">
              <button
                type="button"
                className="home-menu-item"
                onClick={() => {
                  if (onNavigate) onNavigate("home");
                  setIsMenuOpen(false);
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">
                  home
                </span>
                <span>Home</span>
              </button>
              <button
                type="button"
                className="home-menu-item home-menu-item-active"
              >
                <span className="home-menu-icon material-symbols-outlined">
                  explore
                </span>
                <span>Explorar</span>
              </button>
              <button
                type="button"
                className="home-menu-item"
                onClick={() => {
                  if (onNavigate) onNavigate("createVivac");
                  setIsMenuOpen(false);
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">
                  camping
                </span>
                <span>Crear vivac</span>
              </button>
              <button
                type="button"
                className="home-menu-item"
                onClick={() => {
                  if (onNavigate) onNavigate("community");
                  setIsMenuOpen(false);
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">
                  groups
                </span>
                <span>Comunidad</span>
              </button>
              <button
                type="button"
                className="home-menu-item"
                onClick={() => {
                  if (onNavigate) onNavigate("profile");
                  setIsMenuOpen(false);
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">
                  person
                </span>
                <span>Perfil</span>
              </button>
            </nav>

            <div className="home-menu-footer">
              <button
                type="button"
                className="home-menu-secondary"
                onClick={() => {
                  if (onNavigate) onNavigate("settings");
                  setIsMenuOpen(false);
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">
                  settings
                </span>
                <span>Ajustes</span>
              </button>
              <button
                type="button"
                className="home-menu-secondary home-menu-logout"
                onClick={handleLogoutClick}
              >
                <span className="home-menu-icon material-symbols-outlined">
                  logout
                </span>
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isLogoutDialogOpen && (
        <div className="settings-dialog-overlay" onClick={() => setIsLogoutDialogOpen(false)}>
          <div className="settings-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="settings-dialog-title">¿Cerrar sesión?</h3>
            <p className="settings-dialog-text">¿Estás seguro de que quieres cerrar sesión?</p>
            <div className="settings-dialog-actions">
              <button
                type="button"
                className="settings-dialog-btn settings-dialog-btn-cancel"
                onClick={() => setIsLogoutDialogOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="settings-dialog-btn settings-dialog-btn-confirm"
                onClick={handleConfirmLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {isFiltersOpen && (
        <div
          className="filters-overlay"
          onClick={() => setIsFiltersOpen(false)}
        >
          <div
            className="filters-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="filters-header">
              <h2 className="filters-title">Filtros</h2>
              <button
                type="button"
                className="filters-close material-symbols-outlined"
                onClick={() => setIsFiltersOpen(false)}
                aria-label="Cerrar filtros"
              >
                close
              </button>
            </div>

            <section className="filters-section">
              <h3 className="filters-section-label">Altitud</h3>
              <div className="filters-range-header">
                <span>{formatAltitudeLabel(altitudeMin)}</span>
                <span>{formatAltitudeLabel(altitudeMax)}</span>
              </div>
              <div className="filters-range">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={altitudeMin}
                  onChange={handleAltitudeMinChange}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={altitudeMax}
                  onChange={handleAltitudeMaxChange}
                />
              </div>
              <div className="filters-range-footer">
                <span>0m</span>
                <span>3.500m</span>
              </div>
            </section>

            <section className="filters-section">
              <h3 className="filters-section-label">Distancia</h3>
              <div className="filters-range-header">
                <span>{formatDistanceLabel(distance)}</span>
              </div>
              <div className="filters-range">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={distance}
                  onChange={(event) => setDistance(Number(event.target.value))}
                />
              </div>
            </section>

            <section className="filters-section">
              <h3 className="filters-section-label">Aislamiento</h3>
              <div className="filters-checklist">
                {[
                  "Población cerca",
                  "Ligeramente aislado",
                  "Muy aislado",
                  "Remoto",
                ].map((label) => (
                  <label key={label} className="filters-checkbox">
                    <input type="checkbox" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="filters-section">
              <h3 className="filters-section-label">Dificultad</h3>
              <div className="filters-checklist">
                {["Sencilla", "Moderada", "Difícil"].map((label) => (
                  <label key={label} className="filters-checkbox">
                    <input type="checkbox" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </section>

            <div className="filters-actions">
              <button
                type="button"
                className="filters-apply-button"
                onClick={() => setIsFiltersOpen(false)}
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateVivacScreen({ onClose, onCreateVivac, existingSpots }) {
  const [step, setStep] = useState(1);

  const [locationQuery, setLocationQuery] = useState("");
  const [vivacPosition, setVivacPosition] = useState([38.64, -0.33]);
  const [locationMapInstance, setLocationMapInstance] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const [startPoint, setStartPoint] = useState("");
  const [accessDifficulty, setAccessDifficulty] = useState("");
  const [terrainTypes, setTerrainTypes] = useState([]);
  const [climateExposure, setClimateExposure] = useState("");
  const [adventureTags, setAdventureTags] = useState([]);
  const [equipmentItems, setEquipmentItems] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isPrivate, setIsPrivate] = useState(false);

  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [openField, setOpenField] = useState(null);

  useEffect(() => {
    if (locationMapInstance && vivacPosition) {
      locationMapInstance.setView(vivacPosition, 13);
    }
  }, [locationMapInstance, vivacPosition]);

  // Cleanup: destruir la instancia del mapa cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (locationMapInstance) {
        locationMapInstance.remove();
        setLocationMapInstance(null);
      }
    };
  }, [locationMapInstance]);

  const handleLocateHere = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      if (typeof window !== "undefined") {
        window.alert(
          "La geolocalización no está disponible en este navegador o contexto."
        );
      }
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nextPosition = [latitude, longitude];
        setVivacPosition(nextPosition);
        setIsLocating(false);
      },
      (error) => {
        console.warn("Error al obtener geolocalización", error);
        if (typeof window !== "undefined") {
          window.alert(
            "No se ha podido obtener tu ubicación. Revisa los permisos de localización del navegador."
          );
        }
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleLocationSearchSubmit = (event) => {
    event.preventDefault();
    const rawQuery = locationQuery.trim();
    if (!rawQuery) {
      return;
    }
    const query = rawQuery.toLowerCase();

    const baseSpots = Array.isArray(existingSpots) ? existingSpots : [];
    const matchedSpot = baseSpots.find((spot) => {
      const title = (spot.title || "").toLowerCase();
      const location = (spot.location || "").toLowerCase();
      return title.includes(query) || location.includes(query);
    });

    if (!matchedSpot) {
      if (typeof window !== "undefined") {
        window.alert(
          "No se ha encontrado ningún vivac con ese nombre o localización."
        );
      }
      return;
    }

    const position = matchedSpot.position;
    if (!Array.isArray(position) || position.length !== 2) {
      return;
    }
    const [lat, lng] = position;
    const nextPosition = [lat, lng];
    setVivacPosition(nextPosition);
    if (locationMapInstance) {
      locationMapInstance.setView(nextPosition, 13);
    }
  };

  const toggleTerrainType = (value) => {
    setTerrainTypes((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const toggleAdventureTag = (value) => {
    setAdventureTags((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const toggleEquipmentItem = (value) => {
    setEquipmentItems((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const toggleFieldOpen = (field) => {
    setOpenField((current) => (current === field ? null : field));
  };

  const resetAllStates = () => {
    // Resetear todos los estados del formulario
    setStep(1);
    setLocationQuery("");
    setVivacPosition([38.64, -0.33]);
    setIsLocating(false);
    setStartPoint("");
    setAccessDifficulty("");
    setTerrainTypes([]);
    setClimateExposure("");
    setAdventureTags([]);
    setEquipmentItems([]);
    setTitle("");
    setDescription("");
    setPhotos([]);
    setIsPrivate(false);
    setIsExitDialogOpen(false);
    setOpenField(null);

    // Limpiar la instancia del mapa
    if (locationMapInstance) {
      locationMapInstance.remove();
      setLocationMapInstance(null);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    const trimmedTitle = title.trim();
    const baseLocation = locationQuery.trim() || startPoint.trim();
    const trimmedLocation = baseLocation;
    const vivacData = {
      title: trimmedTitle || "Punto vivac sin título",
      location: trimmedLocation || "Ubicación sin nombre",
      position: vivacPosition,
      accessDifficulty,
      terrainType: terrainTypes,
      climateExposure,
      adventureNotes: adventureTags,
      equipment: equipmentItems,
      isPrivate,
    };

    if (onCreateVivac) {
      onCreateVivac(vivacData);
    }

    if (typeof window !== "undefined") {
      window.alert("Punto vivac creado.");
    }

    // Resetear estados antes de cerrar
    resetAllStates();

    if (onClose) {
      onClose();
    }
  };

  const handleOpenExit = () => {
    setIsExitDialogOpen(true);
  };

  const handleExitAction = (action) => {
    if (action === "continue") {
      setIsExitDialogOpen(false);
      return;
    }
    if (action === "save") {
      setIsExitDialogOpen(false);
      resetAllStates();
      if (onClose) {
        onClose();
      }
      return;
    }
    if (action === "discard") {
      setIsExitDialogOpen(false);
      resetAllStates();
      if (onClose) {
        onClose();
      }
    }
  };

  const handlePhotosChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length) {
      setPhotos(files);
    }
  };

  const renderStep1 = () => (
    <section className="create-vivac-step">
      <p className="create-vivac-step-label">Step 1</p>
      <h2 className="create-vivac-step-title">Añadir ubicación</h2>

      <form
        className="create-vivac-search"
        onSubmit={handleLocationSearchSubmit}
      >
        <span className="material-symbols-outlined">search</span>
        <input
          type="search"
          placeholder="Plá de la casa"
          value={locationQuery}
          onChange={(event) => setLocationQuery(event.target.value)}
        />
      </form>

      <div className="create-vivac-map-wrapper">
        <MapContainer
          center={vivacPosition}
          zoom={13}
          scrollWheelZoom={false}
          className="create-vivac-map"
          whenCreated={setLocationMapInstance}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <CreateVivacLocationMarker
            position={vivacPosition}
            onPositionChange={setVivacPosition}
          />
        </MapContainer>

        <button
          type="button"
          className="create-vivac-locate-fab"
          onClick={handleLocateHere}
          disabled={isLocating}
          aria-label="Localizar mi posición"
        >
          <span className="material-symbols-outlined">
            {isLocating ? "hourglass_top" : "my_location"}
          </span>
        </button>
      </div>

      <button
        type="button"
        className="create-vivac-primary-cta"
        onClick={handleNext}
      >
        Continuar
      </button>
    </section>
  );

  const renderStep2 = () => (
    <section className="create-vivac-step">
      <p className="create-vivac-step-label">Step 2</p>
      <h2 className="create-vivac-step-title">Detalles del vivac</h2>

      <label className="create-vivac-label" htmlFor="vivac-start-point">
        ¿Desde dónde has partido?
      </label>
      <div className="create-vivac-field">
        <input
          id="vivac-start-point"
          type="text"
          placeholder="Indica el punto de partida"
          value={startPoint}
          onChange={(event) => setStartPoint(event.target.value)}
        />
      </div>

      <label className="create-vivac-label">
        Dificultad de acceso al punto vivac
      </label>
      <button
        type="button"
        className="create-vivac-field create-vivac-field-with-chevron"
        onClick={() => toggleFieldOpen("difficulty")}
      >
        <span>{accessDifficulty || "Dificultad de acceso al punto vivac"}</span>
        <span className="material-symbols-outlined">
          {openField === "difficulty" ? "expand_less" : "expand_more"}
        </span>
      </button>
      {openField === "difficulty" && (
        <div className="create-vivac-dropdown-panel">
          {["Fácil", "Moderado", "Difícil"].map((option) => (
            <button
              key={option}
              type="button"
              className="create-vivac-dropdown-option"
              onClick={() => {
                setAccessDifficulty(option);
                setOpenField(null);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <label className="create-vivac-label">Indica el tipo de terreno</label>
      <button
        type="button"
        className="create-vivac-field create-vivac-field-with-chevron"
        onClick={() => toggleFieldOpen("terrain")}
      >
        <span>
          {terrainTypes.length
            ? terrainTypes.join(", ")
            : "Indica el tipo de terreno"}
        </span>
        <span className="material-symbols-outlined">
          {openField === "terrain" ? "expand_less" : "expand_more"}
        </span>
      </button>
      {openField === "terrain" && (
        <div className="create-vivac-dropdown-panel">
          <div className="create-vivac-chip-row">
            {[
              "Roca y pradera alta",
              "Arena compacta",
              "Pedrera fina",
              "Rocoso",
              "Ladera suave",
              "Bosque",
              "Pinada",
              "Monte bajo",
            ].map((option) => (
              <button
                key={option}
                type="button"
                className={`create-vivac-chip${
                  terrainTypes.includes(option) ? " is-selected" : ""
                }`}
                onClick={() => toggleTerrainType(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      <label className="create-vivac-label">Zona expuesta al clima</label>
      <button
        type="button"
        className="create-vivac-field create-vivac-field-with-chevron"
        onClick={() => toggleFieldOpen("climate")}
      >
        <span>{climateExposure || "Zona expuesta al clima"}</span>
        <span className="material-symbols-outlined">
          {openField === "climate" ? "expand_less" : "expand_more"}
        </span>
      </button>
      {openField === "climate" && (
        <div className="create-vivac-dropdown-panel">
          {["Sí", "No"].map((option) => (
            <button
              key={option}
              type="button"
              className="create-vivac-dropdown-option"
              onClick={() => {
                setClimateExposure(option);
                setOpenField(null);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <label className="create-vivac-label">
        ¿Algo que quieras señalar de tu aventura?
      </label>
      <button
        type="button"
        className="create-vivac-field create-vivac-field-with-chevron"
        onClick={() => toggleFieldOpen("adventure")}
      >
        <span>
          {adventureTags.length
            ? "Opciones seleccionadas"
            : "¿Algo que quieras señalar de tu aventura?"}
        </span>
        <span className="material-symbols-outlined">
          {openField === "adventure" ? "expand_less" : "expand_more"}
        </span>
      </button>
      {openField === "adventure" && (
        <div className="create-vivac-dropdown-panel">
          <div className="create-vivac-chip-row">
            {[
              { key: "agua_cerca", label: "Agua cerca" },
              { key: "fauna_frecuente", label: "Fauna frecuente" },
              { key: "refugio", label: "Refugio" },
              { key: "cueva", label: "Cueva" },
              { key: "fui_con_mascota", label: "Fui con mascota" },
            ].map((tag) => (
              <button
                key={tag.key}
                type="button"
                className={`create-vivac-chip${
                  adventureTags.includes(tag.key) ? " is-selected" : ""
                }`}
                onClick={() => toggleAdventureTag(tag.key)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <label className="create-vivac-label">Tu equipamiento</label>
      <button
        type="button"
        className="create-vivac-field create-vivac-field-with-chevron"
        onClick={() => toggleFieldOpen("equipment")}
      >
        <span>
          {equipmentItems.length
            ? "Equipamiento seleccionado"
            : "Tu equipamiento"}
        </span>
        <span className="material-symbols-outlined">
          {openField === "equipment" ? "expand_less" : "expand_more"}
        </span>
      </button>
      {openField === "equipment" && (
        <div className="create-vivac-dropdown-panel">
          <div className="create-vivac-chip-row">
            {[
              "Tienda de campaña",
              "Saco de dormir",
              "Esterilla",
              "Hornillo",
              "Linterna frontal",
              "Botiquín",
            ].map((item) => (
              <button
                key={item}
                type="button"
                className={`create-vivac-chip${
                  equipmentItems.includes(item) ? " is-selected" : ""
                }`}
                onClick={() => toggleEquipmentItem(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className="create-vivac-primary-cta"
        onClick={handleNext}
      >
        Continuar
      </button>
    </section>
  );

  const renderStep3 = () => (
    <section className="create-vivac-step">
      <p className="create-vivac-step-label">Step 3</p>
      <h2 className="create-vivac-step-title">Descripción</h2>

      <label className="create-vivac-label" htmlFor="vivac-title">
        Título
      </label>
      <div className="create-vivac-field">
        <input
          id="vivac-title"
          type="text"
          placeholder="Añade un título para tu punto vivac"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <label className="create-vivac-label" htmlFor="vivac-description">
        Descripción
      </label>
      <div className="create-vivac-field">
        <textarea
          id="vivac-description"
          className="create-vivac-textarea"
          placeholder="Añade una descripción"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <label className="create-vivac-label">Añadir fotos</label>
      <label className="create-vivac-photos-dropzone">
        <span className="material-symbols-outlined">add_photo_alternate</span>
        <span>
          {photos.length > 0
            ? `${photos.length} foto(s) seleccionada(s)`
            : "Añade fotos de tu vivac"}
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotosChange}
        />
      </label>

      <div className="create-vivac-private-row">
        <div>
          <div className="create-vivac-private-label">Privado</div>
          <div className="create-vivac-private-helper">
            Sólo tú puedes verlo
          </div>
        </div>
        <button
          type="button"
          className={
            isPrivate ? "create-vivac-switch is-on" : "create-vivac-switch"
          }
          onClick={() => setIsPrivate((current) => !current)}
          aria-pressed={isPrivate}
        >
          <span className="create-vivac-switch-thumb" />
        </button>
      </div>

      <button
        type="button"
        className="create-vivac-primary-cta"
        onClick={handleNext}
      >
        Terminar
      </button>
    </section>
  );

  const progressClassName = [
    "create-vivac-progress-bar",
    step === 2 ? "step-2" : "",
    step === 3 ? "step-3" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="create-vivac-page">
      <header className="create-vivac-header">
        <h1 className="create-vivac-header-title">Crear punto vivac</h1>
        <button
          type="button"
          className="create-vivac-header-close material-symbols-outlined"
          onClick={handleOpenExit}
          aria-label="Cerrar creación de vivac"
        >
          close
        </button>
      </header>

      <div className="create-vivac-progress">
        <div className={progressClassName} />
      </div>

      <main className="create-vivac-main">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </main>

      {isExitDialogOpen && (
        <div
          className="create-vivac-exit-overlay"
          onClick={() => handleExitAction("discard")}
        >
          <div
            className="create-vivac-exit-card"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>¿Salir?</h2>
            <div className="create-vivac-exit-actions">
              <button
                type="button"
                onClick={() => handleExitAction("continue")}
              >
                Continuar
              </button>
              <button type="button" onClick={() => handleExitAction("save")}>
                Guardar para más tarde
              </button>
              <button type="button" onClick={() => handleExitAction("discard")}>
                Salir sin guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileScreen({ onLogout, onNavigate, spots = [], savedVivacIds = [] }) {
  const [activeTab, setActiveTab] = useState("vivacs");
  const [userData, setUserData] = useState(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `Perfil de ${userData?.userName || "Usuario"}`,
      text: `Mira el perfil de ${userData?.userName} en VivacWeb`,
      url: window.location.origin + `/profile/${userData?.id || ""}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      setIsShareOpen(true);
    }
  };

  const copyProfileLink = () => {
    const url = window.location.origin + `/profile/${userData?.id || ""}`;
    navigator.clipboard.writeText(url);
    alert("Enlace copiado al portapapeles");
    setIsShareOpen(false);
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const authData = localStorage.getItem("vivac_auth");
        if (!authData) return;

        const parsedAuth = JSON.parse(authData);
        const { token } = parsedAuth;
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else if (response.status === 401) {
          // Token expired or invalid - use local data
          setUserData({
            userName: parsedAuth.userName || "Usuario",
            email: parsedAuth.email || "",
            avatar: parsedAuth.avatar || "🌲",
            id: parsedAuth.id
          });
        }
      } catch (error) {
        // Network error - use local data as fallback
        const authData = localStorage.getItem("vivac_auth");
        if (authData) {
          const parsedAuth = JSON.parse(authData);
          setUserData({
            userName: parsedAuth.userName || "Usuario",
            email: parsedAuth.email || "",
            avatar: parsedAuth.avatar || "🌲",
            id: parsedAuth.id
          });
        }
      }
    };

    loadUserData();
  }, []);

  const userVivacs = spots.filter(
    (spot) => spot.createdBy === userData?.id
  );
  const savedVivacs = spots.filter((spot) => savedVivacIds.includes(spot.id));

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button
          type="button"
          className="profile-menu-button material-symbols-outlined"
          onClick={() => onNavigate("home")}
          aria-label="Menú"
        >
          menu
        </button>
        <div style={{ flex: 1 }}></div>
      </header>

      <div className="profile-user-section">
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {userData?.avatar || "🌲"}
          </div>
        </div>

        <h2 className="profile-username">{userData?.userName || "Usuario"}</h2>
        <p className="profile-handle">@{userData?.userName?.toLowerCase() || "usuario"}</p>

        <div className="profile-action-buttons">
          <button className="profile-action-btn" onClick={() => onNavigate("settings")}>
            <span className="material-symbols-outlined">edit</span>
            Editar
          </button>
          <button className="profile-action-btn" onClick={handleShare}>
            <span className="material-symbols-outlined">share</span>
            Compartir
          </button>
          <button className="profile-action-btn" onClick={() => onNavigate("settings")}>
            <span className="material-symbols-outlined">settings</span>
            Ajustes
          </button>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <div className="profile-stat-value">{userVivacs.length}</div>
            <div className="profile-stat-label">Vivacs</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value">0</div>
            <div className="profile-stat-label">Siguiendo</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-value">0</div>
            <div className="profile-stat-label">Seguidores</div>
          </div>
        </div>

        <div className="profile-ranking">
          <span className="material-symbols-outlined">emoji_events</span>
          <span>Puesto #5</span>
          <span className="profile-exp">60 EXP</span>
        </div>

        <div className="profile-badges-section">
          <h3>Tus insignias</h3>
          <button className="profile-view-all">
            Ver todas <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="profile-badges">
          <div className="profile-badge">🟡</div>
          <div className="profile-badge">🟣</div>
          <div className="profile-badge">🔵</div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          type="button"
          className={`profile-tab ${activeTab === "vivacs" ? "active" : ""}`}
          onClick={() => setActiveTab("vivacs")}
        >
          Tus vivacs
        </button>
        <button
          type="button"
          className={`profile-tab ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          Guardados
        </button>
      </div>

      <main className="profile-main">
        {activeTab === "vivacs" && (
          <section className="profile-list">
            {userVivacs.length > 0 ? (
              userVivacs.map((vivac) => (
                <article
                  key={vivac.id}
                  className="profile-vivac-card"
                  onClick={() => onNavigate("vivacDetail", vivac)}
                >
                  <div className="profile-vivac-image">
                    {vivac.photoUrls && vivac.photoUrls.length > 0 ? (
                      <img src={vivac.photoUrls[0]} alt={vivac.title} />
                    ) : (
                      <div className="profile-vivac-placeholder"></div>
                    )}
                  </div>
                  <div className="profile-vivac-info">
                    <h3>{vivac.title}</h3>
                    <p>{vivac.location}</p>
                    <div className="profile-vivac-rating">
                      <span className="material-symbols-outlined">star</span>
                      {vivac.rating}
                      <span className="profile-vivac-reviews">{vivac.reviews}</span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="profile-empty">
                No has creado ningún vivac aún.
              </p>
            )}
          </section>
        )}

        {activeTab === "saved" && (
          <section className="profile-list">
            {savedVivacs.length > 0 ? (
              savedVivacs.map((vivac) => (
                <article
                  key={vivac.id}
                  className="profile-vivac-card"
                  onClick={() => onNavigate("vivacDetail", vivac)}
                >
                  <div className="profile-vivac-image">
                    {vivac.photoUrls && vivac.photoUrls.length > 0 ? (
                      <img src={vivac.photoUrls[0]} alt={vivac.title} />
                    ) : (
                      <div className="profile-vivac-placeholder"></div>
                    )}
                  </div>
                  <div className="profile-vivac-info">
                    <h3>{vivac.title}</h3>
                    <p>{vivac.location}</p>
                  </div>
                </article>
              ))
            ) : (
              <p className="profile-empty">No tienes vivacs guardados aún.</p>
            )}
          </section>
        )}
      </main>

      {isShareOpen && (
        <div className="settings-dialog-overlay" onClick={() => setIsShareOpen(false)}>
          <div className="settings-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="settings-dialog-title">Compartir perfil</h3>
            <p className="settings-dialog-text">Comparte tu perfil con tus amigos</p>
            <div className="settings-dialog-actions" style={{ flexDirection: "column", gap: "8px" }}>
              <button
                type="button"
                className="settings-dialog-btn"
                style={{ background: "#1f5130", color: "#fff" }}
                onClick={copyProfileLink}
              >
                <span className="material-symbols-outlined" style={{ marginRight: "8px" }}>content_copy</span>
                Copiar enlace
              </button>
              <button
                type="button"
                className="settings-dialog-btn settings-dialog-btn-cancel"
                onClick={() => setIsShareOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PublicProfileScreen({ userId, onClose, onNavigate, spots = [] }) {
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("vivacs");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const authData = localStorage.getItem("vivac_auth");
        if (!authData) return;

        const { token } = JSON.parse(authData);
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    if (userId) {
      loadUserData();
    }
  }, [userId]);

  const handleFollow = async () => {
    try {
      const authData = localStorage.getItem("vivac_auth");
      if (!authData) return;

      const { token } = JSON.parse(authData);
      const endpoint = isFollowing ? "unfollow" : "follow";
      const response = await fetch(`${API_BASE_URL}/users/${userId}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  const userVivacs = spots.filter(
    (spot) => spot.createdBy === userData?.id
  );

  return (
    <div className="profile-page">
      <header className="profile-header">
        <button
          type="button"
          className="profile-menu-button material-symbols-outlined"
          onClick={onClose}
          aria-label="Volver"
        >
          arrow_back
        </button>
        <div style={{ flex: 1 }}></div>
        <button
          type="button"
          className="profile-menu-button material-symbols-outlined"
          aria-label="Compartir"
        >
          share
        </button>
      </header>

      <div className="profile-user-section">
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {userData?.avatar || "🌲"}
          </div>
        </div>

        <h2 className="profile-username">{userData?.userName || "Usuario"}</h2>
        <p className="profile-handle">@{userData?.userName?.toLowerCase() || "usuario"}</p>

        <div className="profile-action-buttons">
          <button
            className="profile-action-btn"
            onClick={handleFollow}
            style={{
              background: isFollowing ? "#f3f4f6" : "#1f5130",
              color: isFollowing ? "#111827" : "#ffffff",
            }}
          >
            <span className="material-symbols-outlined">
              {isFollowing ? "person_remove" : "person_add"}
            </span>
            {isFollowing ? "Siguiendo" : "Seguir"}
          </button>
          <button className="profile-action-btn">
            <span className="material-symbols-outlined">chat</span>
            Abrir chat
          </button>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-value">{userData?.vivacsCount || 0}</span>
            <span className="profile-stat-label">Vivacs</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-value">{userData?.followingCount || 0}</span>
            <span className="profile-stat-label">Siguiendo</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-value">{userData?.followersCount || 0}</span>
            <span className="profile-stat-label">Seguidores</span>
          </div>
        </div>

        <div className="profile-ranking">
          <span className="material-symbols-outlined">emoji_events</span>
          <span>Puesto {userData?.ranking || "N/A"} en el ranking</span>
        </div>

        <div className="profile-badges">
          <h3>Insignias</h3>
          <div className="profile-badges-grid">
            <div className="profile-badge">🏔️</div>
            <div className="profile-badge">🌲</div>
            <div className="profile-badge">⛺</div>
            <div className="profile-badge">🔥</div>
          </div>
        </div>
      </div>

      <main className="profile-main">
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === "vivacs" ? "profile-tab-active" : ""}`}
            onClick={() => setActiveTab("vivacs")}
          >
            Vivacs
          </button>
        </div>

        {activeTab === "vivacs" && (
          <section className="profile-vivacs-section">
            {userVivacs.length > 0 ? (
              userVivacs.map((vivac) => (
                <article
                  key={vivac.id}
                  className="profile-vivac-card"
                  onClick={() => onNavigate("vivacDetail", vivac)}
                >
                  <div className="profile-vivac-image">
                    {vivac.photoUrls && vivac.photoUrls.length > 0 ? (
                      <img src={vivac.photoUrls[0]} alt={vivac.title} />
                    ) : (
                      <div className="profile-vivac-placeholder"></div>
                    )}
                  </div>
                  <div className="profile-vivac-info">
                    <h3>{vivac.title}</h3>
                    <p>{vivac.location}</p>
                  </div>
                </article>
              ))
            ) : (
              <p className="profile-empty">Este usuario no tiene vivacs aún.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

function CommunityScreen({ onNavigate, onLogout }) {
  const [groups, setGroups] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    setIsLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutDialogOpen(false);
    onLogout();
  };

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const authData = localStorage.getItem("vivac_auth");
        if (!authData) return;

        const { token } = JSON.parse(authData);
        const response = await fetch(`${API_BASE_URL}/groups`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setGroups(data);
        } else if (response.status === 404) {
          // API endpoint doesn't exist yet - use empty array silently
          setGroups([]);
        }
      } catch (error) {
        // Network error or API not available - fail silently
        console.log("Groups API not available");
      }
    };

    loadGroups();
  }, []);

  const handleDeleteGroup = async (groupId) => {
    try {
      const authData = localStorage.getItem("vivac_auth");
      if (!authData) return;

      const { token } = JSON.parse(authData);
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setGroups(groups.filter((g) => g.id !== groupId));
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <button
          type="button"
          className="home-menu-button"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Menú"
        >
          <div className="home-menu-button-bar"></div>
          <div className="home-menu-button-bar"></div>
          <div className="home-menu-button-bar"></div>
        </button>
      </header>

      <main className="home-main" style={{ paddingTop: "20px" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#1c2326", marginBottom: "16px" }}>
          Mis Grupos
        </h2>

        {groups.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            background: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: "3rem", color: "#9ca3af", marginBottom: "12px", display: "block" }}>
              groups
            </span>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1rem", fontWeight: "600", color: "#374151" }}>
              No tienes grupos aún
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.9rem", color: "#6b7280" }}>
              Crea un grupo para compartir tus aventuras con amigos
            </p>
            <button
              onClick={() => {/* TODO: Implementar crear grupo */}}
              style={{
                padding: "10px 20px",
                background: "#1f5130",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Crear mi primer grupo
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {groups.map((group) => (
            <div
              key={group.id}
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {group.imageUrl ? (
                  <img
                    src={group.imageUrl}
                    alt={group.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : null}
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: "0 0 4px 0",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {group.name}
                </h3>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  style={{
                    border: "none",
                    background: "none",
                    color: "#ef4444",
                    fontSize: "0.85rem",
                    padding: "0",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                    delete
                  </span>
                  Eliminar grupo
                </button>
              </div>
              <button
                onClick={() => onNavigate("groupDetail", group)}
                style={{
                  border: "none",
                  background: "none",
                  color: "#6b7280",
                  fontSize: "1.5rem",
                  padding: "4px",
                  cursor: "pointer",
                }}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          ))}
          </div>
        )}

        <button
          onClick={() => {
            /* TODO: Implementar crear grupo */
          }}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            border: "none",
            background: "#1f5130",
            color: "#ffffff",
            fontSize: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            cursor: "pointer",
          }}
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </main>

      {isMenuOpen && (
        <div className="home-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="home-menu-panel" onClick={(e) => e.stopPropagation()}>
            <div className="home-menu-header">
              <img src="/logo.png" alt="Logo" className="home-menu-logo" />
              <button
                type="button"
                className="home-menu-close"
                onClick={() => setIsMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <nav className="home-menu-nav">
              <button
                type="button"
                className="home-menu-item"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigate("home");
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">home</span>
                Inicio
              </button>
              <button
                type="button"
                className="home-menu-item"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigate("explore");
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">explore</span>
                Explorar
              </button>
              <button
                type="button"
                className="home-menu-item home-menu-item-active"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigate("community");
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">groups</span>
                Comunidad
              </button>
              <button
                type="button"
                className="home-menu-item"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigate("profile");
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">person</span>
                Perfil
              </button>
            </nav>
            <div className="home-menu-footer">
              <button
                type="button"
                className="home-menu-secondary"
                onClick={() => {
                  setIsMenuOpen(false);
                  onNavigate("settings");
                }}
              >
                <span className="home-menu-icon material-symbols-outlined">settings</span>
                Ajustes
              </button>
              <button
                type="button"
                className="home-menu-secondary home-menu-logout"
                onClick={handleLogoutClick}
              >
                <span className="home-menu-icon material-symbols-outlined">logout</span>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {isLogoutDialogOpen && (
        <div className="settings-dialog-overlay" onClick={() => setIsLogoutDialogOpen(false)}>
          <div className="settings-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="settings-dialog-title">¿Cerrar sesión?</h3>
            <p className="settings-dialog-text">¿Estás seguro de que quieres cerrar sesión?</p>
            <div className="settings-dialog-actions">
              <button
                type="button"
                className="settings-dialog-btn settings-dialog-btn-cancel"
                onClick={() => setIsLogoutDialogOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="settings-dialog-btn settings-dialog-btn-confirm"
                onClick={handleConfirmLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GroupDetailScreen({ group, onNavigate, onClose }) {
  if (!group) return null;

  return (
    <div className="vivac-detail-page">
      <header className="vivac-detail-header" style={{ background: "#1f5130" }}>
        <button
          type="button"
          className="vivac-detail-back material-symbols-outlined"
          onClick={onClose}
          aria-label="Volver"
        >
          arrow_back
        </button>
        <h1 className="vivac-detail-title">{group.name}</h1>
        <div className="vivac-detail-actions">
          <button
            type="button"
            className="vivac-detail-action material-symbols-outlined"
            onClick={() => onNavigate("groupMembers", group)}
            aria-label="Ver miembros"
          >
            group
          </button>
          <button
            type="button"
            className="vivac-detail-action material-symbols-outlined"
            aria-label="Más opciones"
          >
            more_vert
          </button>
        </div>
      </header>

      <main className="vivac-detail-main">
        <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", marginBottom: "16px" }}>
          {group.imageUrl ? (
            <img
              src={group.imageUrl}
              alt={group.name}
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: "100%", height: "200px", background: "linear-gradient(135deg, #10b981, #059669)" }}></div>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #fbbf24, #f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
              🦁
            </div>
            <div>
              <p style={{ margin: "0", fontSize: "0.9rem", fontWeight: "600", color: "#111827" }}>Lucía vivaquer</p>
              <button
                onClick={() => onNavigate("groupMembers", group)}
                style={{
                  border: "none",
                  background: "none",
                  color: "#6b7280",
                  fontSize: "0.85rem",
                  padding: "0",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                Ver todos los miembros
                <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                  chevron_right
                </span>
              </button>
            </div>
          </div>

          <button
            onClick={() => onNavigate("groupChat", group)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              background: "#ffffff",
              color: "#6b7280",
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span className="material-symbols-outlined">chat</span>
            Abrir chat de grupo
          </button>
        </div>

        <section className="vivac-detail-section">
          <h3>Localización</h3>
          <div className="vivac-detail-location-item">
            <span className="material-symbols-outlined">location_on</span>
            <div>
              <p className="label">Punto vivac:</p>
              <p className="value">Sierra El Maigmó</p>
            </div>
          </div>
          <div className="vivac-detail-location-item">
            <span className="material-symbols-outlined">hiking</span>
            <div>
              <p className="label">Punto de partida:</p>
              <p className="value">38.6590, -0.3069 (lat, lng)</p>
              <p className="sublabel">Inicio del camino barranco de la Creu</p>
            </div>
          </div>
          <div className="vivac-detail-location-item">
            <span className="material-symbols-outlined">schedule</span>
            <div>
              <p className="label">Hora de salida:</p>
              <p className="value">17:pm</p>
            </div>
          </div>
          <div className="vivac-detail-location-item">
            <span className="material-symbols-outlined">calendar_today</span>
            <div>
              <p className="label">Fecha:</p>
              <p className="value">16.09.2025</p>
            </div>
          </div>
        </section>

        <section className="vivac-detail-section">
          <h3>Materiales</h3>
          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined">backpack</span>
            </div>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined">local_fire_department</span>
            </div>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined">restaurant</span>
            </div>
          </div>
        </section>

        <section className="vivac-detail-section">
          <h3>Descripción</h3>
          <p className="vivac-detail-description">
            Compartiremos información sobre el punto elegido, accesos, previsión meteorológica,
            material recomendado y cualquier detalle útil para disfrutar de la experiencia con seguridad y
            comodidad.
          </p>
        </section>
      </main>
    </div>
  );
}

function GroupMembersScreen({ group, onClose }) {
  const members = [
    { id: 1, name: "Lucía vivaquer", avatar: "🦁", role: "Admin" },
    { id: 2, name: "Marina_vic", avatar: "🌲", role: "Member" },
    { id: 3, name: "Migueel marin", avatar: "🌍", role: "Member" },
    { id: 4, name: "Carla_mar", avatar: "🏖️", role: "Member" },
  ];

  return (
    <div className="vivac-detail-page">
      <header className="vivac-detail-header" style={{ background: "#1f5130" }}>
        <button
          type="button"
          className="vivac-detail-back material-symbols-outlined"
          onClick={onClose}
          aria-label="Volver"
        >
          arrow_back
        </button>
        <h1 className="vivac-detail-title">Miembros</h1>
      </header>

      <main className="vivac-detail-main">
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {members.map((member) => (
            <div
              key={member.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                background: "#f9fafb",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                {member.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0", fontSize: "0.95rem", fontWeight: "600", color: "#111827" }}>
                  {member.name}
                </p>
                {member.role === "Admin" && (
                  <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#6b7280" }}>
                    {member.role}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function GroupChatScreen({ group, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, author: "Marina_vic", text: "Does this update fix error 352 for the Engineer character?", time: "10:11", isMine: false },
    { id: 2, author: "Migueel marin", text: "Oh! They fixed it and upgraded the security further. 🚀", time: "10:11", isMine: false },
    { id: 3, author: "Me", text: "Great! 😊", time: "10:20", isMine: true },
    { id: 4, author: "Me", text: "Great, thanks for letting me know! I really look forward to experiencing it soon. 🏕️", time: "10:11", isMine: true },
    { id: 5, author: "Me", text: "Hi!", time: "10:10", isMine: true },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      author: "Me",
      text: newMessage,
      time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      isMine: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <div className="vivac-detail-page" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <header className="vivac-detail-header" style={{ background: "#1f5130", flexShrink: 0 }}>
        <button
          type="button"
          className="vivac-detail-back material-symbols-outlined"
          onClick={onClose}
          aria-label="Volver"
        >
          arrow_back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10b981, #059669)",
              flexShrink: 0,
            }}
          ></div>
          <div>
            <h1 className="vivac-detail-title" style={{ margin: 0, fontSize: "0.95rem" }}>
              {group?.name || "Grupo"}
            </h1>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#e5e7eb" }}>4 miembros</p>
          </div>
        </div>
        <div className="vivac-detail-actions">
          <button
            type="button"
            className="vivac-detail-action material-symbols-outlined"
            aria-label="Compartir"
          >
            share
          </button>
          <button
            type="button"
            className="vivac-detail-action material-symbols-outlined"
            aria-label="Más opciones"
          >
            more_vert
          </button>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          background: "#f9fafb",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {messages.slice().reverse().map((message) => (
            <div
              key={message.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: message.isMine ? "flex-end" : "flex-start",
              }}
            >
              {!message.isMine && (
                <p style={{ margin: "0 0 4px 0", fontSize: "0.8rem", color: "#6b7280", paddingLeft: "8px" }}>
                  {message.author}
                </p>
              )}
              <div
                style={{
                  maxWidth: "75%",
                  padding: "10px 14px",
                  borderRadius: message.isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: message.isMine ? "#1f5130" : "#ffffff",
                  color: message.isMine ? "#ffffff" : "#111827",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <p style={{ margin: "0", fontSize: "0.9rem", lineHeight: "1.4" }}>{message.text}</p>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "0.75rem",
                    color: message.isMine ? "#d1fae5" : "#9ca3af",
                    textAlign: "right",
                  }}
                >
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div
        style={{
          padding: "12px 16px",
          background: "#ffffff",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          style={{
            flex: 1,
            padding: "10px 14px",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            fontSize: "0.9rem",
            outline: "none",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            background: "#1f5130",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <span className="material-symbols-outlined">send</span>
        </button>
        <button
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            background: "#f3f4f6",
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <span className="material-symbols-outlined">attach_file</span>
        </button>
        <button
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "none",
            background: "#f3f4f6",
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <span className="material-symbols-outlined">mic</span>
        </button>
      </div>
    </div>
  );
}

function SettingsScreen({ onClose, onLogout }) {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("es");
  const [userData, setUserData] = useState(null);
  const [editUserName, setEditUserName] = useState("");
  const [editAvatar, setEditAvatar] = useState("🌲");
  const [saveLoading, setSaveLoading] = useState(false);

  const avatarOptions = ["🌲", "🏔️", "⛺", "🦁", "🐻", "🦊", "🌿", "🌙", "⭐", "🔥"];

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const authData = localStorage.getItem("vivac_auth");
        if (!authData) return;

        const parsedAuth = JSON.parse(authData);
        const { token } = parsedAuth;
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setEditUserName(data.userName || "");
          setEditAvatar(data.avatar || "🌲");
        } else {
          // Use local data as fallback
          setUserData({
            userName: parsedAuth.userName || "Usuario",
            email: parsedAuth.email || "",
            avatar: parsedAuth.avatar || "🌲",
            id: parsedAuth.id
          });
          setEditUserName(parsedAuth.userName || "");
          setEditAvatar(parsedAuth.avatar || "🌲");
        }
      } catch (error) {
        // Use local data as fallback
        const authData = localStorage.getItem("vivac_auth");
        if (authData) {
          const parsedAuth = JSON.parse(authData);
          setUserData({
            userName: parsedAuth.userName || "Usuario",
            email: parsedAuth.email || "",
            avatar: parsedAuth.avatar || "🌲",
            id: parsedAuth.id
          });
          setEditUserName(parsedAuth.userName || "");
          setEditAvatar(parsedAuth.avatar || "🌲");
        }
      }
    };
    loadUserData();
  }, []);

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const authData = localStorage.getItem("vivac_auth");
      if (!authData) return;

      const { token } = JSON.parse(authData);
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userName: editUserName, avatar: editAvatar }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setIsEditProfileOpen(false);
        alert("Perfil actualizado correctamente");
      } else {
        alert("Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Save locally if API fails
      const authData = localStorage.getItem("vivac_auth");
      if (authData) {
        const data = JSON.parse(authData);
        data.userName = editUserName;
        data.avatar = editAvatar;
        localStorage.setItem("vivac_auth", JSON.stringify(data));
        setUserData((prev) => ({ ...prev, userName: editUserName, avatar: editAvatar }));
        setIsEditProfileOpen(false);
        alert("Perfil guardado localmente");
      }
    }
    setSaveLoading(false);
  };

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutDialogOpen(false);
    onLogout();
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button type="button" className="settings-back" onClick={onClose}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="settings-title">Ajustes</h1>
      </header>

      <main className="settings-main">
        {/* User profile preview */}
        <div className="settings-profile-preview">
          <div className="settings-profile-avatar">{userData?.avatar || "🌲"}</div>
          <div className="settings-profile-info">
            <h3 className="settings-profile-name">{userData?.userName || "Usuario"}</h3>
            <p className="settings-profile-email">{userData?.email || ""}</p>
          </div>
        </div>

        <section className="settings-section">
          <h2 className="settings-section-title">Cuenta</h2>
          <div className="settings-item" onClick={() => setIsEditProfileOpen(true)}>
            <span className="settings-item-icon material-symbols-outlined">person</span>
            <span className="settings-item-label">Editar perfil</span>
            <span className="settings-item-arrow material-symbols-outlined">chevron_right</span>
          </div>
          <div className="settings-item">
            <span className="settings-item-icon material-symbols-outlined">lock</span>
            <span className="settings-item-label">Cambiar contraseña</span>
            <span className="settings-item-arrow material-symbols-outlined">chevron_right</span>
          </div>
          <div className="settings-item">
            <span className="settings-item-icon material-symbols-outlined">security</span>
            <span className="settings-item-label">Privacidad</span>
            <span className="settings-item-arrow material-symbols-outlined">chevron_right</span>
          </div>
        </section>

        <section className="settings-section">
          <h2 className="settings-section-title">Preferencias</h2>
          <div className="settings-item settings-item-toggle">
            <span className="settings-item-icon material-symbols-outlined">notifications</span>
            <span className="settings-item-label">Notificaciones</span>
            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span className="settings-toggle-slider"></span>
            </label>
          </div>
          <div className="settings-item settings-item-toggle">
            <span className="settings-item-icon material-symbols-outlined">dark_mode</span>
            <span className="settings-item-label">Modo oscuro</span>
            <label className="settings-toggle">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <span className="settings-toggle-slider"></span>
            </label>
          </div>
          <div className="settings-item">
            <span className="settings-item-icon material-symbols-outlined">language</span>
            <span className="settings-item-label">Idioma</span>
            <select
              className="settings-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </section>

        <section className="settings-section">
          <h2 className="settings-section-title">Soporte</h2>
          <div className="settings-item">
            <span className="settings-item-icon material-symbols-outlined">help</span>
            <span className="settings-item-label">Centro de ayuda</span>
            <span className="settings-item-arrow material-symbols-outlined">chevron_right</span>
          </div>
          <div className="settings-item">
            <span className="settings-item-icon material-symbols-outlined">feedback</span>
            <span className="settings-item-label">Enviar comentarios</span>
            <span className="settings-item-arrow material-symbols-outlined">chevron_right</span>
          </div>
          <div className="settings-item">
            <span className="settings-item-icon material-symbols-outlined">info</span>
            <span className="settings-item-label">Acerca de</span>
            <span className="settings-item-arrow material-symbols-outlined">chevron_right</span>
          </div>
        </section>

        <section className="settings-section">
          <button
            type="button"
            className="settings-logout-btn"
            onClick={handleLogoutClick}
          >
            <span className="material-symbols-outlined">logout</span>
            Cerrar sesión
          </button>
        </section>
      </main>

      {isLogoutDialogOpen && (
        <div className="settings-dialog-overlay" onClick={() => setIsLogoutDialogOpen(false)}>
          <div className="settings-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 className="settings-dialog-title">¿Cerrar sesión?</h3>
            <p className="settings-dialog-text">¿Estás seguro de que quieres cerrar sesión?</p>
            <div className="settings-dialog-actions">
              <button
                type="button"
                className="settings-dialog-btn settings-dialog-btn-cancel"
                onClick={() => setIsLogoutDialogOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="settings-dialog-btn settings-dialog-btn-confirm"
                onClick={handleConfirmLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditProfileOpen && (
        <div className="settings-dialog-overlay" onClick={() => setIsEditProfileOpen(false)}>
          <div className="settings-dialog settings-dialog-large" onClick={(e) => e.stopPropagation()}>
            <h3 className="settings-dialog-title">Editar perfil</h3>

            <div className="settings-edit-avatar-section">
              <div className="settings-edit-current-avatar">{editAvatar}</div>
              <div className="settings-edit-avatar-options">
                {avatarOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className={`settings-edit-avatar-btn ${editAvatar === emoji ? 'selected' : ''}`}
                    onClick={() => setEditAvatar(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-edit-field">
              <label>Nombre de usuario</label>
              <input
                type="text"
                value={editUserName}
                onChange={(e) => setEditUserName(e.target.value)}
                placeholder="Tu nombre de usuario"
              />
            </div>

            <div className="settings-dialog-actions">
              <button
                type="button"
                className="settings-dialog-btn settings-dialog-btn-cancel"
                onClick={() => setIsEditProfileOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="settings-dialog-btn settings-dialog-btn-confirm"
                onClick={handleSaveProfile}
                disabled={saveLoading}
              >
                {saveLoading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VivacDetailScreen({ vivac, onClose, onNavigate }) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    if (!vivac || !vivac.position) return;

    const fetchWeather = async () => {
      setWeatherLoading(true);
      try {
        const [lat, lng] = vivac.position;
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const data = await response.json();
        if (data && data.hourly) {
          setWeatherData(data);
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [vivac]);

  if (!vivac) return null;

  return (
    <div className="vivac-detail-page">
      <header className="vivac-detail-header">
        <button
          type="button"
          className="vivac-detail-back material-symbols-outlined"
          onClick={onClose}
          aria-label="Volver"
        >
          arrow_back
        </button>
        <h1 className="vivac-detail-title">{vivac.title}</h1>
        <div className="vivac-detail-actions">
          <button
            type="button"
            className="vivac-detail-action material-symbols-outlined"
            onClick={() => setIsShareOpen(!isShareOpen)}
            aria-label="Compartir"
          >
            share
          </button>
          <button
            type="button"
            className="vivac-detail-action material-symbols-outlined"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            aria-label="Más opciones"
          >
            more_vert
          </button>
        </div>
      </header>

      <main className="vivac-detail-main">
        {/* Fotos carousel */}
        <div className="vivac-detail-photos">
          {vivac.photoUrls && vivac.photoUrls.length > 0 ? (
            <img
              src={vivac.photoUrls[0]}
              alt={vivac.title}
              className="vivac-detail-photo-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="vivac-detail-photo-placeholder"
            style={{ display: vivac.photoUrls && vivac.photoUrls.length > 0 ? 'none' : 'flex' }}
          >
            <span className="material-symbols-outlined">landscape</span>
          </div>
          {vivac.photoUrls && vivac.photoUrls.length > 1 && (
            <div className="vivac-detail-photo-dots">
              {vivac.photoUrls.map((_, index) => (
                <span key={index} className={`dot ${index === 0 ? 'active' : ''}`} />
              ))}
            </div>
          )}
          {vivac.photoUrls && vivac.photoUrls.length > 0 && (
            <button className="vivac-detail-view-all">Ver todo ({vivac.photoUrls.length})</button>
          )}
        </div>

        {/* Título y rating */}
        <div className="vivac-detail-header-info">
          <h2>{vivac.title}</h2>
          <div className="vivac-detail-rating">
            <span className="stars">★★★★☆</span>
            <span className="rating-value">{vivac.rating}</span>
          </div>
        </div>

        {/* Ubicación */}
        <section className="vivac-detail-section">
          <h3>Localización</h3>
          <div className="vivac-detail-location-item">
            <span className="material-symbols-outlined">location_on</span>
            <div>
              <p className="label">Punto vivac:</p>
              <p className="value">
                {vivac.position
                  ? `${vivac.position[0].toFixed(
                      4
                    )}, ${vivac.position[1].toFixed(4)} (lat, lng)`
                  : "N/A"}
              </p>
              <p className="sublabel">{vivac.location}</p>
            </div>
          </div>
          <div className="vivac-detail-location-item">
            <span className="material-symbols-outlined">hiking</span>
            <div>
              <p className="label">Zona principal:</p>
              <p className="value">{vivac.terrainType || "No especificado"}</p>
            </div>
          </div>
          <div className="vivac-detail-location-item">
            <span className="material-symbols-outlined">place</span>
            <div>
              <p className="label">Lugar cercano:</p>
              <p className="value">{vivac.startPoint || "No especificado"}</p>
            </div>
          </div>
        </section>

        {/* Detalles */}
        <section className="vivac-detail-section">
          <h3>Detalles</h3>
          {vivac.startPoint && (
            <div className="vivac-detail-item">
              <span className="material-symbols-outlined">directions_walk</span>
              <div>
                <p className="label">Punto de partida:</p>
                <p className="value">{vivac.startPoint}</p>
              </div>
            </div>
          )}
          {vivac.accessDifficulty && (
            <div className="vivac-detail-item">
              <span className="material-symbols-outlined">trending_up</span>
              <div>
                <p className="label">Dificultad de acceso:</p>
                <p className="value">{vivac.accessDifficulty}</p>
              </div>
            </div>
          )}
          {vivac.terrainType && (
            <div className="vivac-detail-item">
              <span className="material-symbols-outlined">terrain</span>
              <div>
                <p className="label">Terreno:</p>
                <p className="value">
                  {Array.isArray(vivac.terrainType)
                    ? vivac.terrainType.join(", ")
                    : vivac.terrainType}
                </p>
              </div>
            </div>
          )}
          {vivac.climateExposure && (
            <div className="vivac-detail-item">
              <span className="material-symbols-outlined">cloud</span>
              <div>
                <p className="label">Zona expuesta al clima:</p>
                <p className="value">{vivac.climateExposure}</p>
              </div>
            </div>
          )}
          {vivac.adventureNotes && vivac.adventureNotes.length > 0 && (
            <div className="vivac-detail-item">
              <span className="material-symbols-outlined">star</span>
              <div>
                <p className="label">Aventura:</p>
                <p className="value">{vivac.adventureNotes.join(", ")}</p>
              </div>
            </div>
          )}
        </section>

        {/* Descripción */}
        {vivac.description && (
          <section className="vivac-detail-section">
            <h3>Descripción</h3>
            <p className="vivac-detail-description">{vivac.description}</p>
            <button className="vivac-detail-read-more">Ver más ▼</button>
          </section>
        )}

        {/* Clima */}
        {weatherData && (
          <section className="vivac-detail-section">
            <h3>Hoy</h3>
            <div className="vivac-detail-weather">
              {weatherData.hourly && weatherData.hourly.time && (
                <div className="weather-hours">
                  {[0, 3, 6, 9, 12].map((hour) => {
                    const temp = weatherData.hourly.temperature_2m[hour];
                    const time = new Date(
                      weatherData.hourly.time[hour]
                    ).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    return (
                      <div key={hour} className="weather-hour">
                        <p className="temp">{Math.round(temp)}°C</p>
                        <span className="material-symbols-outlined">
                          {temp > 20 ? "sunny" : "cloud"}
                        </span>
                        <p className="time">{time}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Valoraciones */}
        <section className="vivac-detail-section">
          <h3>Valoraciones</h3>
          <button className="vivac-detail-add-rating">
            Añade una valoración para ayudar a otros usuarios
          </button>
          <div className="vivac-detail-rating-stars">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>
        </section>

        {/* Comentarios */}
        <section className="vivac-detail-section">
          <h3>Comentarios</h3>
          <div className="vivac-detail-comment-input">
            <input type="text" placeholder="Deja tu comentario..." />
          </div>
          <div className="vivac-detail-comments">
            <div className="comment">
              <div className="comment-header">
                <span className="comment-author">Usuario</span>
                <span className="comment-date">Hace 2 días</span>
              </div>
              <p className="comment-text">Excelente lugar para acampar.</p>
            </div>
          </div>
          <button className="vivac-detail-load-more">Cargar más</button>
        </section>
      </main>

      {/* Modal Compartir */}
      {isShareOpen && (
        <div
          className="vivac-detail-modal-overlay"
          onClick={() => setIsShareOpen(false)}
        >
          <div
            className="vivac-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vivac-detail-modal-search">
              <span className="material-symbols-outlined">search</span>
              <input type="text" placeholder="Buscar" />
            </div>
            <div className="vivac-detail-share-friends">
              <button className="share-friend">
                <div className="friend-avatar">🌲</div>
                <p>Lidia explorer</p>
              </button>
              <button className="share-friend">
                <div className="friend-avatar">🏕️</div>
                <p>GermanP_</p>
              </button>
              <button className="share-friend">
                <div className="friend-avatar">⛰️</div>
                <p>Pianes vivaquers</p>
              </button>
            </div>
            <div className="vivac-detail-share-social">
              <button className="share-social whatsapp">
                <span className="material-symbols-outlined">chat</span>
                <p>WhatsApp</p>
              </button>
              <button className="share-social telegram">
                <span className="material-symbols-outlined">send</span>
                <p>Telegram</p>
              </button>
              <button className="share-social instagram">
                <span className="material-symbols-outlined">image</span>
                <p>Instagram stories</p>
              </button>
              <button className="share-social copy">
                <span className="material-symbols-outlined">content_copy</span>
                <p>Copiar link</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Más opciones */}
      {isMoreOpen && (
        <div
          className="vivac-detail-modal-overlay"
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className="vivac-detail-more-menu"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="more-option">Reportar contenido</button>
            <button className="more-option">Reportar usuario</button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [currentScreen, setCurrentScreen] = useState(() => {
    const stored = localStorage.getItem("vivac_auth");
    return stored ? "home" : "auth";
  });
  const [lastMainScreen, setLastMainScreen] = useState("home");
  const [selectedVivac, setSelectedVivac] = useState(null);
  const [view, setView] = useState("login"); // 'login' | 'register' | 'forgot'
  const [authError, setAuthError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [registerUserName, setRegisterUserName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const [spots, setSpots] = useState([]);

  // Estado para favoritos guardados
  const [savedVivacIds, setSavedVivacIds] = useState(() => {
    const stored = localStorage.getItem("vivac_saved_ids");
    return stored ? JSON.parse(stored) : [];
  });

  const toggleSaveVivac = (vivacId) => {
    setSavedVivacIds((prev) => {
      const newSaved = prev.includes(vivacId)
        ? prev.filter((id) => id !== vivacId)
        : [...prev, vivacId];
      localStorage.setItem("vivac_saved_ids", JSON.stringify(newSaved));
      return newSaved;
    });
  };

  // Datos iniciales: puntos populares en España y cerca de Alicante
  const getInitialSpots = () => [
    // Cerca de Alicante
    {
      id: "popular_1",
      title: "Serra de Mariola",
      name: "Serra de Mariola",
      description: "Zona de vivac en el Parque Natural de la Sierra de Mariola. Vistas espectaculares y entorno natural privilegiado.",
      location: "38.7333, -0.5167",
      latitude: 38.7333,
      longitude: -0.5167,
      rating: "4.8",
      reviews: "124 reviews",
      position: [38.7333, -0.5167],
      photoUrls: ["https://picsum.photos/seed/mariola/400/300"],
      accessDifficulty: "Moderada",
      terrainType: "Montaña",
      environment: "Bosque",
      privacity: "Alta",
      petFriendly: true,
      elevation: 1100,
      isPopular: true,
    },
    {
      id: "popular_2",
      title: "Peñón de Ifach",
      name: "Peñón de Ifach",
      description: "Espectacular roca junto al mar. Zona de acampada libre con vistas al Mediterráneo.",
      location: "38.6375, 0.0778",
      latitude: 38.6375,
      longitude: 0.0778,
      rating: "4.6",
      reviews: "89 reviews",
      position: [38.6375, 0.0778],
      photoUrls: ["https://picsum.photos/seed/ifach/400/300"],
      accessDifficulty: "Fácil",
      terrainType: "Costa",
      environment: "Rocoso",
      privacity: "Media",
      petFriendly: false,
      elevation: 332,
      isPopular: true,
    },
    {
      id: "popular_3",
      title: "Font Roja",
      name: "Parque Natural Font Roja",
      description: "Bosque mediterráneo con zona de acampada. Ideal para familias y amantes de la naturaleza.",
      location: "38.6500, -0.5333",
      latitude: 38.6500,
      longitude: -0.5333,
      rating: "4.7",
      reviews: "156 reviews",
      position: [38.6500, -0.5333],
      photoUrls: ["https://picsum.photos/seed/fontroja/400/300"],
      accessDifficulty: "Fácil",
      terrainType: "Bosque",
      environment: "Natural",
      privacity: "Media",
      petFriendly: true,
      elevation: 1050,
      isPopular: true,
    },
    // Populares en España
    {
      id: "popular_4",
      title: "Picos de Europa",
      name: "Refugio Picos de Europa",
      description: "Uno de los lugares más emblemáticos para vivac en España. Montañas espectaculares y fauna salvaje.",
      location: "43.1978, -4.8508",
      latitude: 43.1978,
      longitude: -4.8508,
      rating: "4.9",
      reviews: "342 reviews",
      position: [43.1978, -4.8508],
      photoUrls: ["https://picsum.photos/seed/picos/400/300"],
      accessDifficulty: "Difícil",
      terrainType: "Alta montaña",
      environment: "Alpino",
      privacity: "Alta",
      petFriendly: false,
      elevation: 2200,
      isPopular: true,
    },
    {
      id: "popular_5",
      title: "Sierra Nevada",
      name: "Refugio Sierra Nevada",
      description: "La montaña más alta de la Península. Zona de vivac con permisos especiales.",
      location: "37.0535, -3.3115",
      latitude: 37.0535,
      longitude: -3.3115,
      rating: "4.8",
      reviews: "278 reviews",
      position: [37.0535, -3.3115],
      photoUrls: ["https://picsum.photos/seed/nevada/400/300"],
      accessDifficulty: "Moderada",
      terrainType: "Alta montaña",
      environment: "Alpino",
      privacity: "Alta",
      petFriendly: true,
      elevation: 2800,
      isPopular: true,
    },
    {
      id: "popular_6",
      title: "Pirineos - Ordesa",
      name: "Valle de Ordesa",
      description: "Parque Nacional con zonas de vivac autorizadas. Cascadas impresionantes y paisajes únicos.",
      location: "42.6333, -0.0500",
      latitude: 42.6333,
      longitude: -0.0500,
      rating: "4.9",
      reviews: "412 reviews",
      position: [42.6333, -0.0500],
      photoUrls: ["https://picsum.photos/seed/ordesa/400/300"],
      accessDifficulty: "Moderada",
      terrainType: "Montaña",
      environment: "Bosque",
      privacity: "Alta",
      petFriendly: false,
      elevation: 1800,
      isPopular: true,
    },
    {
      id: "popular_7",
      title: "Cabo de Gata",
      name: "Playa de Gata",
      description: "Zona de acampada junto al mar en el único desierto de Europa. Playas vírgenes.",
      location: "36.7283, -2.1283",
      latitude: 36.7283,
      longitude: -2.1283,
      rating: "4.5",
      reviews: "189 reviews",
      position: [36.7283, -2.1283],
      photoUrls: ["https://picsum.photos/seed/gata/400/300"],
      accessDifficulty: "Fácil",
      terrainType: "Costa",
      environment: "Desértico",
      privacity: "Media",
      petFriendly: true,
      elevation: 10,
      isPopular: true,
    },
    {
      id: "popular_8",
      title: "Gredos",
      name: "Circo de Gredos",
      description: "Zona de alta montaña con lagunas glaciares. Experiencia de vivac inolvidable.",
      location: "40.2547, -5.2986",
      latitude: 40.2547,
      longitude: -5.2986,
      rating: "4.7",
      reviews: "234 reviews",
      position: [40.2547, -5.2986],
      photoUrls: ["https://picsum.photos/seed/gredos/400/300"],
      accessDifficulty: "Difícil",
      terrainType: "Alta montaña",
      environment: "Alpino",
      privacity: "Alta",
      petFriendly: false,
      elevation: 2400,
      isPopular: true,
    },
  ];

  // Cargar vivacs desde el backend + locales + populares
  useEffect(() => {
    const loadVivacs = async () => {
      let allSpots = [...getInitialSpots()];

      // Cargar vivacs locales guardados
      const localVivacs = JSON.parse(localStorage.getItem("vivac_local_spots") || "[]");
      allSpots = [...allSpots, ...localVivacs];

      try {
        const response = await fetch(`${API_BASE_URL}/vivacs`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          const transformedSpots = data.map((vivac) => ({
            id: vivac.id,
            title: vivac.name,
            name: vivac.name,
            description: vivac.description,
            location: `${vivac.latitude}, ${vivac.longitude}`,
            latitude: parseFloat(vivac.latitude),
            longitude: parseFloat(vivac.longitude),
            rating: vivac.avgRating || "0",
            reviews: `${vivac.reviewCount} reviews`,
            position: [parseFloat(vivac.latitude), parseFloat(vivac.longitude)],
            photoUrls: vivac.photoUrls || [],
            accessDifficulty: vivac.accessDifficulty,
            terrainType: vivac.terrainType,
            environment: vivac.environment,
            privacity: vivac.privacity,
            petFriendly: vivac.petFriendly,
            createdBy: vivac.createdBy,
            elevation: vivac.elevation,
          }));
          allSpots = [...allSpots, ...transformedSpots];
        }
      } catch (error) {
        console.log("API unavailable, using local data only");
      }

      setSpots(allSpots);
    };
    loadVivacs();
  }, []);

  useEffect(() => {
    setAuthError("");
    setStatusMessage("");
  }, [view]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setStatusMessage("");

    if (!loginEmail || !loginPassword) {
      setAuthError("Por favor completa todos los campos.");
      return;
    }

    setLoginLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Error parsing response:", e);
      }

      if (response.ok && data) {
        localStorage.setItem("vivac_auth", JSON.stringify(data));
        setStatusMessage("Has iniciado sesión correctamente.");
        setLastMainScreen("home");
        setCurrentScreen("home");
        setLoginEmail("");
        setLoginPassword("");
      } else {
        const message =
          data?.message || data?.error || "No se ha podido iniciar sesión.";
        setAuthError(message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Error de conexión. Verifica tu conexión a internet.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setStatusMessage("");

    if (!registerUserName || !registerEmail || !registerPassword) {
      setAuthError("Por favor completa todos los campos.");
      return;
    }

    // Validar que las contraseñas coincidan
    if (registerPassword !== registerPasswordConfirm) {
      setAuthError("Las contraseñas no coinciden.");
      return;
    }

    setRegisterLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          userName: registerUserName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Error parsing response:", e);
      }

      if (response.ok && data) {
        localStorage.setItem("vivac_auth", JSON.stringify(data));
        setStatusMessage("Cuenta creada correctamente.");
        setLastMainScreen("home");
        setCurrentScreen("home");
        setRegisterUserName("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterPasswordConfirm("");
      } else {
        const message =
          data?.message || data?.error || "No se ha podido crear la cuenta.";
        setAuthError(message);
      }
    } catch (error) {
      console.error("Register error:", error);
      setAuthError("Error de conexión. Verifica tu conexión a internet.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleForgotSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setStatusMessage("");
    setForgotLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/request-password-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          (data && (data.message || data.error)) ||
          "No se ha podido enviar el correo.";
        setAuthError(message);
      } else {
        setStatusMessage(
          "Se ha enviado un correo con instrucciones para recuperar tu contraseña."
        );
        setForgotEmail("");
      }
    } catch (error) {
      setAuthError("Error de red o servidor. Inténtalo de nuevo.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleGoogleCredentialResponse = useCallback(async (response) => {
    try {
      const result = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await result.json().catch(() => null);
      if (!result.ok) {
        const message =
          (data && (data.message || data.error)) ||
          "No se ha podido iniciar sesión con Google.";
        setAuthError(message);
      } else {
        localStorage.setItem("vivac_auth", JSON.stringify(data));
        setStatusMessage("Has iniciado sesión con Google correctamente.");
        setLastMainScreen("home");
        setCurrentScreen("home");
      }
    } catch (error) {
      setAuthError("Error de red o servidor con Google.");
    }
  }, []);

  useEffect(() => {
    // Limpiar el botón cuando no estamos en login
    if (view !== "login") {
      const button = document.getElementById("googleSignInDiv");
      if (button) {
        button.innerHTML = "";
      }
      return;
    }

    const initGoogle = () => {
      if (
        !window.google ||
        !window.google.accounts ||
        !window.google.accounts.id
      ) {
        return;
      }
      try {
        const button = document.getElementById("googleSignInDiv");
        if (!button) {
          return;
        }

        // Verificar si el botón ya está renderizado
        if (button.querySelector('iframe') || button.querySelector('div[role="button"]')) {
          return; // Ya está renderizado, no hacer nada
        }

        // Limpiar cualquier contenido previo
        button.innerHTML = "";

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
        });

        window.google.accounts.id.renderButton(button, {
          theme: "outline",
          size: "large",
          width: "100%",
          shape: "rectangular",
          text: "continue_with",
          locale: "es",
        });
      } catch (error) {
        console.error("Error initializing Google Sign-In:", error);
        const button = document.getElementById("googleSignInDiv");
        if (button) {
          button.style.display = "none";
        }
      }
    };

    if (window.googleLoaded) {
      // Pequeño delay para asegurar que el DOM esté listo
      const timeoutId = setTimeout(initGoogle, 100);
      return () => {
        clearTimeout(timeoutId);
        const button = document.getElementById("googleSignInDiv");
        if (button) {
          button.innerHTML = "";
        }
      };
    } else {
      const checkGoogle = setInterval(() => {
        if (window.googleLoaded) {
          clearInterval(checkGoogle);
          setTimeout(initGoogle, 100);
        }
      }, 100);
      return () => {
        clearInterval(checkGoogle);
        const button = document.getElementById("googleSignInDiv");
        if (button) {
          button.innerHTML = "";
        }
      };
    }
  }, [view, handleGoogleCredentialResponse]);

  const handleLogout = () => {
    localStorage.removeItem("vivac_auth");
    setCurrentScreen("auth");
    setView("login");
    setLoginEmail("");
    setLoginPassword("");
    setAuthError("");
    setStatusMessage("");
  };

  const handleNavigate = (screen, data) => {
    if (screen === "vivacDetail" && data) {
      setSelectedVivac(data);
      setCurrentScreen("vivacDetail");
    } else if (screen === "createVivac") {
      setLastMainScreen(currentScreen);
      setCurrentScreen("createVivac");
    } else if (screen === "home" || screen === "explore" || screen === "profile" || screen === "community") {
      setLastMainScreen(screen);
      setCurrentScreen(screen);
    } else if (screen === "groupDetail" && data) {
      setCurrentScreen("groupDetail");
      setSelectedVivac(data); // Reutilizamos este estado para el grupo seleccionado
    } else if (screen === "groupMembers" && data) {
      setCurrentScreen("groupMembers");
      setSelectedVivac(data);
    } else if (screen === "groupChat" && data) {
      setCurrentScreen("groupChat");
      setSelectedVivac(data);
    } else if (screen === "publicProfile" && data) {
      setCurrentScreen("publicProfile");
      setSelectedVivac(data); // Reutilizamos este estado para el userId
    }
  };

  const handleCreateVivac = async (vivacData) => {
    const authData = localStorage.getItem("vivac_auth");
    if (!authData) {
      setAuthError("Debes iniciar sesión para crear un vivac.");
      setCurrentScreen("auth");
      return;
    }

    const parsedAuth = JSON.parse(authData);
    const { token } = parsedAuth;

    // Helper function to create local vivac
    const createLocalVivac = () => {
      const localId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const transformedSpot = {
        id: localId,
        title: vivacData.name,
        name: vivacData.name,
        description: vivacData.description,
        location: `${vivacData.latitude}, ${vivacData.longitude}`,
        latitude: parseFloat(vivacData.latitude),
        longitude: parseFloat(vivacData.longitude),
        rating: "0",
        reviews: "0 reviews",
        position: [parseFloat(vivacData.latitude), parseFloat(vivacData.longitude)],
        photoUrls: vivacData.photoUrls || [],
        accessDifficulty: vivacData.accessDifficulty,
        terrainType: vivacData.terrainType,
        environment: vivacData.environment,
        privacity: vivacData.privacity,
        petFriendly: vivacData.petFriendly,
        createdBy: parsedAuth.id || "local_user",
        elevation: vivacData.elevation,
        isLocal: true,
      };

      // Save to localStorage
      const localVivacs = JSON.parse(localStorage.getItem("vivac_local_spots") || "[]");
      localVivacs.push(transformedSpot);
      localStorage.setItem("vivac_local_spots", JSON.stringify(localVivacs));

      setSpots((prevSpots) => [...prevSpots, transformedSpot]);
      setCurrentScreen(lastMainScreen);
      alert("¡Vivac creado correctamente!");
    };

    try {
      const response = await fetch(`${API_BASE_URL}/vivacs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vivacData),
      });

      if (response.ok) {
        const newVivac = await response.json();
        const transformedSpot = {
          id: newVivac.id,
          title: newVivac.name,
          name: newVivac.name,
          description: newVivac.description,
          location: `${newVivac.latitude}, ${newVivac.longitude}`,
          latitude: parseFloat(newVivac.latitude),
          longitude: parseFloat(newVivac.longitude),
          rating: newVivac.avgRating || "0",
          reviews: `${newVivac.reviewCount} reviews`,
          position: [parseFloat(newVivac.latitude), parseFloat(newVivac.longitude)],
          photoUrls: newVivac.photoUrls || [],
          accessDifficulty: newVivac.accessDifficulty,
          terrainType: newVivac.terrainType,
          environment: newVivac.environment,
          privacity: newVivac.privacity,
          petFriendly: newVivac.petFriendly,
          createdBy: newVivac.createdBy,
          elevation: newVivac.elevation,
        };
        setSpots((prevSpots) => [...prevSpots, transformedSpot]);
        setCurrentScreen(lastMainScreen);
        alert("¡Vivac creado correctamente!");
      } else {
        // API failed - create locally as fallback
        console.log("API unavailable, creating vivac locally");
        createLocalVivac();
      }
    } catch (error) {
      // Network error - create locally as fallback
      console.log("Network error, creating vivac locally");
      createLocalVivac();
    }
  };

  if (currentScreen === "profile") {
    return (
      <ProfileScreen
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        spots={spots}
        savedVivacIds={savedVivacIds}
      />
    );
  }

  if (currentScreen === "vivacDetail") {
    return (
      <VivacDetailScreen
        vivac={selectedVivac}
        onClose={() => setCurrentScreen(lastMainScreen)}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentScreen === "createVivac") {
    return (
      <CreateVivacScreen
        onClose={() => setCurrentScreen(lastMainScreen)}
        onCreateVivac={handleCreateVivac}
        existingSpots={spots}
      />
    );
  }

  if (currentScreen === "home") {
    return (
      <HomeScreen
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        spots={spots}
      />
    );
  }

  if (currentScreen === "explore") {
    return (
      <ExploreScreen
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        spots={spots}
        savedVivacIds={savedVivacIds}
        onToggleSave={toggleSaveVivac}
      />
    );
  }

  if (currentScreen === "community") {
    return (
      <CommunityScreen
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentScreen === "groupDetail") {
    return (
      <GroupDetailScreen
        group={selectedVivac}
        onNavigate={handleNavigate}
        onClose={() => setCurrentScreen("community")}
      />
    );
  }

  if (currentScreen === "groupMembers") {
    return (
      <GroupMembersScreen
        group={selectedVivac}
        onClose={() => setCurrentScreen("groupDetail")}
      />
    );
  }

  if (currentScreen === "groupChat") {
    return (
      <GroupChatScreen
        group={selectedVivac}
        onClose={() => setCurrentScreen("groupDetail")}
      />
    );
  }

  if (currentScreen === "publicProfile") {
    return (
      <PublicProfileScreen
        userId={selectedVivac}
        onClose={() => setCurrentScreen(lastMainScreen)}
        onNavigate={handleNavigate}
        spots={spots}
      />
    );
  }

  if (currentScreen === "settings") {
    return (
      <SettingsScreen
        onClose={() => setCurrentScreen(lastMainScreen)}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
           <img src="/logo.png" alt="Logo Vivac" className="logo-image" />
          <h1 className="welcome-title">Bienvenido a VivacWeb</h1>
          <p className="welcome-subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit vulputate.
          </p>
        </div>

        <div className="auth-card">
          <h2 className="auth-card-title">
            {view === "login" && "Iniciar sesión"}
            {view === "register" && "Crear cuenta"}
            {view === "forgot" && "Recuperar contraseña"}
          </h2>

          {authError && (
            <div className="auth-alert auth-alert-error">{authError}</div>
          )}
          {statusMessage && (
            <div className="auth-alert auth-alert-success">{statusMessage}</div>
          )}

          {view === "login" && (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="form-field">
                <label htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="login-password">Contraseña</label>
                <div className="password-field">
                  <input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showLoginPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={loginLoading}
              >
                {loginLoading ? "Accediendo..." : "Acceder"}
              </button>
            </form>
          )}

          {view === "register" && (
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="form-field">
                <label htmlFor="register-username">Nombre de usuario</label>
                <input
                  id="register-username"
                  type="text"
                  placeholder="Tu nombre de usuario"
                  value={registerUserName}
                  onChange={(event) => setRegisterUserName(event.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="register-email">Email</label>
                <input
                  id="register-email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="register-password">Contraseña</label>
                <div className="password-field">
                  <input
                    id="register-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 número, 1 símbolo"
                    value={registerPassword}
                    onChange={(event) =>
                      setRegisterPassword(event.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    <span className="material-symbols-outlined">
                      {showLoginPassword ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="register-password-confirm">
                  Confirmar contraseña
                </label>
                <input
                  id="register-password-confirm"
                  type="password"
                  placeholder="Confirma tu contraseña"
                  value={registerPasswordConfirm}
                  onChange={(event) =>
                    setRegisterPasswordConfirm(event.target.value)
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-button"
                disabled={registerLoading}
              >
                {registerLoading ? "Creando cuenta..." : "Registrarse"}
              </button>
            </form>
          )}

          {view === "forgot" && (
            <form className="auth-form" onSubmit={handleForgotSubmit}>
              <div className="form-field">
                <label htmlFor="forgot-email">Email</label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={forgotEmail}
                  onChange={(event) => setForgotEmail(event.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-button"
                disabled={forgotLoading}
              >
                {forgotLoading ? "Enviando..." : "Acceder"}
              </button>
            </form>
          )}

          {view === "login" && (
            <>
              <button
                type="button"
                className="forgot-link"
                onClick={() => setView("forgot")}
              >
                ¿Has olvidado tu contraseña?
              </button>

              <div className="divider">
                <div className="divider-line"></div>
                <div className="divider-dot"></div>
              </div>

              <div id="googleSignInDiv" className="google-button-placeholder"></div>

              <div className="auth-footer">
                ¿Aún no tienes una cuenta?{" "}
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => setView("register")}
                >
                  Regístrate
                </button>
              </div>
            </>
          )}

          {view === "register" && (
            <div className="auth-footer">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                className="inline-link"
                onClick={() => setView("login")}
              >
                Inicia sesión
              </button>
            </div>
          )}

          {view === "forgot" && (
            <div className="auth-footer">
              <button
                type="button"
                className="inline-link"
                onClick={() => setView("login")}
              >
                Volver al login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
