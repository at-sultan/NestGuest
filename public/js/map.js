// map.js - Leaflet with OpenStreetMap
function initMap() {
    const mapElement = document.getElementById('map');
    
    if (!mapElement) {
        console.log("No map element found on this page");
        return;
    }
    
    // Get coordinates from data attributes
    const lat = parseFloat(mapElement.dataset.lat);
    const lng = parseFloat(mapElement.dataset.lng);
    const title = mapElement.dataset.title;
    const address = mapElement.dataset.address;
    
    // Validate coordinates
    if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates:", lat, lng);
        showMapError(mapElement, "Location data not available");
        return;
    }
    
    // Check if coordinates are default Delhi
    const isDefaultLocation = (lat === 28.6139 && lng === 77.2090);
    
    try {
        // Initialize the map with appropriate zoom
        const map = L.map(mapElement).setView([lat, lng], isDefaultLocation ? 10 : 13);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
            minZoom: 3
        }).addTo(map);
        
        // Create custom icon
        const customIcon = L.divIcon({
            html: `<i class="fas fa-map-marker-alt fa-2x" style="color: ${isDefaultLocation ? '#ff6b00' : '#dc3545'};"></i>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
            className: 'custom-div-icon'
        });
        
        // Create popup content
        const popupContent = `
            <div class="text-center">
                <h6 class="fw-bold mb-2" style="color: ${isDefaultLocation ? '#ff6b00' : '#dc3545'};">
                    ${title}
                </h6>
                <p class="mb-1">${address}</p>
                <small class="text-muted">
                    Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}
                </small>
                ${isDefaultLocation ? 
                    '<br><small class="text-warning"><i class="fas fa-exclamation-triangle"></i> General location (Delhi)</small>' : 
                    ''
                }
            </div>
        `;
        
        // Add marker to map
        const marker = L.marker([lat, lng], { 
            icon: customIcon 
        }).addTo(map);
        
        // Bind popup to marker
        marker.bindPopup(popupContent);
        
        // Open popup by default
        marker.openPopup();
        
        // Fit map to marker with appropriate zoom
        const bounds = L.latLngBounds([lat, lng], [lat, lng]);
        map.fitBounds(bounds, { 
            padding: [30, 30],
            maxZoom: isDefaultLocation ? 10 : 15
        });
        
        // Handle map errors
        map.on('tileerror', function(error) {
            console.error('Map tile loading error:', error);
        });
        
    } catch (error) {
        console.error('Map initialization error:', error);
        showMapError(mapElement, "Failed to load map. Please try refreshing the page.");
    }
}

function showMapError(mapElement, message) {
    mapElement.innerHTML = `
        <div class="d-flex justify-content-center align-items-center h-100 bg-light rounded">
            <div class="text-center text-muted p-3">
                <i class="fas fa-map-marked-alt fa-3x mb-3 text-warning"></i>
                <p class="mb-0">${message}</p>
            </div>
        </div>
    `;
}

// Initialize map when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initMap, 500); // Increased delay for mobile
    });
} else {
    setTimeout(initMap, 500); // Increased delay for mobile
}