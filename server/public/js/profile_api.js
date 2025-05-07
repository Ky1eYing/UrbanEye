/*
 * Profile API functions for managing user events, likes, and comments
 * This file provides functions to interact with the backend API endpoints
 */

/**
 * Get all events created by a user
 */
async function getUserEvents(userId) {
  try {
    if (!userId) {
      console.error("Error: User ID is required");
      return null;
    }

    const response = await fetch(`/api/events/user/${userId}`);

    if (!response.ok) {
      console.error(
        `Error fetching user events (${response.status}): ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();

    if (data.code === 200 && data.data) {
      console.log(`Successfully fetched ${data.data.length} events for user`);
      return data.data;
    } else {
      console.error("Error in API response:", data.message || "Unknown error");
      return null;
    }
  } catch (error) {
    console.error("Network error when fetching user events:", error);
    return null;
  }
}

/**
 * Update a user's event
 */
async function updateUserEvent(eventId, eventData) {
  try {
    if (!eventId || !eventData) {
      console.error("Error: Event ID and data are required");
      return false;
    }

    const response = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      console.error(
        `Error updating event (${response.status}): ${response.statusText}`
      );
      return false;
    }

    const data = await response.json();

    if (data.code === 200) {
      console.log("Event updated successfully");
      return true;
    } else {
      console.error("Error updating event:", data.message || "Unknown error");
      return false;
    }
  } catch (error) {
    console.error("Network error when updating event:", error);
    return false;
  }
}

/**
 * Delete a user's event
 */
async function deleteUserEvent(eventId) {
  try {
    if (!eventId) {
      console.error("Error: Event ID is required");
      return false;
    }

    const response = await fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error(
        `Error deleting event (${response.status}): ${response.statusText}`
      );
      return false;
    }

    const data = await response.json();

    if (data.code === 200) {
      console.log("Event deleted successfully");
      return true;
    } else {
      console.error("Error deleting event:", data.message || "Unknown error");
      return false;
    }
  } catch (error) {
    console.error("Network error when deleting event:", error);
    return false;
  }
}

/**
 * Get all events liked by a user
 */
async function getUserLikes(userId) {
  try {
    if (!userId) {
      console.error("Error: User ID is required");
      return null;
    }

    const response = await fetch(`/api/likes/user/${userId}`);

    if (!response.ok) {
      console.error(
        `Error fetching user likes (${response.status}): ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();

    if (data.code === 200 && data.data) {
      console.log(
        `Successfully fetched ${data.data.length} liked events for user`
      );
      return data.data;
    } else {
      console.error("Error in API response:", data.message || "Unknown error");
      return null;
    }
  } catch (error) {
    console.error("Network error when fetching user likes:", error);
    return null;
  }
}

/**
 * Add a like to an event
 */
async function addUserLike(userId, eventId) {
  try {
    if (!userId || !eventId) {
      console.error("Error: User ID and Event ID are required");
      return false;
    }

    const response = await fetch("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        event_id: eventId,
      }),
    });

    if (!response.ok) {
      console.error(
        `Error adding like (${response.status}): ${response.statusText}`
      );
      return false;
    }

    const data = await response.json();

    if (data.code === 200) {
      console.log("Like added successfully");
      return true;
    } else {
      console.error("Error adding like:", data.message || "Unknown error");
      return false;
    }
  } catch (error) {
    console.error("Network error when adding like:", error);
    return false;
  }
}

/**
 * Remove a like from an event
 */
