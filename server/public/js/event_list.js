/* global Choices, fetchEvents,pushEventDetail, showEventDetail, formatTimeAgo, formatDistanceAway, getEventIdFromURL */

const mockEvents = [
    {
        _id: '1',
        user_id: '1',
        title: "Six Died After Helicopter Crashes Into Hudson River",
        content: "Three adults and three children were on board the helicopter, which left from the downtown skyport, Mayor Eric Adams said in a press conference. The pilot and the family on board were visiting from Spain. All six victims have been pronounced dead.\n\nFour were pronounced dead at the scene, and two others were pronounced dead at the hospital. An executive from Spain, his wife and three children died in the crash, along with the helicopter’s pilot, officials said.",
        created_at: new Date("2025-04-10T12:00:00Z"),
        location: { latitude: "40.7261636", longitude: "-74.0108719", address: "Spring St & NY-9A, New York, NY" },
        category: "accident",
        click_time: 10,
        likes: [
            {
                _id: '1',
                user_id: '1',
                liked_at: new Date("2025-03-21T13:00:00Z")
            }
        ],
        comments: [
            {
                _id: '1',
                user_id: '1',
                content: "Scary incident!",
                created_at: new Date("2025-03-21T13:05:00Z")
            }
        ],
        // photoUrl: 'https://images.unsplash.com/photo-1579118559062-39e94a22dbb8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEhlbGljb3B0ZXJ8ZW58MHx8MHx8fDA%3D'
        photoUrl: 'https://images.unsplash.com/photo-1503179008861-d1e2b41f8bec?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        _id: '2',
        user_id: '2',
        title: "Food Truck Festival",
        content: "Annual food truck festival happening this weekend with over 50 vendors.",
        created_at: new Date("2025-03-21T11:30:00Z"),
        location: { latitude: "40.7829", longitude: "-73.9654", address: "Central Park West, NY" },
        category: "food truck",
        click_time: 25,
        likes: [
            {
                _id: '2',
                user_id: '2',
                liked_at: new Date("2025-03-21T12:30:00Z")
            }
        ],
        comments: [
            {
                _id: '2',
                user_id: '2',
                content: "Can't wait to try the new taco truck!",
                created_at: new Date("2025-03-21T12:35:00Z")
            }
        ],
        photoUrl: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Rm9vZCUyMFRydWNrfGVufDB8fDB8fHww'
    },
    {
        _id: '3',
        user_id: '3',
        title: "Road Construction",
        content: "Major road construction on 5th Avenue causing traffic delays.",
        created_at: new Date("2025-03-21T10:15:00Z"),
        location: { latitude: "40.7749", longitude: "-73.9719", address: "5th Avenue, NY" },
        category: "road closed",
        click_time: 15,
        likes: [],
        comments: [
            {
                _id: '3',
                user_id: '3',
                content: "Thanks for the heads up!",
                created_at: new Date("2025-03-21T10:20:00Z")
            }
        ],
        photoUrl: 'https://images.unsplash.com/photo-1593436878048-92622a77d315?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Um9hZCUyMENvbnN0cnVjdGlvbnxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        _id: '4',
        user_id: '4',
        title: "Street Performance",
        content: "Amazing street performers at Times Square today.",
        created_at: new Date("2025-03-21T09:45:00Z"),
        location: { latitude: "40.7580", longitude: "-73.9855", address: "Times Square, NY" },
        category: "performance",
        click_time: 30,
        likes: [
            {
                _id: '4',
                user_id: '4',
                liked_at: new Date("2025-03-21T10:00:00Z")
            }
        ],
        comments: [],
        photoUrl: 'https://images.unsplash.com/photo-1588671815815-b0cd3b2a9189?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fFN0cmVldCUyMFBlcmZvcm1hbmNlfGVufDB8fDB8fHww'
    },
    {
        _id: '5',
        user_id: '5',
        title: "Accident on Highway",
        content: "Multi-car accident on I-95 causing major delays.",
        created_at: new Date("2025-03-21T08:30:00Z"),
        location: { latitude: "40.7128", longitude: "-74.0060", address: "I-95 North, NY" },
        category: "accident",
        click_time: 20,
        likes: [],
        comments: [
            {
                _id: '5',
                user_id: '5',
                content: "Hope everyone is okay!",
                created_at: new Date("2025-03-21T08:35:00Z")
            }
        ],
        photoUrl: 'https://images.unsplash.com/photo-1627398924667-7f4ab354ab49?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QWNjaWRlbnQlMjBvbiUyMEhpZ2h3YXl8ZW58MHx8MHx8fDA%3D'
    },
    {
        _id: '6',
        user_id: '6',
        title: "Parade Route",
        content: "Annual Thanksgiving Day Parade route announced with road closures.",
        created_at: new Date("2025-03-21T07:15:00Z"),
        location: { latitude: "40.7589", longitude: "-73.9791", address: "Broadway, NY" },
        category: "parade",
        click_time: 35,
        likes: [
            {
                _id: '6',
                user_id: '6',
                liked_at: new Date("2025-03-21T07:30:00Z")
            }
        ],
        comments: [
            {
                _id: '6',
                user_id: '6',
                content: "Can't wait to see the balloons!",
                created_at: new Date("2025-03-21T07:20:00Z")
            }
        ],
        photoUrl: 'https://images.unsplash.com/photo-1677211310859-5a263e96f99c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGhhbmtzZ2l2aW5nJTIwUGFyYWRlfGVufDB8fDB8fHww'
    },
    {
        _id: '7',
        user_id: '7',
        title: "Street Market",
        content: "Weekly farmers market with fresh produce and local crafts.",
        created_at: new Date("2025-03-21T06:45:00Z"),
        location: { latitude: "40.7306", longitude: "-73.9352", address: "Market Street, NY" },
        category: "market",
        click_time: 28,
        likes: [
            {
                _id: '7',
                user_id: '7',
                liked_at: new Date("2025-03-21T07:00:00Z")
            }
        ],
        comments: [
            {
                _id: '7',
                user_id: '7',
                content: "Best place to get fresh vegetables!",
                created_at: new Date("2025-03-21T06:50:00Z")
            }
        ],
        photoUrl: 'https://plus.unsplash.com/premium_photo-1683121624323-0c5bf3ca6af2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8U3RyZWV0JTIwTWFya2V0fGVufDB8fDB8fHww'
    },
    {
        _id: '8',
        user_id: '8',
        title: "Road Closed for Repairs",
        content: "Emergency water main repair causing road closure on Oak Street.",
        created_at: new Date("2025-03-21T05:30:00Z"),
        location: { latitude: "40.7144", longitude: "-74.0052", address: "Oak Street, NY" },
        category: "road closed",
        click_time: 18,
        likes: [],
        comments: [
            {
                _id: '8',
                user_id: '8',
                content: "Thanks for the update!",
                created_at: new Date("2025-03-21T05:35:00Z")
            }
        ],
        photoUrl: 'https://plus.unsplash.com/premium_photo-1664360971109-81c34241ddfe?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Um9hZCUyMENsb3NlZCUyMGZvciUyMFJlcGFpcnN8ZW58MHx8MHx8fDA%3D'
    },
    {
        _id: '9',
        user_id: '9',
        title: "Community Event",
        content: "Annual neighborhood block party with live music and food.",
        created_at: new Date("2025-03-21T04:15:00Z"),
        location: { latitude: "40.7127", longitude: "-74.0134", address: "City Hall Park, NY" },
        category: "community",
        click_time: 42,
        likes: [
            {
                _id: '9',
                user_id: '9',
                liked_at: new Date("2025-03-21T04:30:00Z")
            }
        ],
        comments: [
            {
                _id: '9',
                user_id: '9',
                content: "Looking forward to the music!",
                created_at: new Date("2025-03-21T04:20:00Z")
            }
        ],
        photoUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fENvbW11bml0eSUyMEV2ZW50fGVufDB8fDB8fHww'
    },
    {
        _id: '10',
        user_id: '10',
        title: "Traffic Light Outage",
        content: "Power outage affecting traffic lights at Main & 1st intersection.",
        created_at: new Date("2025-03-21T03:00:00Z"),
        location: { latitude: "40.7032", longitude: "-74.0170", address: "Main & 1st, NY" },
        category: "traffic",
        click_time: 15,
        likes: [],
        comments: [
            {
                _id: '10',
                user_id: '10',
                content: "Police directing traffic now.",
                created_at: new Date("2025-03-21T03:05:00Z")
            }
        ],
        photoUrl: 'https://plus.unsplash.com/premium_photo-1682834983265-27a10ba5232c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VHJhZmZpYyUyMExpZ2h0fGVufDB8fDB8fHww'
    },
    {
        _id: '11',
        user_id: '',
        title: "Traffic Light Outage",
        content: "Power outage affecting traffic lights at Main & 1st intersection.",
        created_at: new Date("2025-03-21T03:00:00Z"),
        location: { latitude: "40.7032", longitude: "-74.0170", address: "Main & 1st, NY" },
        category: "traffic",
        click_time: 0,
        likes: [],
        comments: [

        ],
        photoUrl: ''
    }
];

