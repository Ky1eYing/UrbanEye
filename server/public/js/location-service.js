// Global variables for location data
window.preFetchedPosition = null;
window.userLocationMarker = null;

// Check if already have a saved position
const savedPosition = localStorage.getItem('userPosition');
const savedTimestamp = localStorage.getItem('userPositionTimestamp');
const positionMaxAge = 15 * 60 * 1000;

// distance change threshold
const SIGNIFICANT_DISTANCE_CHANGE = 500; // 500 meters

// Initialize location service
(function initLocationService() {
    console.log("Location service initializing...");

    // Always check current position to compare with saved one
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            newPosition => {
                const currentPos = {
                    lat: newPosition.coords.latitude,
                    lng: newPosition.coords.longitude
                };

                // Always update the global position for immediate use
                setGlobalPosition(currentPos);

                // If we have a saved position, check if it's different from the current position
                if (savedPosition) {
                    try {
                        const savedPos = JSON.parse(savedPosition);
                        // Check if location has changed
                        if (hasMoved(savedPos, currentPos)) {
                            console.log("Location has changed significantly, updating saved position");
                            savePosition(currentPos);
                        } else if ((Date.now() - parseInt(savedTimestamp)) > positionMaxAge) {
                            // If position hasn't changed much but timestamp is old, update timestamp
                            console.log("Refreshing position timestamp");
                            savePosition(currentPos);
                        } else {
                            console.log("Using existing position, no significant change detected");
                        }
                    } catch (e) {
                        console.error("Error parsing saved position, saving new one", e);
                        savePosition(currentPos);
                    }
                } else {
                    console.log("No saved position found, saving current position");
                    savePosition(currentPos);
                }
            },
            error => {
                console.warn("Initial position check failed:", error.message);
                checkCachedPosition();
            },
            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        checkCachedPosition();
    }
})();

// Check if cached position is valid or needs refresh
function checkCachedPosition() {
    // Check if need to get a new position
    const needNewPosition = !savedPosition ||
        !savedTimestamp ||
        (Date.now() - parseInt(savedTimestamp)) > positionMaxAge;

    if (needNewPosition) {
        console.log("Getting fresh user location...");
        // get low accuracy position first
        getLowAccuracyLocation();

        // get high accuracy in the background
        setTimeout(() => {
            getHighAccuracyLocation();
        }, 2000);
    } else {
        // Use saved position
        try {
            const position = JSON.parse(savedPosition);
            console.log("Using saved location from storage", position);
            setGlobalPosition(position);
        } catch (e) {
            console.error("Error parsing saved position, fetching new one", e);
            getLowAccuracyLocation();
        }
    }
}

// Check if user has moved
function hasMoved(pos1, pos2) {
    //  Haversine formula
    const toRad = x => x * Math.PI / 180;
    const R = 6371e3;

    const lat1 = toRad(pos1.lat);
    const lat2 = toRad(pos2.lat);
    const deltaLat = toRad(pos2.lat - pos1.lat);
    const deltaLng = toRad(pos2.lng - pos1.lng);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    console.log(`Distance between saved and current position: ${distance.toFixed(2)} meters`);

    return distance > SIGNIFICANT_DISTANCE_CHANGE;
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
            maximumAge: 300000 // 5 minutes
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