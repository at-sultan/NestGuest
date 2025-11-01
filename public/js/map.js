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
    
    // Check if coordinates are default (might indicate geocoding failed)
    const isDefaultLocation = (lat === 28.6139 && lng === 77.2090);
    
    try {
        // Initialize the map
        const map = L.map(mapElement).setView([lat, lng], 13);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);
        
        // Create custom icon
        const customIcon = L.divIcon({
            html: `<i class="fas fa-map-marker-alt fa-2x" style="color: ${isDefaultLocation ? '#ffc107' : '#dc3545'};"></i>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
            className: 'custom-div-icon'
        });
        
        // Create popup content
        const popupContent = `
            <div class="text-center">
                <h6 class="fw-bold mb-2" style="color: ${isDefaultLocation ? '#ffc107' : '#dc3545'};">${title}</h6>
                <p class="mb-1">${address}</p>
                <small class="text-muted">Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}</small>
                ${isDefaultLocation ? '<br><small class="text-warning"><i class="fas fa-exclamation-triangle"></i> Approximate location</small>' : ''}
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
        
        // Fit map to marker with padding
        map.fitBounds([[lat, lng]], { 
            padding: [20, 20],
            maxZoom: 15 
        });
        
        // Handle map errors
        map.on('tileerror', function(error) {
            console.error('Map tile loading error:', error);
        });
        
    } catch (error) {
        console.error('Map initialization error:', error);
        showMapError(mapElement, "Failed to load map");
    }
}

function showMapError(mapElement, message) {
    mapElement.innerHTML = `
        <div class="d-flex justify-content-center align-items-center h-100 bg-light">
            <div class="text-center text-muted">
                <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                <p>${message}</p>
            </div>
        </div>
    `;
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMap, 100);
});