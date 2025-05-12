/* global replaceToEventList, getEventIdFromURL, removeLike, addLike, mockEvents, getEventByEventId, formatDistanceAway, formatTimeAgo, getLikeByUserId, addComment, showEventList */


document.addEventListener("DOMContentLoaded", async () => {

    const eventId = getEventIdFromURL();

    // Set back button
    const backToListBtn = document.getElementById("backToListBtn");
    backToListBtn.addEventListener("click", async () => {
        const eventId = getEventIdFromURL();

        // If no event id, means not Event Detail Page, do nothing
        if (!eventId) return;

        // history.pushState({ _id: eventId } => it give the _id
        if (history.state && history.state._id) {
            // Come from icon or event list page
            replaceToEventList(eventId);
            await showEventList();
            // setTimeout(() => location.reload(), 10);
        } else if (document.referrer && document.referrer !== location.href) {
            // Come from any page in this cite, Go back (such user profile page then event list page)
            history.back();
            // setTimeout(() => location.reload(), 10);
        } else {
            // user directly visit '/event?_id=123', default back to event list page
            replaceToEventList(eventId);
            await showEventList();
        }
    });

    // Likes Action
    const likeEventBtn = document.getElementById("likeEventBtn");
    if (likeEventBtn) {
        likeEventBtn.addEventListener("click", async function () {
            // Check if user is logged in
            if (typeof isLoggedIn === 'undefined' || !isLoggedIn) {
                alert("Please log in to like events");
                return;
            }

            const eventId = getEventIdFromURL();
            const likeCount = this.querySelector(".like-count");
            const currentCount = parseInt(likeCount.textContent);

            try {
                if (this.classList.contains("liked")) {
                    // Unlike the event
                    const success = await removeLike(eventId);

                    if (success) {
                        this.classList.remove("liked");
                        this.querySelector("i").className = "far fa-heart";
                        likeCount.textContent = Math.max(0, currentCount - 1);
                        console.log("Event unliked successfully");
                    }
                } else {
                    // Like the event
                    const success = await addLike(eventId);

                    if (success) {
                        this.classList.add("liked");
                        this.querySelector("i").className = "fas fa-heart";
                        likeCount.textContent = currentCount + 1;
                        console.log("Event liked successfully");
                    }
                }
            } catch (error) {
                console.error("Error processing like action:", error);
            }
        });
    }

    // Comment Action
    const CommentEventBtn = document.getElementById("CommentEventBtn");
    const newCommentInput = document.getElementById("newCommentInput");
    if (CommentEventBtn && newCommentInput) {
        CommentEventBtn.addEventListener("click", () => {
            newCommentInput.focus();
        });
    }

    // Share Action
    const shareEventBtn = document.getElementById("shareEventBtn");
    if (shareEventBtn) {
        shareEventBtn.addEventListener("click", function () {
            // get current url
            const currentUrl = window.location.href;
            const shareText = this.querySelector("span");
            const shareIcon = this.querySelector("i");
            const originalText = shareText.textContent;

            // Copy link to clipboard
            navigator.clipboard.writeText(currentUrl)
                .then(() => {
                    // show prompt
                    this.disabled = true;
                    shareText.textContent = "Link copied!";
                    this.style.color = "var(--accent-green)";

                    setTimeout(() => {
                        // After seconds, reset text to original
                        shareText.textContent = originalText;
                        this.style.color = "var(--gray-dark)";
                        shareEventBtn.disabled = false;
                    }, 2000);
                })
                .catch(err => {
                    console.log("Clipboard error:", err);
                });

        });
    }

    // ellipsis popup
    const popupBtn = document.getElementById('popupBtn');
    const popup = document.getElementById('popup');
    let popperInstance = null;
    function createPopper() {
        if (popperInstance) {
            popperInstance.destroy();
        }
        popperInstance = Popper.createPopper(popupBtn, popup, {
            placement: 'top-start', // 'bottom-end' | 'top-start' | 'left' | 'right'
            modifiers: [{ name: 'offset', options: { offset: [-2, 2] }, },],  // [x, y] offset
        });
    }
    popupBtn.addEventListener('click', () => {
        if (popup.style.display === 'block') {
            popup.style.display = 'none';
        } else {
            popup.style.display = 'block';
            createPopper();
        }
    });
    document.addEventListener('click', (e) => {
        if (!popup.contains(e.target) && e.target !== popupBtn) {
            popup.style.display = 'none';
        }
    });

    // Report Action
    const reportEventBtn = document.getElementById("reportEventBtn");
    if (reportEventBtn) {
        reportEventBtn.addEventListener("click", async function () {
            // Check if user is logged in
            if (typeof isLoggedIn === 'undefined' || !isLoggedIn) {
                alert("Please log in to report events");
                return;
            }

            const eventId = getEventIdFromURL();

            if (!eventId) {
                console.error('Missing eventId on item');
                return;
            }

            // Show confirmation modal
            const confirmed = await showConfirmModal(
                'Report?',
                'Are you sure you want to report this event? <br>This means you think this event is inappropriate or violates. <br>This event maybe blocked.',
                'Report',
                'Cancel'
            );
            if (!confirmed) return;

            try {
                // Like the event
                const success = await addReport(eventId);

                if (success === true) {
                    alert("Event reported successfully");
                    console.log("Event liked successfully");
                } else {
                    alert(success);
                }

            } catch (error) {
                console.error("Error processing report action:", error);
            }
        });
    }

    // Post new comment
    const postCommentBtn = document.getElementById("postCommentBtn");
    if (postCommentBtn && newCommentInput) {
        postCommentBtn.addEventListener("click", async () => {
            const commentText = newCommentInput.value.trim();

            if (!commentText) {
                alert("Please enter a comment");
                return;
            }
            if (commentText.length > 200) {
                alert("Comment length should be within 200 characters");
                return;
            }

            if (!isLoggedIn) {
                alert("Please log in to add comments");
                return;
            }

            const eventId = getEventIdFromURL();

            // Show loading state
            postCommentBtn.disabled = true;
            postCommentBtn.textContent = "Posting...";

            // Post comment to backend
            const success = await addComment(eventId, commentText);

            // Reset button state
            postCommentBtn.disabled = false;
            postCommentBtn.textContent = "Post";

            if (success) {
                // Clear comment input
                newCommentInput.value = "";

                // Reload comments to show the new comment
                await loadComments(eventId);

                // Get updated event data to get the accurate total comment count
                const updatedEventData = await getEventByEventId(eventId);

                // Update comment count with the total number
                const commentCount = document.querySelector(".comment-count");
                if (commentCount && updatedEventData && updatedEventData.comments) {
                    commentCount.textContent = updatedEventData.comments.length;
                }
            } else {
                alert("Failed to post comment. Please try again.");
            }
        });

        // Add enter key support for posting comments
        newCommentInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevent default Enter behavior
                postCommentBtn.click(); // Trigger the post button click
            }
        });
    }
});

