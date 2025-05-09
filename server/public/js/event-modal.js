/* global getEventByEventId, createEvent */

const openCreateEventModalBtn = document.getElementById("openCreateEventModal");
const createEventModal = document.getElementById("createEventModal");
const closeCreateEventModalBtn = document.getElementById("closeCreateEventModal");
const submitCreateEventBtn = document.getElementById("submitCreateEvent");

let formattedAddress;
let createMap;
let geolocationCenter;
let selectedMarkerPosition = null; // final marker position
let selectedMarker;

// open create event modal
if (openCreateEventModalBtn) {
    openCreateEventModalBtn.addEventListener("click", () => {
        // Check if user is logged in before showing the modal
        if (typeof isLoggedIn === 'undefined' || !isLoggedIn) {
            alert("Please log in to create events");
            return;
        }

        showCreateEventModal();
    });
}

// close create event modal
closeCreateEventModalBtn.addEventListener("click", () => {
    document.body.style.overflow = '';
    createEventModal.style.display = "none";
});
createEventModal.addEventListener("click", event => {
    if (event.target === createEventModal) {
        document.body.style.overflow = '';
        createEventModal.style.display = "none";
    }
});


// Show create event modal
function showCreateEventModal(eventId) {
    // Show the modal
    document.body.style.overflow = 'hidden';
    createEventModal.style.display = "flex";

    // Clear any existing error or success messages
    clearFormErrorMessage();
    const errorElement = document.getElementById("errorMessage");
    if (errorElement) {
        errorElement.style.display = "none";
        errorElement.innerHTML = "";
    }

    if (eventId) {
        // Edit mode - load existing event data
        getEventByEventId(eventId).then(eventData => {
            if (eventData && eventData._id) {
                // Update modal title
                const modalTitle = createEventModal.querySelector("h2");
                if (modalTitle) {
                    modalTitle.textContent = "Edit Event";
                }



                if (eventData.photoUrl) {
                    const uploadPlaceholder = document.querySelector(".upload-placeholder");
                    const eventPhoto = document.getElementById("eventPhoto");
                    if (uploadPlaceholder && eventPhoto) {
                        uploadPlaceholder.style.display = "none";
                        eventPhoto.style.display = "flex";
                        eventPhoto.src = eventData.photoUrl;
                    }
                } else {
                    const uploadPlaceholder = document.querySelector(".upload-placeholder");
                    const eventPhoto = document.getElementById("eventPhoto");
                    if (uploadPlaceholder && eventPhoto) {
                        uploadPlaceholder.style.display = "flex";
                        eventPhoto.style.display = "none";
                        eventPhoto.src = '';
                    }
                }

                document.getElementById("eventTitle").value = eventData.title || "";
                document.getElementById("eventContent").value = eventData.content || "";

                const categoryRadio = document.querySelector(`input[name="category"][value="${eventData.category}"]`);
                if (categoryRadio) {
                    categoryRadio.checked = true;
                }

                if (eventData.location) {
                    geolocationCenter = {
                        lat: parseFloat(eventData.location.latitude),
                        lng: parseFloat(eventData.location.longitude)
                    };
                    selectedMarkerPosition = { ...geolocationCenter };

                    setTimeout(() => {
                        if (createMap && selectedMarker) {
                            createMap.setCenter(geolocationCenter);
                            selectedMarker.setPosition(geolocationCenter);
                            selectedMarkerPosition = geolocationCenter;

                            updateAddressDisplay(selectedMarkerPosition);
                        }
                    }, 300); // Delay to ensure map is initialized
                }

                if (submitCreateEventBtn) {
                    submitCreateEventBtn.textContent = "Update Event";
                    // Store the event ID as a data attribute for the submit handler
                    submitCreateEventBtn.setAttribute('data-edit-id', eventId);
                }
            } else {
                console.error("Could not load event data for editing");
            }
        }).catch(error => {
            console.error("Error loading event for editing:", error);
        });
    } else {
        // Create mode - reset form fields
        const modalTitle = createEventModal.querySelector("h2");
        if (modalTitle) {
            modalTitle.textContent = "Create Event";
        }


        document.getElementById("eventTitle").value = "";
        document.getElementById("eventContent").value = "";

        const uploadPlaceholder = document.querySelector(".upload-placeholder");
        const eventPhoto = document.getElementById("eventPhoto");
        if (uploadPlaceholder && eventPhoto) {
            uploadPlaceholder.style.display = "flex";
            eventPhoto.style.display = "none";
            eventPhoto.src = '';
        }

        const categoryRadios = document.querySelectorAll('input[name="category"]');
        categoryRadios.forEach(radio => radio.checked = false);

        const errorMessage = document.getElementById("errorMessage");
        if (errorMessage) {
            errorMessage.style.display = "none";
        }

        geolocationCenter = null;
        selectedMarkerPosition = null;

        const addressOfMap = document.getElementById("addressOfMap");
        if (addressOfMap) {
            addressOfMap.innerHTML = '<i class="fas fa-map-marker-alt"></i>Select a location on the map';
        }

        if (submitCreateEventBtn) {
            submitCreateEventBtn.textContent = "Submit";
            submitCreateEventBtn.removeAttribute('data-edit-id');
        }
    }

    initCreateEventMap();

    // Set up "My Location" button
    const myLocationBtn = document.getElementById("myLocation");
    if (myLocationBtn) {
        // Remove existing event listener to avoid duplicates
        const newLocationBtn = myLocationBtn.cloneNode(true);
        myLocationBtn.parentNode.replaceChild(newLocationBtn, myLocationBtn);

        newLocationBtn.addEventListener("click", function () {
            if (window.userLocationMarker) {
                // Use existing marker on map if available
                const pos = window.userLocationMarker.getPosition();
                createMap.setCenter(pos);
                selectedMarker.setPosition(pos);
                selectedMarkerPosition = { lat: pos.lat(), lng: pos.lng() };

                // Update address display
                updateAddressDisplay(selectedMarkerPosition);
            } else if (window.preFetchedPosition) {
                // Otherwise use the global position from location service
                const pos = window.preFetchedPosition;
                createMap.setCenter(pos);
                selectedMarker.setPosition(pos);
                selectedMarkerPosition = { lat: pos.lat, lng: pos.lng };

                // Update address display
                updateAddressDisplay(selectedMarkerPosition);
            } else {
                // get a new position
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            const pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            createMap.setCenter(pos);
                            selectedMarker.setPosition(pos);
                            selectedMarkerPosition = pos;

                            // Update address display
                            updateAddressDisplay(selectedMarkerPosition);
                        },
                        error => {
                            console.error("Error getting location for My Location button:", error);
                            alert("Could not get your location. Please try again or select a location manually.");
                        }
                    );
                } else {
                    alert("Geolocation is not supported by your browser. Please select a location manually.");
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
        gestureHandling: "greedy"
    });

    // create marker
    selectedMarker = new google.maps.Marker({
        position: selectedMarkerPosition,
        map: createMap,
        title: "selected location",
        draggable: true,
        animation: google.maps.Animation.DROP
    });

    // Create geocoding service
    const geocoder = new google.maps.Geocoder();

    // Function to update address display
    window.updateAddressDisplay = function (latLng) {
        const addressOfMap = document.getElementById("addressOfMap");
        if (!addressOfMap) return;

        // Show loading state
        addressOfMap.innerHTML = '<i class="fas fa-spinner fa-spin"></i>Getting address information...';

        // Use Google Maps Geocoding API for reverse geocoding
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === "OK" && results[0]) {
                // Get formatted address
                formattedAddress = results[0].formatted_address;
                // Update display
                addressOfMap.innerHTML = `<i class="fas fa-map-marker-alt"></i>${formattedAddress}`;
            } else {
                // If geocoding fails, display coordinates
                addressOfMap.innerHTML = `<i class="fas fa-map-marker-alt"></i>Coordinates: (${latLng.lat.toFixed(6)}, ${latLng.lng.toFixed(6)})`;
                console.warn("Geocoding failed:", status);
            }
        });
    }

    selectedMarker.addListener("dragend", event => {
        selectedMarkerPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        console.log("marker position updated", selectedMarkerPosition);
        // Update address display
        updateAddressDisplay(selectedMarkerPosition);
    });

    createMap.addListener("click", event => {
        selectedMarkerPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        selectedMarker.setPosition(selectedMarkerPosition);
        console.log("marker position updated", selectedMarkerPosition);
        // Update address display
        updateAddressDisplay(selectedMarkerPosition);
    });

    // Update address on initial load
    if (selectedMarkerPosition) {
        updateAddressDisplay(selectedMarkerPosition);
    }
}

