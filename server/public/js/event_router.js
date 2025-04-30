/* global showEventList, showEventDetail */
/* exported pushEventDetail, replaceToEventList, getEventIdFromURL */

// Jump to event detail page
function pushEventDetail(eventId) {
    history.pushState({ _id: eventId }, '', '?_id=' + eventId);
}

// Jump to event list page
function replaceToEventList(eventId) {
    // We directly visit '/event?_id=123', and go back to Event List page, User use `forward` to Event Detail page
    history.replaceState(null, '', '/event'); // Make a fake visit history, as you have visited '/event'
    history.pushState({ _id: eventId }, '', '?_id=' + eventId); // as you jump to '/event?_id=123'
    history.back(); // as you back to '/event'
}

// Get event id from url for event detail page
function getEventIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('_id');
}

window.addEventListener('popstate', async () => {
    // Get event _id
    const eventId = getEventIdFromURL();

    if (eventId) {
        await showEventDetail();
    } else {
        // await showEventList();
        applyFilters();
    }
});