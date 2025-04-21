/* global getEventIdFromURL, removeLike, addLike, mockEvents, getEventByEventId, formatDistanceAway, formatTimeAgo, getLikeByUserId, addComment, showEventList */


document.addEventListener("DOMContentLoaded", () => {

    const eventId = getEventIdFromURL();

    // Set back button
    const backToListBtn = document.getElementById("backToListBtn");
    backToListBtn.addEventListener("click", () => {
        const eventId = getEventIdFromURL();

        // If no event id, means not Event Detail Page, do nothing
        if (!eventId) return;

        // history.pushState({ _id: eventId } => it give the _id
        if (history.state && history.state._id) {
            // Come from any page in this cite, Go back (maybe from user profile page then event list page)
            history.back();
        } else {
            // user directly visit '/event?event=123', default back to event list page
            let newUrl = '/event';
            history.replaceState({}, '', newUrl);
            showEventList();
        }
    });

    // Likes Action
    const likeEventBtn = document.getElementById("likeEventBtn");
    if (likeEventBtn) {
        likeEventBtn.addEventListener("click", async function () {
            const likeCount = this.querySelector(".like-count");
            const currentCount = parseInt(likeCount.textContent);

            if (this.classList.contains("liked")) {
                if (currentCount < 1) {
                    // something wrong, do nothing
                    return;
                }
                // unlike
                this.classList.remove("liked");
                this.querySelector("i").className = "far fa-heart";
                likeCount.textContent = currentCount - 1;

                // TODO: backend removeLike
                await removeLike(eventId);

            } else {
                // make a like
                this.classList.add("liked");
                this.querySelector("i").className = "fas fa-heart";
                likeCount.textContent = currentCount + 1;

                // TODO: backend addLike
                await addLike(eventId);
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


    // history.pushState({}, '', '?event=' + eventData._id);

    // Get event id from url
    const eventId = getEventIdFromURL();

    // TODO: fetch event data from backend
    // TODO: For comments, need combine search user database to get user._id and user.avatar
    let eventData = await getEventByEventId(eventId);
    if (!eventData || !eventData._id) {
        // TODO: show error page for event detail page
        // return;
        // but now, mock data for testing
        const mockGetEventById = mockEvents.find(event => event._id === eventId);
        eventData = mockGetEventById;
    }


    const detailTitle = document.getElementById("detail-title");
    const detailEventTitle = document.getElementById("detail-event-title");
    const detailEventAddress = document.getElementById("detail-event-address");
    const detailEventDistance = document.getElementById("detail-event-distance");
    const detailEventImg = document.getElementById("detail-event-img");
    const detailEventContent = document.getElementById("detail-event-content");
    const commentsList = document.getElementById("commentsList");
    const commentCount = document.querySelector(".comment-count");
    const likeBtn = document.getElementById("likeEventBtn");
    const likeCount = document.querySelector(".like-count");

    detailTitle.textContent = "Event Details";
    detailEventTitle.textContent = eventData.title || "Untitled Event";

    detailEventAddress.textContent = eventData.location?.address || "Unknown Address";
    let distance = formatDistanceAway(eventData.location?.latitude, eventData.location?.longitude);
    detailEventDistance.textContent = distance || "Unknown";


    detailEventImg.src = eventData.photoUrl || "https://images.unsplash.com/photo-1503179008861-d1e2b41f8bec?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    detailEventImg.alt = eventData.title || "Event Image";

    detailEventContent.innerText = eventData.content || "No content available.";

    // Likes
    if (likeCount && likeBtn) {
        // Bind like count
        likeCount.textContent = eventData.likes.length || 0;

        // Decide if the user has liked the event
        // TODO: backend get isLikedByUser'
        const isLikedByUser = await getLikeByUserId(eventId);

        
        if (likeBtn && isLikedByUser) {
            likeBtn.classList.add("liked");
            likeBtn.querySelector("i").className = "fas fa-heart";
        } else if (likeBtn && !isLikedByUser) {
            // Clear
            likeBtn.classList.remove("liked");
            likeBtn.querySelector("i").className = "far fa-heart";
        }
    }

    // Comments
    const commentsArray = Array.isArray(eventData.comments) ? eventData.comments : [];
    // show comment count
    if (commentCount) {
        commentCount.textContent = commentsArray.length;
    }
    if (commentsList) {
        // Clear
        // commentsList.innerHTML = ""; //TODO: remove this line when backend is ready

        // Bind comments
        if (commentsArray.length > 0) {
            commentsArray.forEach(comment => {
                const commentHTML = `
                    <div class="comment-item">
                        <div class="comment-useravator">
                            <img src="${comment.user?.avatar || "https://urban-eye.oss-us-east-1.aliyuncs.com/users-pic/morentouxiang.png"}"
                                alt="User Avatar">
                        </div>
                        <div class="comment-body">
                            <div class="comment-header">
                                <span class="comment-username">${comment.user?._id || "Anonymous"}</span>
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
        }
    }


    // Hide and Change View
    const eventListContainer = document.getElementById("event-list-container");
    const eventDetailContainer = document.getElementById("event-detail-container");
    eventListContainer.style.display = "none";
    eventDetailContainer.style.display = "block";
}