/**
 * Show event detail
 */
async function showEventDetail() {
    // Get event id from url
    const eventId = getEventIdFromURL();
    console.log("Fetching event with ID:", eventId);

    // if focusMapOnEvent is defined, focus map on this event marker
    if (eventId && typeof window.focusMapOnEvent === 'function') {
        window.focusMapOnEvent(eventId);
    }

    // Fetch event data from backend
    let eventData = await getEventByEventId(eventId);

    if (!eventData || !eventData._id) {
        console.error("Failed to load event data");
        // Show error message
        const detailContainer = document.getElementById("event-detail-container");
        if (detailContainer) {
            detailContainer.innerHTML = `
                <div class="error-container">
                    <h2>Error Loading Event</h2>
                    <p>Sorry, we couldn't load the event details. Please try again later.</p>
                    <button id="backToListBtnError" class="btn">Back to Events</button>
                </div>
            `;

            // Add event listener for the error back button
            const backToListBtnError = document.getElementById("backToListBtnError");
            if (backToListBtnError) {
                backToListBtnError.addEventListener("click", () => {
                    window.location.href = "/event";
                });
            }

            return;
        }

        // Fall back to mock data if available and we're in development
        if (typeof mockEvents !== 'undefined') {
            console.log("Falling back to mock data");
            const mockGetEventById = mockEvents.find(event => event._id === eventId);
            if (mockGetEventById) {
                eventData = mockGetEventById;
                console.log("Using mock data for event:", eventId);
            } else {
                return; // No mock data available
            }
        } else {
            return; // No mock data available
        }
    }

    // Just update the basic event details for our test
    const detailTitle = document.getElementById("detail-title");
    const detailEventTitle = document.getElementById("detail-event-title");
    const detailEventAddress = document.getElementById("detail-event-address");
    const detailEventDistance = document.getElementById("detail-event-distance");
    const detailEventImg = document.getElementById("detail-event-img");
    const detailEventContent = document.getElementById("detail-event-content");
    const detailEventCreatedat = document.getElementById("detail-event-createdat");
    const detailEventClickTime = document.getElementById("detail-event-clicktime");

    if (detailTitle) detailTitle.textContent = "Event Details";
    if (detailEventTitle) detailEventTitle.textContent = eventData.title || "Untitled Event";

    if (detailEventAddress) detailEventAddress.textContent = eventData.location?.address || "Unknown Address";
    if (detailEventDistance) {
        let distance = formatDistanceAway(eventData.location?.latitude, eventData.location?.longitude);
        detailEventDistance.textContent = distance || "Unknown";
    }

    if (detailEventImg) {
        detailEventImg.src = eventData.photoUrl || "https://images.unsplash.com/photo-1503179008861-d1e2b41f8bec?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
        detailEventImg.alt = eventData.title || "Event Image";
    }

    if (detailEventContent) detailEventContent.innerText = eventData.content || "No content available.";

    if (detailEventCreatedat) {
        const createdAt = new Date(eventData.created_at);
        detailEventCreatedat.innerText = createdAt.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }) || "";
    }

    if (detailEventClickTime) {
        const category = eventData.category ? eventData.category : "Uncategorized";
        const categoryText = category.charAt(0).toUpperCase() + category.slice(1);
        const viewsText = eventData.click_time + " Views" || "0 Views";
        detailEventClickTime.innerHTML = `${viewsText}<span>&nbsp;&nbsp;·&nbsp; &nbsp;</span>${categoryText}`;
    }

    // Update likes count and state
    const likeEventBtn = document.getElementById("likeEventBtn");
    const likeCount = likeEventBtn?.querySelector(".like-count");

    if (likeCount) {
        // Set the initial like count
        likeCount.textContent = eventData.likes ? eventData.likes.length : 0;
    }

    // Update comment count
    const commentEventBtn = document.getElementById("CommentEventBtn");
    const commentCount = commentEventBtn?.querySelector(".comment-count");

    if (commentCount) {
        // Set the initial comment count to the total number of comments
        commentCount.textContent = eventData.comments ? eventData.comments.length : 0;
    }

    // Check if the current user has liked the event
    if (typeof isLoggedIn !== 'undefined' && isLoggedIn && likeEventBtn) {
        const likeStatus = await getLikeStatus(eventId);

        if (likeStatus.liked) {
            likeEventBtn.classList.add("liked");
            likeEventBtn.querySelector("i").className = "fas fa-heart";
        } else {
            likeEventBtn.classList.remove("liked");
            likeEventBtn.querySelector("i").className = "far fa-heart";
        }
    }

    // Load comments for the event
    await loadComments(eventId);

    console.log("Event details displayed successfully");

    // Hide and Change View
    const eventListContainer = document.getElementById("event-list-container");
    const eventDetailContainer = document.getElementById("event-detail-container");
    if (eventListContainer) eventListContainer.style.display = "none";
    if (eventDetailContainer) eventDetailContainer.style.display = "block";

    // load events you may like
    await loadNearbyPopularEvents(eventData);
}

