async function getFilterEvents(filters) {

    filters = {...filters, latitude: window.preFetchedPosition.lat, longitude: window.preFetchedPosition.lng};
    console.log('getFilterEvents filters for backend:', filters);

    try {
        
        const queryString = new URLSearchParams(filters).toString();
        const response = await fetch(`/api/events/filter?${queryString}`);
        
        if (!response.ok) {
            console.error(`Error fetching events (${response.status}): ${response.statusText}`);
            return null;
        }
        
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
            console.log(`Successfully fetched ${data.data.length} events`);
            return data.data;
        } else {
            console.error('Error in API response:', data.message || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('Network error when fetching events:', error);
        return null;
    }
}



async function fetchEvents() {
    try {
        console.log('Fetching events from backend...');
        
        const response = await fetch('/api/events');
        
        if (!response.ok) {
            console.error(`Error fetching events (${response.status}): ${response.statusText}`);
            return null;
        }
        
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
            console.log(`Successfully fetched ${data.data.length} events`);
            return data.data;
        } else {
            console.error('Error in API response:', data.message || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('Network error when fetching events:', error);
        return null;
    }
}

async function getEventByEventId(eventId) {
    try {
        if (!eventId) {
            console.error('Error: Event ID is required');
            return null;
        }
        
        const response = await fetch(`/api/events/${eventId}`);
        
        if (!response.ok) {
            console.error(`Error fetching event (${response.status}): ${response.statusText}`);
            return null;
        }
        
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
            console.log('Successfully fetched event:', data.data);
            return data.data;
        } else {
            console.error('Error in API response:', data.message || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('Network error when fetching event details:', error);
        return null;
    }
}

async function createEvent(photoUrl, selectedCategory, title, content, selectedMarkerPosition, address) {
    console.log("photoUrl", photoUrl);
    
    try {
        // Check if user is logged in
        if (typeof isLoggedIn === 'undefined' || !isLoggedIn || !userInfo || !userInfo._id) {
            console.error('User not logged in or user info not available');
            alert('Please log in to create events');
            return null;
        }
        
        const userId = userInfo._id;
        
        // Generate an address based on the selected location
        // let address = address1|| `Location at ${selectedMarkerPosition.lat.toFixed(6)}, ${selectedMarkerPosition.lng.toFixed(6)}`;
        
        
        // Prepare event data
        const eventData = {
            user_id: userId,
            title: title,
            content: content,
            location: {
                latitude: selectedMarkerPosition.lat.toString(),
                longitude: selectedMarkerPosition.lng.toString(),
                address: address
            },
            category: selectedCategory,
            photoUrl: photoUrl
        };
        
        console.log('Creating event with data:', eventData);
        
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error creating event');
        }
        
        const data = await response.json();
        
        if (data.code === 200) {
            console.log('Event created successfully:', data.data);
            return data.data._id;
        } else {
            console.error('Error creating event:', data.message || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('Error when creating event:', error);
        alert('Failed to create event: ' + error.message);
        return null;
    }
}

async function updateEvent(eventId, photoUrl, selectedCategory, title, content, selectedMarkerPosition, address) {
    try {
        // Check if user is logged in
        if (typeof isLoggedIn === 'undefined' || !isLoggedIn || !userInfo || !userInfo._id) {
            console.error('User not logged in or user info not available');
            alert('Please log in to update events');
            return null;
        }
        
        // const address = `Location at ${selectedMarkerPosition.lat.toFixed(6)}, ${selectedMarkerPosition.lng.toFixed(6)}`;
        
        // Prepare event data
        const eventData = {
            title: title,
            content: content,
            location: {
                latitude: selectedMarkerPosition.lat.toString(),
                longitude: selectedMarkerPosition.lng.toString(),
                address: address
            },
            category: selectedCategory,
            photoUrl: photoUrl
        };
        
        console.log('Updating event with data:', eventData);
        
        const response = await fetch(`/api/events/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error updating event');
        }
        
        const data = await response.json();
        
        if (data.code === 200) {
            console.log('Event updated successfully:', data.data);
            return data.data._id; // Return the event ID
        } else {
            console.error('Error updating event:', data.message || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('Error when updating event:', error);
        alert('Failed to update event: ' + error.message);
        return null;
    }
}

async function addLike(eventId) {
    try {
        // Check if user is logged in
        if (!isLoggedIn || !userInfo || !userInfo._id) {
            console.log('User not logged in');
            alert('Please log in to like events');
            return false;
        }
        
        const userId = userInfo._id;
        
        console.log(`Adding like for event ${eventId} by user ${userId}`);
        
        const response = await fetch('/api/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                event_id: eventId
            })
        });
        
        const data = await response.json();
        
        if (data.code === 200) {
            console.log('Like added successfully');
            return true;
        } else {
            console.error('Error adding like:', data.message || 'Unknown error');
            return false;
        }
    } catch (error) {
        console.error('Network error when adding like:', error);
        return false;
    }
}

async function removeLike(eventId) {
    try {
        // Check if user is logged in
        if (!isLoggedIn || !userInfo || !userInfo._id) {
            console.log('User not logged in');
            return false;
        }
        
        const userId = userInfo._id;
        
        console.log(`Removing like for event ${eventId} by user ${userId}`);
        
        const response = await fetch(`/api/likes/${userId}/${eventId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.code === 200) {
            console.log('Like removed successfully');
            return true;
        } else {
            console.error('Error removing like:', data.message || 'Unknown error');
            return false;
        }
    } catch (error) {
        console.error('Network error when removing like:', error);
        return false;
    }
}

async function addComment(eventId, comment) {
    try {
        // Check if user is logged in
        if (!isLoggedIn || !userInfo || !userInfo._id) {
            console.log('User not logged in');
            alert('Please log in to add comments');
            return false;
        }
        
        const userId = userInfo._id;
        
        console.log(`Adding comment to event ${eventId} by user ${userId}: "${comment}"`);
        
        const response = await fetch(`/api/comments/event/${eventId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                content: comment
            })
        });
        
        const data = await response.json();
        
        if (data.code === 200) {
            console.log('Comment added successfully');
            return true;
        } else {
            console.error('Error adding comment:', data.message || 'Unknown error');
            return false;
        }
    } catch (error) {
        console.error('Network error when adding comment:', error);
        return false;
    }
}

async function getCommentsByEventId(eventId) {
    try {
        console.log(`Fetching comments for event ${eventId}`);
        
        const response = await fetch(`/api/comments/event/${eventId}`);
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
            console.log(`Successfully fetched ${data.data.length} comments`);
            return data.data;
        } else {
            console.error('Error fetching comments:', data.message || 'Unknown error');
            return [];
        }
    } catch (error) {
        console.error('Network error when fetching comments:', error);
        return [];
    }
}

async function getLikeStatus(eventId) {
    try {
        // Check if user is logged in
        if (!isLoggedIn || !userInfo || !userInfo._id) {
            console.log('User not logged in or user info not available');
            return { liked: false };
        }
        
        const userId = userInfo._id;
        
        const response = await fetch(`/api/likes/${userId}/${eventId}`);
        const data = await response.json();
        
        if (data.code === 200 && data.data) {
            console.log('Like status:', data.data);
            return data.data; // { liked: true/false, like_id, liked_at }
        } else {
            console.error('Error getting like status:', data.message || 'Unknown error');
            return { liked: false };
        }
    } catch (error) {
        console.error('Network error when checking like status:', error);
        return { liked: false };
    }
}

async function addReport(eventId) {
    try {
        // Check if user is logged in
        if (!isLoggedIn || !userInfo || !userInfo._id) {
            console.log('User not logged in');
            alert('Please log in to like events');
            return false;
        }
        
        const userId = userInfo._id;
        
        console.log(`Adding report for event ${eventId} by user ${userId}`);
        
        const response = await fetch('/api/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                event_id: eventId
            })
        });
        
        const data = await response.json();
        
        if (data.code === 200) {
            console.log('report added successfully', data.data);
            return true;
        } else {
            let message = data.error || 'Unknown error';
            console.error('Error adding report:', message);
            return message;
        }
    } catch (error) {
        console.error('Network error when reporting like:', error);
        return error;
    }
}

async function getUserTopCategory() {
    try {
        // check if user is logged in
        if (typeof isLoggedIn === 'undefined' || !isLoggedIn || !userInfo || !userInfo._id) {
            console.log('User not logged in, cannot get top category');
            return null;
        }

        const userId = userInfo._id;
        const response = await fetch(`/api/users/${userId}/top-category`);

        if (!response.ok) {
            console.error(`Error fetching top category (${response.status}): ${response.statusText}`);
            return null;
        }

        const data = await response.json();

        if (data.code === 200) {
            console.log('Successfully fetched top category:', data.data);
            return data.data; // return the user's most visited category
        } else {
            console.error('Error in API response:', data.message || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('Network error when fetching top category:', error);
        return null;
    }
}