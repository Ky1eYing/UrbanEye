document.addEventListener("DOMContentLoaded", () => {
    const eventListContainer = document.getElementById("event-list-container");
    const eventDetailContainer = document.getElementById("event-detail-container");
    const backToListBtn = document.getElementById("backToListBtn");
    const newCommentInput = document.getElementById("newCommentInput");
    
    backToListBtn.addEventListener("click", () => {

        const params = new URLSearchParams(window.location.search);
        params.delete('event');
        const queryString = params.toString();
        const newUrl = queryString
          ? `${window.location.pathname}?${queryString}`
          : window.location.pathname;

        history.pushState({}, '', newUrl);

        // 点击返回按钮后，隐藏事件详情，显示事件列表
        eventDetailContainer.style.display = "none";
        eventListContainer.style.display = "block";
    });

    // 点赞功能
    const likeEventBtn = document.getElementById("likeEventBtn");
    if (likeEventBtn) {
        likeEventBtn.addEventListener("click", function() {
            const likeCount = this.querySelector(".like-count");
            const currentCount = parseInt(likeCount.textContent);
            
            if (this.classList.contains("liked")) {
                // 取消点赞
                this.classList.remove("liked");
                this.querySelector("i").className = "far fa-heart";
                likeCount.textContent = currentCount - 1;
                
                // 发送取消点赞请求 (后端)
                // fetch('/api/events/${eventId}/unlike', { method: 'POST' });
            } else {
                // 点赞
                this.classList.add("liked");
                this.querySelector("i").className = "fas fa-heart";
                likeCount.textContent = currentCount + 1;
                
                // 发送点赞请求 (后端)
                // fetch('/api/events/${eventId}/like', { method: 'POST' });
            }
        });
    }
    
    // 评论 - 聚焦到评论输入框
    const focusCommentBtn = document.getElementById("focusCommentBtn");
    
    if (focusCommentBtn && newCommentInput) {
        focusCommentBtn.addEventListener("click", () => {
            newCommentInput.focus();
        });
    }
    
    // 分享
    const shareEventBtn = document.getElementById("shareEventBtn");
    if (shareEventBtn) {
        shareEventBtn.addEventListener("click", function() {
            // 获取当前页面URL
            const currentUrl = window.location.href;
            
            // 如果浏览器支持原生分享API
            // if (navigator.share) {
            //     navigator.share({
            //         title: document.getElementById("detail-event-title").textContent,
            //         text: "Check out this event on UrbanEye!",
            //         url: currentUrl
            //     })
            //     .catch(err => {
            //         console.log("Error sharing:", err);
            //     });
            // } else {
                // 回退方案 - 复制链接到剪贴板
                navigator.clipboard.writeText(currentUrl)
                    .then(() => {
                        // 显示提示信息
                        const shareText = this.querySelector("span");
                        const originalText = shareText.textContent;
                        shareText.textContent = "Link copied!";
                        // shareText.style.color = "var(--accent-green)";
                        // shareText.style.fontWeight = "bold";
                        
                        setTimeout(() => {
                            shareText.textContent = originalText;
                        }, 2000);
                    })
                    .catch(err => {
                        console.log("Clipboard error:", err);
                    });
            // }
        });
    }

    // 处理评论提交
    const postCommentBtn = document.getElementById("postCommentBtn");

    if (postCommentBtn && newCommentInput) {
        postCommentBtn.addEventListener("click", () => {
            const commentText = newCommentInput.value.trim();
            if (!commentText) return;

            // 这里应该有一个API调用来提交评论
            // 但现在只是演示UI:
            const commentsList = document.getElementById("commentsList");
            
            // 如果是第一条评论，清除"暂无评论"提示
            const noComments = commentsList.querySelector(".no-comments");
            if (noComments) {
                commentsList.removeChild(noComments);
            }
            
            // 添加新评论
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
            commentsList.insertAdjacentHTML('afterbegin', commentHTML);
        

            // 清空输入框
            newCommentInput.value = "";
            
            // 更新评论数
            const commentCount = document.querySelector(".comment-count");
            if (commentCount) {
                commentCount.textContent = parseInt(commentCount.textContent) + 1;
            }
        });
    }
});

/**
 * 将后端返回的 eventData 显示在 #event-detail-container 里
 */
function showEventDetail(eventData) {

    history.pushState({}, '', '?event=' + eventData._id);

    const detailTitle = document.getElementById("detail-title");
    const detailEventTitle = document.getElementById("detail-event-title");
    const detailEventAddress = document.getElementById("detail-event-address");
    const detailEventDistance = document.getElementById("detail-event-distance");
    const detailEventImg = document.getElementById("detail-event-img");
    const detailEventContent = document.getElementById("detail-event-content");
    const commentsList = document.getElementById("commentsList");
    const commentCount = document.querySelector(".comment-count");
    const likeCount = document.querySelector(".like-count");

    // 设置标题
    detailTitle.textContent = "Event Details";
    detailEventTitle.textContent = eventData.title || "Untitled Event";
    
    // 设置地址和距离
    detailEventAddress.textContent = eventData.location?.address || "Unknown Address";
    if (eventData.location?.latitude && eventData.location?.longitude) {
        const distance = Math.abs(parseFloat(eventData.location.latitude) - parseFloat(eventData.location.longitude)).toFixed(1);
        detailEventDistance.textContent = `${distance} mi`;
    } else {
        detailEventDistance.textContent = "Unknown";
    }

    // 显示图片
    detailEventImg.src = eventData.photoUrl || "some-default.jpg";
    detailEventImg.alt = eventData.title || "Event Image";

    // 显示内容
    detailEventContent.innerText = eventData.content || "No content available.";
    
    // 更新点赞数和评论数
    if (likeCount) {

        // 首先清空
        const likeBtn = document.getElementById("likeEventBtn");
        likeBtn.classList.remove("liked");
        likeBtn.querySelector("i").className = "far fa-heart";

        likeCount.textContent = eventData.likes.length;
        // 如果用户已点赞，改变按钮样式
        
        if (likeBtn && eventData.isLikedByUser) {
            likeBtn.classList.add("liked");
            likeBtn.querySelector("i").className = "fas fa-heart";
        }
    }

    // 显示评论
    // commentsList.innerHTML = ""; //TODO: 正式运行时取消注释
    const commentsArray = Array.isArray(eventData.comments) ? eventData.comments : [];
    
    // 更新评论计数
    if (commentCount) {
        commentCount.textContent = commentsArray.length;
    }
    
    if (commentsArray.length > 0) {
        commentsArray.forEach(comment => {
            const commentHTML = `
                <div class="comment-item">
                    <div class="comment-useravator">
                        <img src="https://urban-eye.oss-us-east-1.aliyuncs.com/users-pic/morentouxiang.png"
                            alt="User Avatar">
                    </div>
                    <div class="comment-body">
                        <div class="comment-header">
                            <span class="comment-username">${comment.user_id || "Anonymous"}</span>
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

// 格式化时间差
function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hours ago`;
    } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} days ago`;
    }
} 