/**
 * Load comments for an event
 */
async function loadComments(eventId) {
    const commentsList = document.getElementById("commentsList");
    if (!commentsList) return;

    // Clear existing comments
    commentsList.innerHTML = '<div class="loading-comments">Loading comments...</div>';

    try {
        // Fetch comments from backend
        const response = await fetch(`/api/comments/event/${eventId}`);

        if (!response.ok) {
            if (response.status === 404) {
                commentsList.innerHTML = '<div class="no-comments">No comments yet. Be the first to comment!</div>';
                return;
            }
            throw new Error(`Error fetching comments: ${response.status}`);
        }

        const data = await response.json();
        const comments = data.data || [];

        // Clear loading state
        commentsList.innerHTML = '';

        if (!comments || comments.length === 0) {
            commentsList.innerHTML = '<div class="no-comments">No comments yet. Be the first to comment!</div>';
            return;
        }

        // Sort comments by date, newest first
        comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        // Render comments
        comments.forEach(comment => {
            const user = comment.user || {}; // Get user info if available
            const commentHTML = `
                <div class="comment-item" data-comment-id="${comment._id}">
                    <div class="comment-useravator">
                        <img src="${user.avatar || 'https://urban-eye.oss-us-east-1.aliyuncs.com/users-pic/morentouxiang.png'}"
                            alt="${user.name || 'Anonymous'} Avatar">
                    </div>
                    <div class="comment-body">
                        <div class="comment-header">
                            <span class="comment-username">${user.name || user.userName || 'Anonymous'}</span>
                            <span class="comment-time">${formatTimeAgo(new Date(comment.created_at))}</span>
                        </div>
                        <div class="comment-content">
                            ${comment.content}
                        </div>
                    </div>
                </div>
            `;
            commentsList.insertAdjacentHTML('beforeend', commentHTML);
        });
    } catch (error) {
        console.error("Failed to load comments:", error);
        commentsList.innerHTML = '<div class="no-comments">No comments yet. Be the first to comment!</div>';
    }
}

