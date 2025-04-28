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
            // Come from any page in this cite, Go back (maybe from user profile page then event list page)
            history.back();
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

            /*
            // Original Share API
            if (navigator.share) {
                navigator.share({
                    title: document.getElementById("detail-event-title").textContent,
                    text: "Check out this event on UrbanEye!",
                    url: currentUrl
                })
                .catch(err => {
                    console.log("Error sharing:", err);
                });
            } else {
            */

            // Copy link to clipboard
            navigator.clipboard.writeText(currentUrl)
                .then(() => {
                    // show prompt
                    const shareText = this.querySelector("span");
                    const originalText = shareText.textContent;
                    shareText.textContent = "Link copied!";
                    // TODO: create a css to make it green. 
                    // shareText.style.color = "var(--accent-green)";
                    // shareText.style.fontWeight = "bold";

                    setTimeout(() => {
                        // After seconds, reset text to original
                        shareText.textContent = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.log("Clipboard error:", err);
                });

        });
    }

    // Post new comment
    const postCommentBtn = document.getElementById("postCommentBtn");
    if (postCommentBtn && newCommentInput) {
        postCommentBtn.addEventListener("click", async () => {
            const commentText = newCommentInput.value.trim();

            // TODO: handle error. If no comment text, show error message
            if (!commentText) return;

            // TODO: backend post addComment
            await addComment(eventId, commentText);
            // Add new comment to HTML
            const commentsList = document.getElementById("commentsList");
            const commentHTML = `
                <div class="comment-item">
                    <div class="comment-useravator">
                        <img src="https://urban-eye.oss-us-east-1.aliyuncs.com/users-pic/Jo..JPG"
                            alt="User Avatar">
                    </div>
                    <div class="comment-body">
                        <div class="comment-header">
                            <span class="comment-username">Jo.</span>
                            <span class="comment-time">Just Now</span>
                        </div>
                        <div class="comment-content">
                            ${commentText}
                        </div>
                    </div>
                </div>
            `;
            commentsList.insertAdjacentHTML('afterbegin', commentHTML); // shows to the top of the list

            // Clear comment input
            newCommentInput.value = "";

            // Update comment count
            const commentCount = document.querySelector(".comment-count");
            if (commentCount) {
                commentCount.textContent = parseInt(commentCount.textContent) + 1;
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

    if (detailEventCreatedat){
        const createdAt = new Date(eventData.created_at);
        detailEventCreatedat.innerText = createdAt.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }) || "";
    } 

    if (detailEventClickTime) detailEventClickTime.innerText = eventData.click_time + " Views" || "";

    // Update likes count and state
    const likeEventBtn = document.getElementById("likeEventBtn");
    const likeCount = likeEventBtn?.querySelector(".like-count");
    
    if (likeCount) {
        // Set the initial like count
        likeCount.textContent = eventData.likes ? eventData.likes.length : 0;
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

    console.log("Event details displayed successfully");

    // Hide and Change View
    const eventListContainer = document.getElementById("event-list-container");
    const eventDetailContainer = document.getElementById("event-detail-container");
    if (eventListContainer) eventListContainer.style.display = "none";
    if (eventDetailContainer) eventDetailContainer.style.display = "block";
}