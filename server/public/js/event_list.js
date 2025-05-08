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

async function showEventList() {
    // Initialize the category filter dropdown if it exists
    const categoryFilterElement = document.querySelector('.category-filter');
    if (categoryFilterElement) {
        new Choices(categoryFilterElement, {
            searchEnabled: false,
            itemSelectText: '',
            shouldSort: false,
        });
    }
    const timeRangeFilterElement = document.querySelector('.timeRange-filter');
    if (timeRangeFilterElement) {
        new Choices(timeRangeFilterElement, {
            searchEnabled: false,
            itemSelectText: '',
            shouldSort: false,
        });
    }
    const distanceFilterElement = document.querySelector('.distance-filter');
    if (distanceFilterElement) {
        new Choices(distanceFilterElement, {
            searchEnabled: false,
            itemSelectText: '',
            shouldSort: false,
        });
    }

    // Get event list container
    const eventList = document.querySelector('.event-list');

    if (eventList) {
        // Show loading state
        eventList.innerHTML = '<div class="loading-events">Loading events...</div>';

        // Fetch events from backend using our new function
        let events = await fetchEvents();
        

        // Log the results for debugging
        console.log("Events fetched:", events ? events.length : 0);

        // Clear loading state
        eventList.innerHTML = '';

        // Fallback to mock data if fetch fails (during development)
        if (!events || events.length === 0) {
            if (typeof mockEvents !== 'undefined') {
                events = mockEvents;
                console.log("Using mock data:", events.length);
            }
        }

        // Handle no events scenario
        if (!events || events.length === 0) {
            eventList.innerHTML = `
                <div class="no-events">
                    <p>No events available. Be the first to report an event!</p>
                    <button id="createFirstEventBtn" class="btn primary-btn">Create Event</button>
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


// Global filters state object to track active filters
let activeFilters = {
    titleLike: null,
    category: null
};

document.addEventListener('DOMContentLoaded', async function () {
    // Base on url (if has event id) to decide
    const eventId = getEventIdFromURL();

    // search functionality
    const searchInput = document.querySelector('input[type="text"]') ||
        document.querySelector('.search-area input') ||
        document.querySelector('input[placeholder*="Search"]');

    if (searchInput) {
        console.log('Search input found:', searchInput);

        // Remove any existing listeners to avoid duplicates
        const newSearchInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearchInput, searchInput);

        newSearchInput.addEventListener('input', function (event) {
                event.preventDefault(); // Prevent form submission
                const searchTerm = this.value.trim();
                console.log('Search term entered:', searchTerm);

                // Update active filters
                activeFilters.titleLike = searchTerm || null;

                // Apply all active filters
                applyFilters();
        });
    } else {
        console.error('Search input not found on the page');
    }

    // Initialize the category filter dropdown if it exists
    const categoryFilterElement = document.querySelector('.category-filter');
    if (categoryFilterElement) {
        // Initialize Choices.js on the dropdown
        const categoryFilter = new Choices(categoryFilterElement, {
            searchEnabled: false,
            itemSelectText: '',
            shouldSort: false,
        });

        // Add event listener for category changes
        categoryFilterElement.addEventListener('change', function () {
            const selectedCategory = this.value;

            activeFilters.category = (selectedCategory !== 'all') ? selectedCategory : null;

            applyFilters();
        });
    }

    // Decide which view to show
    if (eventId) {
        await showEventDetail();
    } else {
        // await showEventList();
        applyFilters();
    }
});

// Function to apply all active filters together
function applyFilters() {
    // Create params object from active filters
    const params = Object.fromEntries(
        Object.entries(activeFilters).filter(([_, value]) => value !== null)
    );

    console.log('Applying filters:', params);

    // If no filters active, show all events
    if (Object.keys(params).length === 0) {
        showEventList();
    } else {
        fetchAndDisplayEvents(params);
    }
}

async function fetchAndDisplayEvents(params = {}) {
    try {
        console.log('Fetching events with params:', params);

        // Show loading state
        const eventList = document.querySelector('.event-list');
        if (eventList) {
            eventList.innerHTML = '<div class="loading-events">Loading events...</div>';
        }

        // Build query string
        let queryString = '';
        if (Object.keys(params).length > 0) {
            queryString = '?' + Object.entries(params)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
        }

        const apiUrl = `/api/events/filter${queryString}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error(`Error fetching events (${response.status}): ${response.statusText}`);
            return;
        }

        const data = await response.json();

        if (data.code === 200 && data.data) {
            console.log(`Found ${data.data.length} events`);

            // Clear the event list
            if (eventList) {
                eventList.innerHTML = '';
            }

            // If no results found
            if (data.data.length === 0) {
                // Build a message based on active filters
                let message = 'No events found';

                if (params.titleLike && params.category) {
                    message += ` matching "${params.titleLike}" in category "${params.category}"`;
                } else if (params.titleLike) {
                    message += ` matching "${params.titleLike}"`;
                } else if (params.category) {
                    message += ` in category "${params.category}"`;
                }

                eventList.innerHTML = `
                    <div class="no-events">
                        <p>${message}. Try different filters.</p>
                    </div>
                `;
                return;
            }

            // Render the events
            data.data.forEach(event => {
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
                    </div>
                `;

                eventList.insertAdjacentHTML('beforeend', eventItemHTML);
            });

            // Bind click events to each event item
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
        } else {
            console.error('Error in API response:', data.message || 'Unknown error');
            eventList.innerHTML = '<div class="error-events">Error fetching events. Please try again later.</div>';
        }
    } catch (error) {
        console.error('Network error when fetching events:', error);
        const eventList = document.querySelector('.event-list');
        if (eventList) {
            eventList.innerHTML = '<div class="error-events">Error fetching events. Please try again later.</div>';
        }
    }

    // Hide and Change View
    const eventListContainer = document.getElementById("event-list-container");
    const eventDetailContainer = document.getElementById("event-detail-container");
    if (eventListContainer) eventListContainer.style.display = "block";
    if (eventDetailContainer) eventDetailContainer.style.display = "none";
}

function searchEvents(searchTerm) {
    activeFilters.titleLike = searchTerm || null;
    return applyFilters();
}

function filterEventsByCategory(category) {
    activeFilters.category = (category !== 'all') ? category : null;
    return applyFilters();
}