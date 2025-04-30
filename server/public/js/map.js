let map;
// nyc location
const nyPosition = { lat: 40.75171244845984, lng: -73.98179241229592 };
let userLocationMarker = null;
let mapInitialized = false;

// get pre-fetched position
let preFetchedPosition = null;
let preFetchDone = false;

// dark mode styles
const darkModeStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

// default styles
const defaultStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  console.log("page ready: loading Google Maps script");
  loadGoogleMapsAPI();         // load map

  // Listen for location updates from location-service.js
  document.addEventListener('userLocationUpdated', (e) => {
    if (mapInitialized && e.detail) {
      console.log("Map received location update from service", e.detail);
      updateUserLocation(e.detail, "(from service)");
    }
  });
});

// check if dark mode
function isDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// load Google Maps API 
function loadGoogleMapsAPI() {
  if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
    console.log("loading Google Maps API...");
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBZ1cnugGu4jiIWn3PipPsmG1Vli9hTEmo&libraries=geometry&callback=initMap&language=en&region=US&loading=async";
    script.async = true;
    script.onerror = () => {
      console.error("Google Maps API loading failed");
      const mapEl = document.getElementById("map");
      if (mapEl) {
        mapEl.innerHTML = '<div style="text-align:center;padding:50px;">cannot load map, please check network or try again later</div>';
      }
    };
    document.body.appendChild(script);
  } else {
    initMap();
  }
}

// init map
function initMap() {
  // create map and container element
  map = new google.maps.Map(document.getElementById("map"), {
    center: nyPosition,
    zoom: 12.8,
    styles: isDarkMode() ? darkModeStyles : defaultStyles,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    keyboardShortcuts: false,
    reportError: false
  });

  // listen dark mode change
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    map.setOptions({ styles: e.matches ? darkModeStyles : defaultStyles });
  });

  // 添加"回到我的位置"按钮
  addMyLocationButton(map);

  mapInitialized = true;
  console.log("main map created");

  // 添加一些示例事件标记
  addSampleMarkers();

  // Check if already have the position from the location service
  if (window.preFetchedPosition) {
    console.log("using position from location service", window.preFetchedPosition);
    updateUserLocation(window.preFetchedPosition, "(from service)");
  } else {
    if (preFetchDone && preFetchedPosition) {
      console.log("use pre-fetched location");
      updateUserLocation(preFetchedPosition, "(estimated)");
    } else {
      // Only get low accuracy location if we don't have any position yet
      google.maps.event.addListenerOnce(map, 'idle', () => {
        console.log("map idle, start high accuracy location");
        getLowAccuracyLocation();
      });
    }
  }
}

// add my location button
function addMyLocationButton(map) {
  // create button element
  const locationButton = document.createElement("button");
  locationButton.classList.add("my-location-button");
  locationButton.innerHTML = '<i class="fas fa-location-arrow"></i>';
  locationButton.title = "back to my location";

  // add styles
  locationButton.style.backgroundColor = "#fff";
  locationButton.style.border = "none";
  locationButton.style.borderRadius = "2px";
  locationButton.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
  locationButton.style.cursor = "pointer";
  locationButton.style.margin = "10px";
  locationButton.style.padding = "0";
  locationButton.style.width = "40px";
  locationButton.style.height = "40px";
  locationButton.style.textAlign = "center";
  locationButton.style.lineHeight = "40px";
  locationButton.style.fontSize = "18px";
  locationButton.style.borderRadius = "50%";
  locationButton.style.transition = "background-color 0.3s ease";
  locationButton.addEventListener("mouseover", () => {
    locationButton.style.backgroundColor = "#f1f1f1";
  });
  locationButton.addEventListener("mouseout", () => {
    locationButton.style.backgroundColor = "#fff";
  });

  locationButton.addEventListener("click", () => {
    // check if user location marker exists
    if (userLocationMarker) {
      const pos = userLocationMarker.getPosition();
      map.setCenter(pos);
      map.setZoom(15);
    }
    else if (window.preFetchedPosition) {
      map.setCenter(window.preFetchedPosition);
      map.setZoom(15);

      if (!userLocationMarker) {
        updateUserLocation(window.preFetchedPosition, "(from service)");
      }
    }
    else {
      locationButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          map.setCenter(pos);
          map.setZoom(15);
          updateUserLocation(pos, "(new)");

          locationButton.innerHTML = '<i class="fas fa-location-arrow"></i>';
        },
        (error) => {
          console.error("Error getting location: ", error);
          locationButton.innerHTML = '<i class="fas fa-location-arrow"></i>';
          alert("cannot get your location, please check your location permission");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  });

  // add button to map right bottom
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);
}

