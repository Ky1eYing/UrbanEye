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
async function showCreateEventModal(eventId) {
    createEventModal.style.display = "flex";

    // TODO: mock data to test, delete when page is ready
    eventId = "1";
    // If it use to edit event
    if (eventId) {
        // TODO: backend get event detail (If it use to edit event)
        let eventData = await getEventByEventId(eventId);

        // Mock data
        if (!eventData || !eventData._id) {
            // TODO: show error page for event detail page
            // return;
            // but now, mock data for testing
            const mockGetEventById = mockEvents.find(event => event._id === eventId);
            eventData = mockGetEventById;
        }
        // bind data
        document.getElementById("imageUpload").src = eventData.photoUrl; // TODO ：show image use Aliyun OSS
        const radio = document.querySelector(`input[name='category'][value='${eventData.category}']`);
        if (radio) {
            radio.checked = true;
        }
        document.getElementById("eventTitle").value = eventData.title;
        document.getElementById("eventContent").value = eventData.content;

        geolocationCenter = {
            lat: parseFloat(eventData.location.latitude),
            lng: parseFloat(eventData.location.longitude)
        };

        selectedMarkerPosition = { ...geolocationCenter };


    }

    initCreateEventMap();
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

// 提交表单
submitCreateEventBtn.addEventListener("click", async () => {
    const imageFile = document.getElementById("imageUpload").files[0];
    const selectedCategory = document.querySelector("input[name='category']:checked")?.value;
    const title = document.getElementById("eventTitle").value.trim();
    const content = document.getElementById("eventContent").value.trim();

    if (!imageFile) { alert("Please upload an image"); return; }
    if (!selectedCategory) { alert("Please select a category"); return; }
    if (!title) { alert("Please enter a title"); return; }

    console.log({
        Image: imageFile,
        Category: selectedCategory,
        Title: title,
        Content: content,
        Location: selectedMarkerPosition
    });
    // TODO: backend create event
    const eventId = await createEvent(imageFile, selectedCategory, title, content, selectedMarkerPosition);


    alert("Event Created!");
    createEventModal.style.display = "none";
});