async function removeUserLike(userId, eventId) {
  try {
    if (!userId || !eventId) {
      console.error("Error: User ID and Event ID are required");
      return false;
    }

    const response = await fetch(`/api/likes/${userId}/${eventId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error(
        `Error removing like (${response.status}): ${response.statusText}`
      );
      return false;
    }

    const data = await response.json();

    if (data.code === 200) {
      console.log("Like removed successfully");
      return true;
    } else {
      console.error("Error removing like:", data.message || "Unknown error");
      return false;
    }
  } catch (error) {
    console.error("Network error when removing like:", error);
    return false;
  }
}

/**
 * Check if a user has liked an event
 */
async function getUserLikeStatus(userId, eventId) {
  try {
    if (!userId || !eventId) {
      console.error("Error: User ID and Event ID are required");
      return { liked: false };
    }

    const response = await fetch(`/api/likes/${userId}/${eventId}`);

    if (!response.ok) {
      console.error(
        `Error checking like status (${response.status}): ${response.statusText}`
      );
      return { liked: false };
    }

    const data = await response.json();

    if (data.code === 200 && data.data) {
      console.log("Like status:", data.data);
      return data.data;
    } else {
      console.error(
        "Error getting like status:",
        data.message || "Unknown error"
      );
      return { liked: false };
    }
  } catch (error) {
    console.error("Network error when checking like status:", error);
    return { liked: false };
  }
}

/**
 * Get all comments by a user
 */
async function getUserComments(userId) {
  try {
    if (!userId) {
      console.error("Error: User ID is required");
      return null;
    }

    const response = await fetch(`/api/comments/user/${userId}`);

    if (!response.ok) {
      console.error(
        `Error fetching user comments (${response.status}): ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();

    if (data.code === 200 && data.data) {
      console.log(`Successfully fetched ${data.data.length} comments by user`);
      return data.data;
    } else {
      console.error("Error in API response:", data.message || "Unknown error");
      return null;
    }
  } catch (error) {
    console.error("Network error when fetching user comments:", error);
    return null;
  }
}

/**
 * Add a comment to an event
 */
async function addUserComment(userId, eventId, content) {
  try {
    if (!userId || !eventId || !content) {
      console.error("Error: User ID, Event ID, and content are required");
      return false;
    }

    const response = await fetch(`/api/comments/event/${eventId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        content: content,
      }),
    });

    if (!response.ok) {
      console.error(
        `Error adding comment (${response.status}): ${response.statusText}`
      );
      return false;
    }

    const data = await response.json();

    if (data.code === 200) {
      console.log("Comment added successfully");
      return true;
    } else {
      console.error("Error adding comment:", data.message || "Unknown error");
      return false;
    }
  } catch (error) {
    console.error("Network error when adding comment:", error);
    return false;
  }
}

async function getCommentbyId(commentId) {
  try {
    if (!commentId) {
      console.error("Error: Comment ID is required");
      return null;
    }

    const response = await fetch(`/api/comments/${commentId}`);

    if (!response.ok) {
      console.error(
        `Error fetching comment (${response.status}): ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();

    if (data.code === 200 && data.data) {
      console.log("Comment fetched successfully:", data.data);
      return data.data;
    } else {
      console.error("Error in API response:", data.message || "Unknown error");
      return null;
    }
  } catch (error) {
    console.error("Network error when fetching comment:", error);
    return null;
  }
}

/**
 * Update a user's comment
 */
async function updateUserComment(commentId, content) {
  try {
    if (!commentId || !content) {
      console.error("Error: Comment ID and content are required");
      return false;
    }

    const response = await fetch(`/api/comments/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content,
      }),
    });

    if (!response.ok) {
      console.error(
        `Error updating comment (${response.status}): ${response.statusText}`
      );
      return false;
    }

    const data = await response.json();

    if (data.code === 200) {
      console.log("Comment updated successfully");
      return true;
    } else {
      console.error("Error updating comment:", data.message || "Unknown error");
      return false;
    }
  } catch (error) {
    console.error("Network error when updating comment:", error);
    return false;
  }
}

/**
 * Delete a user's comment
 */
async function deleteUserComment(commentId) {
  try {
    if (!commentId) {
      console.error("Error: Comment ID is required");
      return false;
    }

    const response = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.error(
        `Error deleting comment (${response.status}): ${response.statusText}`
      );
      return false;
    }

    const data = await response.json();

    if (data.code === 200) {
      console.log("Comment deleted successfully");
      return true;
    } else {
      console.error("Error deleting comment:", data.message || "Unknown error");
      return false;
    }
  } catch (error) {
    console.error("Network error when deleting comment:", error);
    return false;
  }
}

/**
 * Update user profile information
 */
async function updateUserProfile(userId, profileData) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Profile updated successfully");
    }

    return {
      success: response.ok,
      message:
        data.message ||
        (response.ok
          ? "Profile updated successfully"
          : "Failed to update profile"),
      data: data.data,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Network error when updating profile" };
  }
}

async function updateUserIntroduction(userId, profileData) {
  try {
    const response = await fetch(`/api/users/introduction/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Introduction updated successfully");
    }

    return {
      success: response.ok,
      message:
        data.message ||
        (response.ok
          ? "Introduction updated successfully"
          : "Failed to update introduction"),
      data: data.data,
    };
  } catch (error) {
    console.error("Error updating introduction:", error);
    return { success: false, message: "Network error when updating introduction" };
  }
}

async function updateUserAvatar(userId, profileData) {
  try {
    const response = await fetch(`/api/users/avatar/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Avatar updated successfully");
    }

    return {
      success: response.ok,
      message:
        data.message ||
        (response.ok
          ? "Avatar updated successfully"
          : "Failed to update avatar"),
      data: data.data,
    };
  } catch (error) {
    console.error("Error updating avatar:", error);
    return { success: false, message: "Network error when updating avatar" };
  }
}

/**
 * Update user password
 */
async function updateUserPassword(userId, originalPassword, newPassword) {
  try {
    if (!userId || !originalPassword || !newPassword) {
      console.error(
        "Error: User ID, original password, and new password are required"
      );
      return { success: false, message: "All fields are required" };
    }

    const response = await fetch(`/api/users/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        originalPassword: originalPassword,
        password: newPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `Error updating password (${response.status}):`,
        errorData.message
      );
      return {
        success: false,
        message: errorData.message || "Failed to update password",
      };
    }

    const data = await response.json();

    if (data.code === 200) {
      console.log("Password updated successfully");
      return { success: true, message: "Password updated successfully" };
    } else {
      console.error(
        "Error updating password:",
        data.message || "Unknown error"
      );
      return { success: false, message: data.message || "Unknown error" };
    }
  } catch (error) {
    console.error("Network error when updating password:", error);
    return { success: false, message: "Network error when updating password" };
  }
}