// low accuracy pre-fetch location
function preFetchUserLocation() {
  if (!navigator.geolocation) {
    console.warn("browser does not support Geolocation");
    preFetchDone = true;
    return;
  }
  navigator.geolocation.getCurrentPosition(
    position => {
      preFetchedPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      window.preFetchedPosition = preFetchedPosition;
      preFetchDone = true;
      console.log("pre-fetch location done", preFetchedPosition);
      if (mapInitialized) {
        updateUserLocation(preFetchedPosition, "(estimated)");
      }
    },
    error => {
      console.warn("pre-fetch location failed", error.message);
      preFetchDone = true;
    },
    {
      enableHighAccuracy: false,
      maximumAge: 300_000
    }
  );
}

// high accuracy location
function getHighAccuracyLocation() {
  if (!navigator.geolocation) {
    console.warn("browser does not support Geolocation");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    position => {
      const precisePos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log("high accuracy location done", precisePos);
      updateUserLocation(precisePos, "(precise)");
    },
    error => {
      console.warn("high accuracy location failed", error.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0
    }
  );
}

// update user location on map
function updateUserLocation(position, tag = "") {
  map.setCenter(position);
  if (userLocationMarker) {
    userLocationMarker.setPosition(position);
    userLocationMarker.setTitle(`Your Location ${tag}`);
  } else {
    userLocationMarker = new google.maps.Marker({
      position,
      map,
      title: `Your Location ${tag}`,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 2
      }
    });

    window.userLocationMarker = userLocationMarker;

    new google.maps.Circle({
      map,
      center: position,
      radius: 100,
      fillColor: "#4285F4",
      fillOpacity: 0.15,
      strokeColor: "#4285F4",
      strokeOpacity: 0.3,
      strokeWeight: 1
    });
  }
  console.log(`user location ${tag} updated on map:`, position);
}

// 添加示例事件标记
function addSampleMarkers() {
  const events = [
    { lat: 40.7589, lng: -73.9851, title: "Gun Shot Incident", type: "gun shot" },
    { lat: 40.7128, lng: -74.0060, title: "Traffic Accident", type: "accident" },
    { lat: 40.7282, lng: -73.9942, title: "Street Performance", type: "performance" },
    { lat: 40.7429, lng: -73.9712, title: "Road Closed", type: "road closed" },
    { lat: 40.7831, lng: -73.9712, title: "Food Truck Festival", type: "food truck" }
  ];

  events.forEach(event => {
    const marker = new google.maps.Marker({
      position: { lat: event.lat, lng: event.lng },
      map: map,
      title: event.title,
      // 可以根据事件类型定制图标
      // icon: getIconForEventType(event.type)
    });

    // 为标记添加点击事件
    marker.addListener("click", () => {
      // 在实际应用中，这里可以显示事件详情或跳转到事件详情页
      alert(event.title);
    });
  });
}

// 实用函数：根据事件类型返回不同的图标
// 这个功能可以根据需要扩展
function getIconForEventType(type) {
  const iconBase = "https://maps.google.com/mapfiles/ms/icons/";

  switch (type) {
    case "gun shot":
    case "fight":
    case "stealing":
    case "assaulting":
      return iconBase + "red-dot.png";
    case "traffic jam":
    case "road closed":
    case "accident":
      return iconBase + "yellow-dot.png";
    case "performance":
    case "food truck":
    case "parade":
      return iconBase + "blue-dot.png";
    default:
      return iconBase + "red-dot.png";
  }
} 