// Global filters state object to track active filters
// Set default values for filters
/* If you need change , ALSO change event.handlebar.js 's select  */
let filters = {
    titleLike: '',
    category: '',
    timeRange: '7',
    distance: '3miles',
};

document.addEventListener('DOMContentLoaded', async function () {
    // Base on url (if has event id) to decide
    const eventId = getEventIdFromURL();
    console.log("Event ID from URL:", eventId);

    // Decide which view to show
    if (eventId) {
        await showEventDetail();
    } else {
        // await showEventList();
        // Init titleLike, category, timeRange, and distance filters

        showEventList();
    }
});

function initFilters() {
    // Initialize filters
    // init Choices.js for category, timeRange, and distance filters
    // and add event listeners for changes

    const titleLikeFilter = document.querySelector('.titleLike-filter');
    if (titleLikeFilter) {
        titleLikeFilter.addEventListener('input', function (event) {
            // Check if the input is empty
            const titleLike = this.value.trim() || '';

            // Update active filters
            filters.titleLike = titleLike;

            // Apply all active filters
            showEventList();
        });
    }

    const categoryFilter = document.querySelector('.category-filter');
    if (categoryFilter) {
        new Choices(categoryFilter, {
            searchEnabled: false,
            itemSelectText: '',
            shouldSort: false,
        });

        // Add event listener for category changes
        categoryFilter.addEventListener('change', function () {
            const category = this.value || '';
            filters.category = category;
            showEventList();
        });
    }

    const timeRangeFilter = document.querySelector('.timeRange-filter');
    if (timeRangeFilter) {
        new Choices(timeRangeFilter, {
            searchEnabled: false,
            itemSelectText: '',
            shouldSort: false,
        });
        timeRangeFilter.addEventListener('change', function () {
            const timeRange = this.value || '';
            filters.timeRange = timeRange;
            showEventList();
        });
    }

    const distanceFilter = document.querySelector('.distance-filter');
    if (distanceFilter) {
        new Choices(distanceFilter, {
            searchEnabled: false,
            itemSelectText: '',
            shouldSort: false,
        });
        distanceFilter.addEventListener('change', function () {
            const distance = this.value || '';
            filters.distance = distance;
            showEventList();
        });
    }
}

