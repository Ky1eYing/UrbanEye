import { ObjectId } from "mongodb";
import { events } from "../config/mongoCollections.js";
import * as check from "../utils/helpers.js";

// Create a like for an event
const createLike = async (user_id, event_id) => {
  // Validate inputs
  if (!user_id || !event_id) {
    throw new Error("All fields must have valid values");
  }

  const checked_user_id = check.checkObjectId(user_id);
  const checked_event_id = check.checkObjectId(event_id);

  // Check if event exists
  const eventsCollection = await events();
  const event = await eventsCollection.findOne({
    _id: new ObjectId(checked_event_id),
  });
  if (!event) {
    throw new Error("Event not found");
  }

  // Check if user already liked this event
  const userAlreadyLiked = event.likes.some(
    (like) => like.user_id.toString() === checked_user_id
  );
  if (userAlreadyLiked) {
    throw new Error("User has already liked this event");
  }

  // Create new like object
  const newLike = {
    _id: new ObjectId(),
    user_id: new ObjectId(checked_user_id),
    liked_at: new Date(),
  };

  // Add like to event
  const updateInfo = await eventsCollection.updateOne(
    { _id: new ObjectId(checked_event_id) },
    { $push: { likes: newLike } }
  );

  if (!updateInfo.acknowledged || updateInfo.modifiedCount !== 1) {
    throw new Error("Could not add like to event");
  }

  return {
    _id: newLike._id.toString(),
    user_id: checked_user_id,
    event_id: checked_event_id,
    liked_at: newLike.liked_at,
  };
};

// Remove a like from an event
const removeLike = async (user_id, event_id) => {
  // Validate inputs
  if (!user_id || !event_id) {
    throw new Error("All fields must have valid values");
  }

  const checked_user_id = check.checkObjectId(user_id);
  const checked_event_id = check.checkObjectId(event_id);

  // Find event and remove like
  const eventsCollection = await events();
  const updateInfo = await eventsCollection.updateOne(
    { _id: new ObjectId(checked_event_id) },
    { $pull: { likes: { user_id: new ObjectId(checked_user_id) } } }
  );

  if (!updateInfo.acknowledged) {
    throw new Error("Could not remove like from event");
  }

  if (updateInfo.modifiedCount !== 1) {
    throw new Error("Like not found or already removed");
  }

  return { message: "Like removed successfully" };
};

// Get all likes by a user
const getLikeByUserId = async (user_id) => {
  const checked_user_id = check.checkObjectId(user_id);

  const eventsCollection = await events();
  const eventsList = await eventsCollection
    .find({ "likes.user_id": new ObjectId(checked_user_id) })
    .toArray();

  if (!eventsList || eventsList.length === 0) {
    throw new Error("No likes found for this user");
  }

  // Format the results to return just the liked events with like details
  const likedEvents = eventsList.map((event) => {
    const userLike = event.likes.find(
      (like) => like.user_id.toString() === checked_user_id
    );

    return {
      event_id: event._id.toString(),
      event_title: event.title,
      like_id: userLike._id.toString(),
      liked_at: userLike.liked_at,
    };
  });

  return likedEvents;
};

// Get like status for a specific event by a specific user
const getLikeByUserIdEventId = async (user_id, event_id) => {
  const checked_user_id = check.checkObjectId(user_id);
  const checked_event_id = check.checkObjectId(event_id);

  const eventsCollection = await events();
  const event = await eventsCollection.findOne({
    _id: new ObjectId(checked_event_id),
    "likes.user_id": new ObjectId(checked_user_id),
  });

  if (!event) {
    return { liked: false };
  }

  const userLike = event.likes.find(
    (like) => like.user_id.toString() === checked_user_id
  );

  return {
    liked: true,
    like_id: userLike._id.toString(),
    liked_at: userLike.liked_at,
  };
};

export default {
  createLike,
  removeLike,
  getLikeByUserId,
  getLikeByUserIdEventId,
};
