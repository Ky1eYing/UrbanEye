/* global showEventList, showEventDetail */
/* exported pushEventDetail, replaceToEventList, getEventIdFromURL */

// Jump to event detail page
function pushEventDetail(eventId) {
    history.pushState({ _id: eventId }, '', '?event=' + eventId);
}

// Jump to event list page
function replaceToEventList() {
    history.replaceState({}, '', '/event');
}

// Get event id from url for event detail page
function getEventIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('event');
}

window.addEventListener('popstate', () => {
    // Get event _id
    const eventId = getEventIdFromURL();

    if (eventId) {
        showEventDetail();
    } else {
        showEventList();
    }
});