/**
 * load nearby events you may like
 */
async function loadNearbyPopularEvents(currentEvent) {
    // check current event location
    if (!currentEvent || !currentEvent.location || !currentEvent.location.latitude || !currentEvent.location.longitude) {
        console.log("can't load this event, event location missing");
        return;
    }

    try {
        const latitude = currentEvent.location.latitude;
        const longitude = currentEvent.location.longitude;

        const distanceOptions = ["1miles", "3miles", "5miles", "10miles", "all"];
        let nearbyEvents = [];
        let currentDistanceIndex = 0;

        // try different radius until nearby evnets length greater than 3
        while (nearbyEvents.length < 3 && currentDistanceIndex < distanceOptions.length) {
            const currentDistance = distanceOptions[currentDistanceIndex];
            const apiUrl = `/api/events/filter?distance=${currentDistance}&sortBy=views&skip=10&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`get nearby events failed: ${response.status}`);
            }

            const data = await response.json();
            if (data.code === 200 && data.data) {
                // drop current event
                const filteredEvents = data.data.filter(event => event._id !== currentEvent._id);
                nearbyEvents = [...filteredEvents];

                // if nearbyEvents.length greater than 3
                if (nearbyEvents.length >= 3) {
                    break;
                }
            }

            currentDistanceIndex++;
        }

        if (nearbyEvents.length === 0) {
            console.log("no nearby events near this event");
            return;
        }

        const relatedEventsList = document.getElementById("related-events-list");

        if (relatedEventsList) {
            relatedEventsList.innerHTML = '';
            // only show 3 events
            nearbyEvents.slice(0, 3).forEach(event => {
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

                relatedEventsList.insertAdjacentHTML('beforeend', eventItemHTML);
            });

            // listen click 
            const eventItems = relatedEventsList.querySelectorAll(".event-item");
            eventItems.forEach(item => {
                item.addEventListener('click', async (event) => {
                    const eventId = item.getAttribute('data-event-id');

                    // focusMapOnEvent
                    if (typeof window.focusMapOnEvent === 'function') {
                        window.focusMapOnEvent(eventId);
                    }

                    // jump to event detail 
                    pushEventDetail(eventId);
                    await showEventDetail();
                });
            });
        }

    } catch (error) {
        console.error("failed to load nearby events:", error);
    }
}