// Global variables for location data
window.preFetchedPosition = null;
window.userLocationMarker = null;

// Check if already have a saved position
const savedPosition = localStorage.getItem('userPosition');
const savedTimestamp = localStorage.getItem('userPositionTimestamp');
const positionMaxAge = 60 * 60 * 1000;

// Initialize location service
(function initLocationService() {
    console.log("Location service initializing...");

    // Check if position is still valid
    if (savedPosition && savedTimestamp && (Date.now() - parseInt(savedTimestamp)) <= positionMaxAge) {
        // Use saved position
        try {
            const position = JSON.parse(savedPosition);
            console.log("Using saved location from storage (< 1 hour old)", position);
            setGlobalPosition(position);
        } catch (e) {
            console.error("Error parsing saved position, fetching new one", e);
            getLocation();
        }
    } else {
        // Get new position
        console.log("No valid saved position found or it's expired, getting new location");
        getLocation();
    }
})();

// Get user location
function getLocation() {
    if (!navigator.geolocation) {
        console.warn("Browser does not support Geolocation");
        return;
    }

    // Get low-accuracy position first
    getLowAccuracyLocation();

    // Get high-accuracy position
    setTimeout(() => {
        getHighAccuracyLocation();
    }, 2000);
}

// Low accuracy location
function getLowAccuracyLocation() {
    if (!navigator.geolocation) {
        console.warn("Browser does not support Geolocation");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log("Low accuracy location obtained", pos);
            setGlobalPosition(pos);
            savePosition(pos);
        },
        error => {
            console.warn("Low accuracy location error:", error.message);
        },
        {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 300000
        }
    );
}

// High accuracy location
function getHighAccuracyLocation() {
    if (!navigator.geolocation) {
        console.warn("Browser does not support Geolocation");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log("High accuracy location obtained", pos);
            setGlobalPosition(pos);
            savePosition(pos);
        },
        error => {
            console.warn("High accuracy location error:", error.message);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Save position to localStorage
function savePosition(position) {
    try {
        localStorage.setItem('userPosition', JSON.stringify(position));
        localStorage.setItem('userPositionTimestamp', Date.now().toString());
        console.log("Location saved to localStorage");
    } catch (e) {
        console.error("Error saving position to localStorage", e);
    }
}

// Set global position variables used by other scripts
function setGlobalPosition(position) {
    window.preFetchedPosition = position;

    // Dispatch an event so other scripts can react to new location
    const event = new CustomEvent('userLocationUpdated', { detail: position });
    document.dispatchEvent(event);
} 