// Submit form
if (submitCreateEventBtn) {
    submitCreateEventBtn.addEventListener("click", async () => {
        // Clear any previous error messages
        clearFormErrorMessage();

        // Check if user is logged in before showing the modal
        if (typeof isLoggedIn === 'undefined' || !isLoggedIn || !userInfo || !userInfo._id) {
            displayFormErrorMessage("Please log in to create events");
            createEventModal.style.display = "none";
            return;
        }

        // Get form data
        const photoUrl = document.getElementById("eventPhoto").src || '';
        const selectedCategory = document.querySelector("input[name='category']:checked")?.value;
        const title = document.getElementById("eventTitle").value.trim();
        const content = document.getElementById("eventContent").value.trim();
        const address = formattedAddress || document.getElementById("addressOfMap").textContent;
        console.log("photoUrl", document.getElementById("eventPhoto").src);

        // Validate form data
        // check image url
        if (!photoUrl) {
            displayFormErrorMessage("PhotoUrl missing");
            return;
        }
        const urlPattern = /^https?:\/\/[\w\-./]+$/;
        if (!urlPattern.test(photoUrl)) {
            displayFormErrorMessage("Invaild image URL");
            return;
        }

        // check category
        const checkedCategory = selectedCategory.trim().toLowerCase();
        if (!checkedCategory) {
            displayFormErrorMessage("Please select a category");
            return;
        }
        const validCategories = [
            "gun shot",
            "fight",
            "stealing",
            "assaulting",
            "traffic jam",
            "road closed",
            "accident",
            "performance",
            "food truck",
            "parade"
        ];
        if (!validCategories.includes(checkedCategory)) {
            displayFormErrorMessage("Invalid category selected");
            return;
        }

        // check title
        const checkedTitle = title.trim();
        if (!checkedTitle) {
            displayFormErrorMessage("Please enter a title");
            return;
        }
        if (checkedTitle.length < 5 || checkedTitle.length > 50) {
            displayFormErrorMessage("Title must be between 5 and 50 characters");
            return;
        }

        // check content
        const checkedcontent = content.trim();
        if (!checkedcontent) {
            displayFormErrorMessage("Please enter a content");
            return;
        }
        if (checkedcontent.length < 10 || checkedcontent.length > 200) {
            displayFormErrorMessage("Content must be between 10 and 200 characters");
            return;
        }

        // check location
        if (!selectedMarkerPosition) {
            displayFormErrorMessage("Please select a location on the map");
            return;
        }
        console.log("pos", selectedMarkerPosition);
        if (typeof selectedMarkerPosition !== "object" || selectedMarkerPosition === null) {
            displayFormErrorMessage("Invalid location format");
            return;
        }
        if (!("lat" in selectedMarkerPosition) || !("lng" in selectedMarkerPosition)) {
            displayFormErrorMessage("Invalid location coordinates");
            return;
        }
        const latitude = selectedMarkerPosition.lat;
        const longitude = selectedMarkerPosition.lng;
        if (typeof latitude !== "number" || isNaN(latitude)) {
            displayFormErrorMessage("Invalid latitude value");
            return;
        }
        if (typeof longitude !== "number" || isNaN(longitude)) {
            displayFormErrorMessage("Invalid longitude value");
            return;
        }
        if (latitude < -90 || latitude > 90) {
            displayFormErrorMessage("Latitude must be between -90 and 90");
            return;
        }
        if (longitude < -180 || longitude > 180) {
            displayFormErrorMessage("Longitude must be between -180 and 180");
            return;
        }

        // check address
        if (!address) {
            displayFormErrorMessage("Address missing");
            return;
        }

        // Show loading state
        submitCreateEventBtn.disabled = true;
        submitCreateEventBtn.textContent = "Processing...";

        try {
            let eventId;
            const editEventId = submitCreateEventBtn.getAttribute('data-edit-id');

            if (editEventId) {
                // Edit mode - update existing event
                eventId = await updateEvent(
                    editEventId,
                    photoUrl,
                    selectedCategory,
                    title,
                    content,
                    selectedMarkerPosition,
                    address
                );
            } else {
                // Create mode - create new event
                eventId = await createEvent(
                    photoUrl,
                    selectedCategory,
                    title,
                    content,
                    selectedMarkerPosition,
                    address
                );
            }

            if (eventId) {
                if (editEventId) {
                    displayFormSuccessMessage("Event edited successfully!");
                    setTimeout(() => {
                        createEventModal.style.display = "none";
                        location.reload();
                    }, 500);

                } else {
                    displayFormSuccessMessage("Event created successfully!");
                    setTimeout(() => {
                        createEventModal.style.display = "none";

                        pushEventDetail(eventId);
                        showEventDetail();
                    }, 500);
                }
            } else {
                displayFormErrorMessage(editEventId ? "Failed to update event. Please try again." : "Failed to create event. Please try again.");
            }
        } catch (error) {
            console.error("Error processing event:", error);
            displayFormErrorMessage("An error occurred: " + error.message);
        } finally {
            // Reset button state
            submitCreateEventBtn.disabled = false;
            submitCreateEventBtn.textContent = submitCreateEventBtn.hasAttribute('data-edit-id') ? "Update Event" : "Submit";
        }
    });
}

