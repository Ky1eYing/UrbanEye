import { ObjectId } from "mongodb";
import { events } from "../config/mongoCollections.js";
import * as check from "../utils/helpers.js";

// create event func
const createEvent = async (
  user_id,
  title,
  content,
  location,
  category,
  photoUrl
) => {
  // check all fields
  if (
    [user_id, title, content, location, category, photoUrl].some(
      (arg) => arg === undefined
    )
  ) {
    throw new Error(
      "All fields need to have valid values during create event."
    );
  }

  // check each input
  const checked_userId = check.checkObjectId(user_id);
  const checked_title = check.checkVaildString(title, "Title");
  const checked_content = check.checkVaildString(content, "Content");
  const checked_location = check.checkLocation(location);
  const checked_category = check.checkCategory(category);
  const checked_photoUrl = check.checkVaildString(photoUrl, "PhotoUrl");

  // create empty element
  const click_time = 0;
  const likes = [];
  const comments = [];

  const newEvent = {
    user_id: new ObjectId(checked_userId),
    title: checked_title,
    content: checked_content,
    created_at: new Date(),
    location: checked_location,
    category: checked_category,
    click_time: click_time,
    likes: likes,
    comments: comments,
    photoUrl: checked_photoUrl,
  };

  const eventsCollection = await events();
  const insertInfo = await eventsCollection.insertOne(newEvent);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error("Could not add event");
  }

  const newId = insertInfo.insertedId.toString();
  const event = await getEventByEventId(newId);

  return event;
};

// get all events
const getAllEvents = async () => {
  const eventsCollection = await events();
  let eventsList = await eventsCollection.find({}).toArray();
  if (!eventsList) {
    throw "Could not get all events";
  }

  eventsList = eventsList.map((element) => {
    element._id = element._id.toString();
    return element;
  });

  return eventsList;
};

// get one event by event id
const getEventByEventId = async (eventId) => {
  const checked_eventId = check.checkObjectId(eventId);

  let eventsCollection = await events();
  const event = await eventsCollection.findOne({
    _id: new ObjectId(checked_eventId),
  });
  if (!event) {
    throw new Error("No event with that id");
  }
  event._id = event._id.toString();

  return event;
};

// get all events by user id
const getEventByUserId = async (userId) => {
  const checked_userId = check.checkObjectId(userId);

  const eventsCollection = await events();
  let userEvents = await eventsCollection
    .find({ user_id: new ObjectId(checked_userId) })
    .toArray();
  if (!userEvents || userEvents.length === 0) {
    throw new Error("No events found for that user id");
  }
  userEvents.forEach((event) => {
    event._id = event._id.toString();
  });

  return userEvents;
};

// remove one event by event id
const removeEvent = async (eventId) => {
  const checked_eventId = check.checkObjectId(eventId);

  const eventsCollection = await events();
  const deletionInfo = await eventsCollection.findOneAndDelete({
    _id: new ObjectId(checked_eventId),
  });
  if (!deletionInfo) {
    throw new Error(`Could not delete event with id of ${checked_eventId}`);
  }

  return `${deletionInfo.title} has been successfully deleted!`;
};

// update event
const updateEvent = async (
  event_id,
  title,
  content,
  location,
  category,
  photoUrl
) => {
  // check all fields
  if (
    [event_id, title, content, location, category, photoUrl].some(
      (arg) => arg === undefined
    )
  ) {
    throw new Error(
      "All fields need to have valid values during update event."
    );
  }

  // check each input
  const checked_eventId = check.checkObjectId(event_id);
  const checked_title = check.checkVaildString(title, "Title");
  const checked_content = check.checkVaildString(content, "Content");
  const checked_location = check.checkLocation(location);
  const checked_category = check.checkCategory(category);
  const checked_photoUrl = check.checkVaildString(photoUrl, "PhotoUrl");

  // get old event
  const eventsCollection = await events();
  const event = await getEventByEventId(checked_eventId);

  const updatedEventData = {
    user_id: event.user_id,
    title: checked_title,
    content: checked_content,
    created_at: new Date(),
    location: checked_location,
    category: checked_category,
    click_time: event.click_time,
    likes: event.likes,
    comments: event.comments,
    photoUrl: checked_photoUrl,
  };

  const updateInfo = await eventsCollection.findOneAndReplace(
    { _id: new ObjectId(checked_eventId) },
    updatedEventData,
    { returnDocument: "after" }
  );
  if (!updateInfo) {
    throw new Error(
      `Error: Update failed, could not find an event with id of ${checked_eventId}`
    );
  }
  updateInfo._id = updateInfo._id.toString();

  return updateInfo;
};

export default {
  createEvent,
  getAllEvents,
  getEventByEventId,
  getEventByUserId,
  updateEvent,
  removeEvent,
};
