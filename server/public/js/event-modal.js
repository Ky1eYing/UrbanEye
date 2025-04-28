/* global getEventByEventId, createEvent */

const openCreateEventModalBtn = document.getElementById("openCreateEventModal");
const createEventModal = document.getElementById("createEventModal");
const closeCreateEventModalBtn = document.getElementById("closeCreateEventModal");
const submitCreateEventBtn = document.getElementById("submitCreateEvent");

let createMap;
let geolocationCenter;
let selectedMarkerPosition = null;  // final marker position
let selectedMarker;

// open create event modal
openCreateEventModalBtn.addEventListener("click", () => {
    showCreateEventModal();


});

// close create event modal
closeCreateEventModalBtn.addEventListener("click", () => {
    createEventModal.style.display = "none";
});
createEventModal.addEventListener("click", event => {
    if (event.target === createEventModal) {
        createEventModal.style.display = "none";
    }
});

// show create event modal
function showCreateEventModal() {
    // Show the modal
    createEventModal.style.display = "flex";
    
    // Reset form fields
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventContent").value = "";
    
    // Reset image upload
    const imageUploadInput = document.getElementById("imageUpload");
    if (imageUploadInput) {
        imageUploadInput.value = "";
    }
    
    // Clear category selection
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    categoryRadios.forEach(radio => radio.checked = false);
    
    // Reset error message
    const errorMessage = document.getElementById("errorMessage");
    if (errorMessage) {
        errorMessage.style.display = "none";
    }
    
    // Get user location for the map
    geolocationCenter = null;
    selectedMarkerPosition = null;
    
    // Initialize map with user location
    initCreateEventMap();
    
    // Update address display
    const addressOfMap = document.getElementById("addressOfMap");
    if (addressOfMap) {
        addressOfMap.innerHTML = '<i class="fas fa-map-marker-alt"></i>Select a location on the map';
    }
    
    // Set up "My Location" button
    const myLocationBtn = document.getElementById("myLocation");
    if (myLocationBtn) {
        myLocationBtn.addEventListener("click", function() {
            if (window.userLocationMarker) {
                const pos = window.userLocationMarker.getPosition();
                createMap.setCenter(pos);
                selectedMarker.setPosition(pos);
                selectedMarkerPosition = { lat: pos.lat(), lng: pos.lng() };
                
                // Update address display
                if (addressOfMap) {
                    addressOfMap.innerHTML = `<i class="fas fa-map-marker-alt"></i>My Location (${pos.lat().toFixed(6)}, ${pos.lng().toFixed(6)})`;
                }
            }
        });
    }
}

// init create event map
function initCreateEventMap() {

    /****** Get my location ******/
    if (!geolocationCenter) {
        // use high accuracy location
        if (window.userLocationMarker) {
            const p = window.userLocationMarker.getPosition();
            geolocationCenter = { lat: p.lat(), lng: p.lng() };
        }
        // if high accuracy location is not available, use estimated location
        else if (window.preFetchedPosition) {
            geolocationCenter = window.preFetchedPosition;
        }
        // if neither is available, use default location
        else {
            geolocationCenter = { lat: 40.768712448459844, lng: -73.98179241229592 };
        }
        selectedMarkerPosition = { ...geolocationCenter };
    }

    /****** Create map ******/
    if (createMap) return;

    // create map
    const mapDiv = document.getElementById("createEventMap");
    createMap = new google.maps.Map(mapDiv, {
        center: geolocationCenter,
        zoom: 14,
        styles: isDarkMode() ? darkModeStyles : defaultStyles,
        disableDefaultUI: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        keyboardShortcuts: false,
        reportError: false,
        gestureHandling: 'greedy',

    });

    // create marker
    selectedMarker = new google.maps.Marker({
        position: selectedMarkerPosition,
        map: createMap,
        title: "selected location",
        draggable: true,
        animation: google.maps.Animation.DROP
    });

    selectedMarker.addListener("dragend", event => {
        selectedMarkerPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        console.log("marker position updated", selectedMarkerPosition);
    });

    createMap.addListener("click", event => {
        selectedMarkerPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        selectedMarker.setPosition(selectedMarkerPosition);
        console.log("marker position updated", selectedMarkerPosition);
    });
}

// Submit form
submitCreateEventBtn.addEventListener("click", async () => {
    // Get form data
    const imageFile = document.getElementById("imageUpload").files[0];
    const selectedCategory = document.querySelector("input[name='category']:checked")?.value;
    const title = document.getElementById("eventTitle").value.trim();
    const content = document.getElementById("eventContent").value.trim();

    // Validate form data
    if (!selectedCategory) { alert("Please select a category"); return; }
    if (!title) { alert("Please enter a title"); return; }
    if (!content) { alert("Please enter a description"); return; }
    if (!selectedMarkerPosition) { alert("Please select a location on the map"); return; }

    // Show loading state
    submitCreateEventBtn.disabled = true;
    submitCreateEventBtn.textContent = "Creating...";

    try {
        const eventId = await createEvent(
            imageFile, 
            selectedCategory, 
            title, 
            content, 
            selectedMarkerPosition
        );

        if (eventId) {
            alert("Event created successfully!");
            createEventModal.style.display = "none";
            
            // Navigate to the new event's detail page
            pushEventDetail(eventId);
            await showEventDetail();
        } else {
            alert("Failed to create event. Please try again.");
        }
    } catch (error) {
        console.error("Error creating event:", error);
        alert("An error occurred: " + error.message);
    } finally {
        // Reset button state
        submitCreateEventBtn.disabled = false;
        submitCreateEventBtn.textContent = "Submit";
    }
});

// Image preview
document.getElementById("imageUpload").addEventListener("change", function(e) {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadPlaceholder = document.querySelector(".upload-placeholder");
            if (uploadPlaceholder) {
                // Clear the placeholder and add the image preview
                uploadPlaceholder.innerHTML = '';
                const previewImg = document.createElement("img");
                previewImg.src = e.target.result;
                previewImg.className = "image-preview";
                previewImg.style.maxWidth = "100%";
                previewImg.style.maxHeight = "200px";
                previewImg.style.objectFit = "contain";
                uploadPlaceholder.appendChild(previewImg);
            }
        };
        reader.readAsDataURL(file);
    }
});