document.querySelector(".upload-container").addEventListener("click", () => {
    document.getElementById("imageUpload").click();
});

const imageUpload = document.getElementById("imageUpload");
if (imageUpload) {
    imageUpload.addEventListener("change", async function (e) {
        const file = this.files[0];
        // user cancel upload
        if (!file) {
            alertfunc("Upload file missing")
        }
        // check file type
        if (!file.type.startsWith("image/")) {
            alertfunc("You should upload an image type file");
            this.value = "";  // clear wrong file
            return;
        }

        console.log("Image selected for upload:", file.name);

        try {
            let result = await uploadFile(file, "event");
            console.log("Upload result:", result);
            const uploadPlaceholder = document.querySelector(".upload-placeholder");
            const eventPhoto = document.getElementById("eventPhoto");
            if (uploadPlaceholder && eventPhoto) {
                uploadPlaceholder.style.display = "none";
                eventPhoto.style.display = "flex";
                eventPhoto.src = result;
            }
        } catch (e) {
            alertfunc("Image upload failed")
        }
    });
}

// Display error message function
function displayFormErrorMessage(message) {
    const errorElement = document.getElementById("errorMessage");
    if (errorElement) {
        errorElement.classList.remove("success-message");
        errorElement.classList.add("error-message");
        errorElement.innerHTML = `<i class="fas fa-triangle-exclamation"></i> ${message}`;
        errorElement.style.display = "flex";
    }
}
  
function displayFormSuccessMessage(message) {
    const errorElement = document.getElementById("errorMessage");
    if (errorElement) {
        errorElement.classList.remove("error-message");
        errorElement.classList.add("success-message");
        errorElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        errorElement.style.display = "flex";
        
        setTimeout(() => {
            // After 2 seconds, hide the message
            errorElement.style.display = "none";
            errorElement.classList.remove("success-message");
        }, 2000);
    }
}

// Clear error message function
function clearFormErrorMessage() {
    // Hide error message if it exists
    const errorElement = document.getElementById("formErrorMessage");
    if (errorElement) {
        errorElement.style.display = "none";
        errorElement.innerHTML = "";
    }

    // Hide success message if it exists
    const successElement = document.getElementById("formSuccessMessage");
    if (successElement) {
        successElement.style.display = "none";
    }
}

function alertfunc(errorMsg) {
    alert(errorMsg)
}