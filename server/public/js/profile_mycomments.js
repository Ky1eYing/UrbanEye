
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
    allEvents = await getUserComments(userId) || [];
    console.log("Comments fetched:", allEvents ? allEvents : 0);

    renderEvents(allEvents);
    console.log("Comments list displayed successfully");

    // Bind search bar- search Title
    const searchBar = document.querySelector('.search-bar');
    if (!searchBar) return;
    searchBar.addEventListener('input', () => {
        const q = searchBar.value.trim().toLowerCase();
        const filtered = allEvents.filter(ev =>
            (ev.title || '').toLowerCase().includes(q) ||
            (ev.comment.content || '').toLowerCase().includes(q)
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
                <p>No comments available.</p>
            </div>
        `;
        return;
    }

    // Bind events list - simple version for testing
    events.forEach(event => {
        const eventItemHTML = `
            <div class="event-item" data-event-id="${event._id}" data-comment-id="${event.comment._id}">
                <div class="event-details">
                    <h3>${event.title || 'Untitled Event'}</h3>
                    <div class="event-meta">
                        <blockquote class="quote">
                            <div class="comment-content">
                                ${event.comment.content || 'Unknown comment'}
                            </div>
                            <div class="comment-time"> ${new Date(event.comment.created_at).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }) || 'Unknown time'}</div>
                        </blockquote>
                    </div>
                </div>
                <div class="event-actions">
                    <button class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `;

        eventList.insertAdjacentHTML('beforeend', eventItemHTML);
    });

    // Bind click event to jump to event detail page
    const eventItems = eventList.querySelectorAll(".event-item");
    eventItems.forEach(item => {

        const eventId = item.getAttribute('data-event-id');
        const commentId = item.getAttribute('data-comment-id');

        item.addEventListener('click', async () => {

            console.log(`Event item clicked: ${eventId}`);

            // jump to event detail page
            window.location.href = `/event?_id=${eventId}`;
        });

        const editBtn = item.querySelector('.edit-btn');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click event from bubbling up to the item
            console.log(`Edit clicked for comment ${commentId}`);
            showEditCommentModal(commentId);
        });

        const deleteBtn = item.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation(); // Prevent the click event from bubbling up to the item

            console.log(`Delete clicked for comment ${commentId}`);

            if (!eventId) {
                console.error('Missing commentId on item');
                return;
            }

            // Show confirmation modal
            const confirmed = await showConfirmModal(
                'Delete?',
                'Are you sure you want to delete this comment?',
                'Delete',
                'Cancel'
            );
            if (!confirmed) return;

            const success = await deleteUserComment(commentId);
            if (success) {
                item.remove(); // Remove the event item from the list
            } else {
                alert('Failed to delete the event. Please try again.');
            }
        });

    });
}

function showEditCommentModal(commentId) {

    const modal = document.getElementById('commentModal');

    document.body.style.overflow = 'hidden';
    modal.style.display = 'flex';

    // bind old comment content
    const commentInput = document.getElementById("commentInput");
    if (commentInput) {
        getCommentbyId(commentId).then(commentData => {
            if (commentData && commentData._id === commentId) {
                commentInput.value = commentData.content || '';
            } else {
                console.error("Comment not found");
            }
        }).catch(error => {
            console.error("Error loading event for editing:", error);
        });
    }

    // Edit comment
    const postCommentBtn = document.getElementById("postCommentBtn");
    if (postCommentBtn && commentInput) {
        postCommentBtn.onclick = async () => {
            const commentText = commentInput.value.trim();

            if (!commentText) {
                alert("Please enter a comment");
                return;
            }
            if (commentText.length < 10 || commentText.length > 200) {
                alert("Comment length should be between 10 and 200 characters");
                return;
            }

            if (!isLoggedIn) {
                alert("Please log in to add comments");
                return;
            }

            // Show loading state
            postCommentBtn.disabled = true;
            postCommentBtn.textContent = "Posting...";

            // Post comment to backend
            const success = await updateUserComment(commentId, commentText);

            // Reset button state
            postCommentBtn.disabled = false;
            postCommentBtn.textContent = "Update";

            if (success) {
                // Clear comment input
                commentInput.value = "";
            } else {
                alert("Failed to post comment. Please try again.");
            }

            // Close modal
            document.body.style.overflow = '';
            modal.style.display = 'none';
            location.reload();
            resolve(true);
        };

        // Add enter key support for posting comments
        commentInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevent default Enter behavior
                postCommentBtn.click(); // Trigger the post button click
            }
        });
    }

    const commentNo = document.getElementById("commentNo");
    commentNo.onclick = () => {
        document.body.style.overflow = '';
        modal.style.display = 'none';
        resolve(false);
    };
}
