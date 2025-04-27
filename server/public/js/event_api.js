//TODO: match api to backend
async function fetchEvents() {
    try {
        const response = await fetch('/api/events');
        const data = await response.json();
        
        if (data.code === 200) {
            return data.data;
        } else {
            console.error('Error fetching events:', data.message || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('Network error when fetching events:', error);
        return null;
    }
}

async function getEventByEventId(eventId) {
    try {
        const response = await fetch(`/api/events/${eventId}`);
        const data = await response.json();
        
        if (data.code === 200) {
            return data.data;
        } else {
            console.error('Error fetching event details:', data.message || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('Network error when fetching event details:', error);
        return null;
    }
}

async function createEvent(imageFile, selectedCategory, title, content, selectedMarkerPosition) {
    try {
        // First handle the image upload
        const formData = new FormData();
        formData.append('image', imageFile);
        
        // Upload image first
        const imageUploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        
        const imageData = await imageUploadResponse.json();
        if (!imageData.success) {
            throw new Error('Image upload failed');
        }
        
        // Get the current user ID from session
        // This would typically be stored in the session or a state management system
        // For now, we'll assume it's available in localStorage or similar
        const userId = localStorage.getItem('userId');
        
        // Prepare the event data
        const eventData = {
            user_id: userId,
            title: title,
            content: content,
            location: {
                latitude: selectedMarkerPosition.lat.toString(),
                longitude: selectedMarkerPosition.lng.toString(),
                address: 'Address will be determined by coordinates' // This should be fetched from Google Maps API in a real app
            },
            category: selectedCategory,
            photoUrl: imageData.photoUrl // URL returned from the image upload endpoint
        };
        
        // Create the event
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        
        const data = await response.json();
        
        if (data.code === 200) {
            return data.data._id; // Return the new event ID
        } else {
            console.error('Error creating event:', data.message || 'Unknown error');
            return null;
        }
    } catch (error) {
        console.error('Network error when creating event:', error);
        return null;
    }
}

async function removeLike(eventId) {
    try {
        const userId = localStorage.getItem('userId');
        
        const response = await fetch(`/api/likes/${userId}/${eventId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        return data.code === 200;
    } catch (error) {
        console.error('Network error when removing like:', error);
        return false;
    }
}

async function addLike(eventId) {
    try {
        const userId = localStorage.getItem('userId');
        
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
        
        return data.code === 200;
    } catch (error) {
        console.error('Network error when adding like:', error);
        return false;
    }
}

async function addComment(eventId, comment) {
    try {
        const userId = localStorage.getItem('userId');
        
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
        
        return data.code === 200;
    } catch (error) {
        console.error('Network error when adding comment:', error);
        return false;
    }
}

async function getLikeByUserId(eventId) {
    try {
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            return false; // User not logged in
        }
        
        const response = await fetch(`/api/likes/${userId}/${eventId}`);
        const data = await response.json();
        
        if (data.code === 200) {
            return data.data.liked;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Network error when checking like status:', error);
        return false;
    }
}