document.addEventListener("DOMContentLoaded", () => {
    const eventListContainer = document.getElementById("event-list-container");
    const eventDetailContainer = document.getElementById("event-detail-container");

    const backToListBtn = document.getElementById("backToListBtn");
    backToListBtn.addEventListener("click", () => {
        // 点击返回按钮后，隐藏事件详情，显示事件列表
        eventDetailContainer.style.display = "none";
        eventListContainer.style.display = "block";
    });

    // 给每个 event-item 注册点击事件
    const eventItems = document.querySelectorAll(".event-item");
    eventItems.forEach(item => {
        item.addEventListener("click", async () => {
            const eventId = item.getAttribute("data-event-id");

            // 从后端获取事件数据，或者前端已有就直接用
            // 这里演示一个 fetch:
            try {
                // For demo purposes, create mock data for fake IDs
                if (eventId === "fake-id-1" || eventId === "fake-id-2") {
                    const mockData = {
                        _id: eventId,
                        title: "Six killed after Helicopter Crashes",
                        location: {
                            address: "Manhattan, NY 10001",
                            coordinates: { lat: 40.7128, lng: -74.0060 }
                        },
                        distance: "6",
                        imageUrl: "https://urban-eye.oss-us-east-1.aliyuncs.com/events-pic/23be41e3-7246-4ca5-b837-a801cae0f4f0-IMG_7863.JPG",
                        content: "A tragic helicopter crash in Manhattan has resulted in six fatalities. Emergency services responded immediately to the scene near Central Park. Investigations are ongoing to determine the cause of the crash.",
                        comments: [
                            {
                                username: "JohnDoe",
                                content: "This is terrible news. My thoughts are with the families affected.",
                                created_at: new Date().toISOString()
                            },
                            {
                                username: "NewsWatcher",
                                content: "I heard the crash from blocks away. Emergency response was very quick.",
                                created_at: new Date(Date.now() - 3600000).toISOString()
                            }
                        ]
                    };
                    showEventDetail(mockData);

                    // 隐藏事件列表，显示事件详情
                    eventListContainer.style.display = "none";
                    eventDetailContainer.style.display = "block";
                    return;
                }

                // Real API call for non-demo data
                const res = await fetch(`/api/events/${eventId}`, { method: "GET" });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const eventData = await res.json();

                // 更新详情视图
                showEventDetail(eventData);

                // 隐藏事件列表，显示事件详情
                eventListContainer.style.display = "none";
                eventDetailContainer.style.display = "block";
            } catch (err) {
                console.error("Error fetching event detail:", err);
            }
        });
    });

    // 处理评论提交
    const postCommentBtn = document.getElementById("postCommentBtn");
    const newCommentInput = document.getElementById("newCommentInput");

    if (postCommentBtn && newCommentInput) {
        postCommentBtn.addEventListener("click", () => {
            const commentText = newCommentInput.value.trim();
            if (!commentText) return;

            // 这里应该有一个API调用来提交评论
            // 但现在只是演示UI:
            const commentsList = document.getElementById("commentsList");
            const div = document.createElement("div");
            div.classList.add("comment-item");
            div.innerHTML = `
        <p><strong>You</strong> at ${new Date().toLocaleString()}</p>
        <p>${commentText}</p>
        <hr>
      `;
            commentsList.appendChild(div);

            // 清空输入框
            newCommentInput.value = "";
        });
    }
});

/**
 * 将后端返回的 eventData 显示在 #event-detail-container 里
 */
function showEventDetail(eventData) {
    const detailTitle = document.getElementById("detail-title");
    const detailEventTitle = document.getElementById("detail-event-title");
    const detailEventAddress = document.getElementById("detail-event-address");
    const detailEventDistance = document.getElementById("detail-event-distance");
    const detailEventImg = document.getElementById("detail-event-img");
    const detailEventContent = document.getElementById("detail-event-content");
    const commentsList = document.getElementById("commentsList");

    detailTitle.textContent = "Event Details"; // 或者 eventData.title
    detailEventTitle.textContent = eventData.title || "Untitled Event";
    detailEventAddress.textContent = eventData.location?.address || "Unknown Address";
    detailEventDistance.textContent = eventData.distance || "0";  // 若有距离信息

    // 显示图片
    detailEventImg.src = eventData.imageUrl || "some-default.jpg";
    detailEventImg.alt = eventData.title || "Event Image";

    // 显示内容
    detailEventContent.innerText = eventData.content || "No content available.";

    // 显示评论
    commentsList.innerHTML = "";
    if (Array.isArray(eventData.comments)) {
        eventData.comments.forEach(comment => {
            const div = document.createElement("div");
            div.classList.add("comment-item");
            div.innerHTML = `
        <p><strong>${comment.username || "Anonymous"}</strong> at ${new Date(comment.created_at).toLocaleString()}</p>
        <p>${comment.content}</p>
      `;
            commentsList.appendChild(div);
        });
    }
} 