async function showEventList() {
    initFilters();

    console.log('Applying filters:', filters);

    // Get event list container
    const eventList = document.querySelector('.event-list');

    if (eventList) {
        // Show loading state
        eventList.innerHTML = '<div class="loading-events">Loading events...</div>';

        // Fetch events from backend using our new function
        let events;
        let adEvents = [];

        // only get recommended events when user is logged in and not searching for a specific title or category
        if (typeof isLoggedIn !== 'undefined' && isLoggedIn && userInfo && userInfo._id &&
            !filters.titleLike && !filters.category) {
            // get the user's most visited category
            const topCategory = await getUserTopCategory();
            if (topCategory) {
                console.log("User's top category:", topCategory);

                // get the recommended events
                const adFilters = {
                    category: topCategory,
                    skip: 3
                };

                adEvents = await getFilterEvents(adFilters);
                console.log("Recommended events based on user preference:", adEvents);
            }
        }

        // get the regular events
        events = await getFilterEvents(filters);
        // Log the results for debugging
        console.log("Events fetched:", events);

        // Handle Api error
        if (!events) {
            console.error('Error fetching events:', error);
            eventList.innerHTML = '<div class="error-events">Error fetching events. Please try again later.</div>';
            return;
        }

        // Handle no events scenario
        if ((!events || events.length === 0)) {
            eventList.innerHTML = `<div class="no-events">No events right now. Try different filters.</div>`;
            return;
        }

        events = [...adEvents, ...events];

        // Clear loading state
        eventList.innerHTML = '';
        // Bind events list - simple version for testing
        events.forEach((event, i) => {
            let adSign =``;
            if(adEvents && adEvents.length > i){
                adSign =  `
                    <div class="event-actions">
                        <i class="far fa-star"></i>
                        <span>Recommend</span>
                    </div>
                `
            }
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
                   ${adSign}
                </div>
            `;

            eventList.insertAdjacentHTML('beforeend', eventItemHTML);
        });

        // Bind click event to jump to event detail page
        const eventItems = eventList.querySelectorAll(".event-item");
        eventItems.forEach(item => {
            item.addEventListener('click', async (event) => {
                const eventId = item.getAttribute('data-event-id');
                console.log(`Event item clicked: ${eventId}`);

                // focus map on this event marker
                if (typeof window.focusMapOnEvent === 'function') {
                    window.focusMapOnEvent(eventId);
                }

                // jump to event detail page
                pushEventDetail(eventId);
                await showEventDetail();
            });
        });
    }

    // Hide and Change View
    const eventListContainer = document.getElementById("event-list-container");
    const eventDetailContainer = document.getElementById("event-detail-container");
    if (eventListContainer) eventListContainer.style.display = "block";
    if (eventDetailContainer) eventDetailContainer.style.display = "none";

    console.log("Event list displayed successfully");
}
