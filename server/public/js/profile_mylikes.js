
document.addEventListener("DOMContentLoaded", async () => {
    const backToProfileBtn = document.getElementById("backToProfileBtn");
    // Back to profile button
    if (backToProfileBtn) {
        backToProfileBtn.addEventListener('click', function () {
            history.back();
        });
    }

    await showMyEventsList();
});

const userId = userInfo._id;
let allEvents = [];

async function showMyEventsList() {


    // Get event list container
    const eventList = document.querySelector('.event-list');


    if (!eventList) return;


    // Show loading state
    eventList.innerHTML = '<div class="loading"><p>Loading ...</p></div>';

    // Fetch events from backend using our new function
    allEvents = await getUserLikes(userId) || [];
    console.log("Events fetched:", allEvents ? allEvents : 0);

    renderEvents(allEvents);
    console.log("Event list displayed successfully");

    // Bind search bar- search Title
    const searchBar = document.querySelector('.search-bar');
    if (!searchBar) return;
    searchBar.addEventListener('input', () => {
        const q = searchBar.value.trim().toLowerCase();
        const filtered = allEvents.filter(ev =>
            (ev.title || '').toLowerCase().includes(q)
        );
        renderEvents(filtered);
    });
}

function renderEvents(events) {
    const eventList = document.querySelector('.event-list');

    // Clear loading state
    eventList.innerHTML = '';

    // Handle no events scenario
    if (!events || events.length === 0) {
        eventList.innerHTML = `
            <div class="no-events">
                <p>No events available.</p>
            </div>
        `;
        return;
    }

    // Bind events list - simple version for testing
    events.forEach(event => {
        const eventItemHTML = `
            <div class="event-item" data-event-id="${event._id}">
                <div class="event-image">
                    <img src="${event.photoUrl || 'https://images.unsplash.com/photo-1503179008861-d1e2b41f8bec?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}" 
                         alt="${event.title || 'Event Image'}"
                         onerror="this.src='https://images.unsplash.com/photo-1503179008861-d1e2b41f8bec?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'">
                </div>
                <div class="event-details">
                    <h3>${event.title || 'Untitled Event'}</h3>
                    <div class="event-meta">
                        <span class="event-location">${event.location?.address || 'Unknown Location'}</span>
                        <div class="event-distance-time-ago">
                            <span class="event-distance">${formatDistanceAway(event.location?.latitude, event.location?.longitude) || 'Unknown distance'}</span>
                            <span>&nbsp;· &nbsp;</span>
                            <span class="event-time-ago">${formatTimeAgo(new Date(event.created_at)) || 'Unknown time'}</span>
                        </div>
                    </div>
                </div>
                <div class="event-actions">
                    <i class="fas fa-heart liked"></i>
                    <span>${new Date(event.liked_at).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }) || 'Unknown time'}</span>
                </div>
            </div>
        `;

        eventList.insertAdjacentHTML('beforeend', eventItemHTML);
    });

    // Bind click event to jump to event detail page
    const eventItems = eventList.querySelectorAll(".event-item");
    eventItems.forEach(item => {

        const eventId = item.getAttribute('data-event-id');

        item.addEventListener('click', async (event) => {

            console.log(`Event item clicked: ${eventId}`);

            // jump to event detail page
            window.location.href = `/event?_id=${eventId}`;
        });
    });
}

window.addEventListener('pageshow', e => {
    // event.persisted is true if the page was loaded from the cache
    // refresh the page to show the latest data
    if (e.persisted) {
      showMyEventsList();
    }
  });