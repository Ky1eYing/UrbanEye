import { ObjectId } from "mongodb";
import { events } from "../config/mongoCollections.js";
import * as check from "../utils/helpers.js";

import e from "express";

const createComment = async (eventId, userId, content) => {
  eventId = check.checkObjectId(eventId);
  userId = check.checkObjectId(userId);
  content = check.checkVaildString(content, "Content");

  const eventsCollection = await events();
  const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
  if (!event) {
    throw new Error("Event not found");
  }
  const newComment = {
    _id: new ObjectId(),
    user_id: new ObjectId(userId),
    content: content,
    created_at: new Date(),
  };
  const updateInfo = await eventsCollection.updateOne(
    { _id: new ObjectId(eventId) },
    { $push: { comments: newComment } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
    throw new Error("Could not add comment");
  }

  const updatedEvent = await eventsCollection.findOne({
    _id: new ObjectId(eventId),
  });
  if (!updatedEvent) {
    throw new Error("Could not find updated event");
  }
  return updatedEvent;
};

const getAllCommentsByEventId = async (eventId) => {
  eventId = check.checkObjectId(eventId);
  const eventsCollection = await events();
  const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
  if (!event) {
    throw new Error("Event not found");
  }
  return event.comments;
};

const getAllCommentsByUserId = async (userId) => {
  userId = check.checkObjectId(userId);

  const eventsCollection = await events();
  const event = await eventsCollection
    .find({ "comments.user_id": new ObjectId(userId) })
    .toArray();
  if (!event) {
    throw new Error("Event not found");
  }

  const comments = event.flatMap((e) =>
    e.comments.filter((c) => c.user_id.toString() === userId)
  );
  if (comments.length === 0) {
    throw new Error("No comments found for this user");
  }
  return comments;
};

const getCommentById = async (commentId) => {
  commentId = check.checkObjectId(commentId);
  const eventsCollection = await events();
  const event = await eventsCollection.findOne(
    { "comments._id": new ObjectId(commentId) },
    { projection: { _id: 0, "comments.$": 1 } }
  );
  if (!event) {
    throw new Error("Comment not found");
  }
  return event.comments[0];
};
const removeComment = async (commentId) => {
  commentId = check.checkObjectId(commentId);

  const eventsCollection = await events();
  const event = await eventsCollection.findOne({
    "comments._id": new ObjectId(commentId),
  });
  if (!event) {
    throw new Error("Comment not found");
  }

  const updateInfo = await eventsCollection.updateOne(
    { "comments._id": new ObjectId(commentId) },
    { $pull: { comments: { _id: new ObjectId(commentId) } } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
    throw new Error("Could not delete comment");
  }

  const updatedEvent = await eventsCollection.findOne({
    _id: new ObjectId(event._id),
  });
  if (!updatedEvent) {
    throw new Error("Could not find updated event");
  }
  return updatedEvent;
};

const updateComment = async (commentId, content) => {
  commentId = check.checkObjectId(commentId);
  content = check.checkVaildString(content, "Content");

  const eventsCollection = await events();
  const event = await eventsCollection.findOne({
    "comments._id": new ObjectId(commentId),
  });
  if (!event) {
    throw new Error("Comment not found");
  }
  const updateInfo = await eventsCollection.updateOne(
    { "comments._id": new ObjectId(commentId) },
    { $set: { "comments.$.content": content } }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount) {
    throw new Error("Could not update comment");
  }

  const updatedEvent = await eventsCollection.findOne({
    _id: new ObjectId(event._id),
  });
  if (!updatedEvent) {
    throw new Error("Could not find updated event");
  }
  return updatedEvent;
};

export default {
  createComment,
  getAllCommentsByEventId,
  getAllCommentsByUserId,
  getCommentById,
  removeComment,
  updateComment,
};
