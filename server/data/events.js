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

// get all events by filter
const getAllEventsByFilter = async (params = {}) => {
  const {
    titlelike = "",          // title fuzzy matching
    distance = "1miles",     // default 1 miles, optional "3miles","5miles","10miles"
    sortBy = "newest",       // default newest, optional "views"
    category = "all",        // default all, optional specific categories
    timeRange = "all",       // default all, optional "1day","7days","30days"
    userLocation = null,     // { latitude, longitude }
    skip = 10                // events per page
  } = params;

  const eventsCollection = await events();

  const query = {};

  // 0. title fuzzy matching
  if (titlelike) {
    query.title = { $regex: titlelike, $options: "i" };
  }

  // 1. category filtering
  if (category !== "all") {
    query.category = category;
  }

  // 2. time range filtering
  if (timeRange !== "all") {
    const now = new Date();
    let dateFilter = new Date(now);
    switch (timeRange) {
      case "1day":
        dateFilter.setDate(now.getDate() - 1);
        break;
      case "7days":
        dateFilter.setDate(now.getDate() - 7);
        break;
      case "30days":
        dateFilter.setDate(now.getDate() - 30);
        break;
      case "1year":
        dateFilter.setFullYear(now.getFullYear() - 1);
        break;
    }
    query.created_at = { $gte: dateFilter };
  }

  // 3. distance filtering
  if (
    userLocation &&
    userLocation.latitude &&
    userLocation.longitude
  ) {
    const lat = parseFloat(userLocation.latitude);
    const lon = parseFloat(userLocation.longitude);
    const miles = parseInt(distance.replace("miles", ""));
    const radius = miles / 3958.8;
    query.location = {
      $geoWithin: {
        $centerSphere: [[lon, lat], radius]
      }
    };
  }

  // 4. sort
  const sortOption =
    sortBy === "views"
      ? { click_time: -1 }
      : { created_at: -1 };

  const cursor = eventsCollection
    .find(query)
    .sort(sortOption)
    .limit(skip);

  const results = await cursor.toArray();
  return results.map(evt => {
    evt._id = evt._id.toString();
    return evt;
  });
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

// add click time by event id
export const addClickTime = async (eventId) => {
  const checked_eventId = check.checkObjectId(eventId);

  const eventsCollection = await events();

  const updateInfo = await eventsCollection.findOneAndUpdate(
    { _id: new ObjectId(checked_eventId) },
    { $inc: { click_time: 1 } },
    { returnDocument: "after" }
  );

  if (!updateInfo) {
    throw new Error(`Could not find an event with id of ${checked_eventId}`);
  }

  updateInfo._id = updateInfo._id.toString();
  return updateInfo;
};

export default {
  createEvent,
  getAllEventsByFilter,
  getEventByEventId,
  getEventByUserId,
  updateEvent,
  removeEvent,
  addClickTime,
};
