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
  const checked_title = check.checkTitle(title);
  const checked_content = check.checkContent(content);
  const checked_location = check.checkLocation(location);
  const checked_category = check.checkCategory(category);
  const checked_photoUrl = check.checkPhotoUrl(photoUrl);

  // create empty element
  const click_time = 0;
  const likes = [];
  const comments = [];
  const reports = [];
  const blocked = false;

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
    reports: reports,
    blocked: blocked,
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

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// get all events by filter
const getAllEventsByFilter = async (params = {}) => {
  const {
    titlelike = "", // title fuzzy matching
    distance = "all", // default all, optional "1miles","3miles","5miles","10miles"
    sortBy = "views", // default views, optional "newest"
    category = "all", // default all, optional specific categories
    timeRange = "all", // default all, optional "1","7","30","365"
    userLocation = null, // { latitude, longitude }
    skip = 200, // events per page
  } = params;

  const eventsCollection = await events();

  const query = {};

  query.blocked = false;

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
      case "1":
        dateFilter.setDate(now.getDate() - 1);
        break;
      case "7":
        dateFilter.setDate(now.getDate() - 7);
        break;
      case "30":
        dateFilter.setDate(now.getDate() - 30);
        break;
      case "365":
        dateFilter.setFullYear(now.getFullYear() - 1);
        break;
    }
    query.created_at = { $gte: dateFilter };
  }

  // 3. sort
  const sortOption =
    sortBy === "views" ? { click_time: -1 } : { created_at: -1 };

  // do first filter
  const candidates = await eventsCollection
    .find(query)
    .sort(sortOption)
    .toArray();

  // 4. distance filtering
  let filtered = candidates;
  if (
    distance !== "all" &&
    userLocation &&
    userLocation.latitude &&
    userLocation.longitude
  ) {
    const miles = parseFloat(distance.replace("miles", ""), 10);
    const maxKm = miles * 1.60934;
    const lat1 = parseFloat(userLocation.latitude);
    const lon1 = parseFloat(userLocation.longitude);

    filtered = candidates.filter((evt) => {
      if (!evt.location || !evt.location.latitude || !evt.location.longitude) {
        return false;
      }
      const lat2 = parseFloat(evt.location.latitude);
      const lon2 = parseFloat(evt.location.longitude);
      const d = haversineDistanceKm(lat1, lon1, lat2, lon2);
      evt._distance = d;
      return d <= maxKm;
    });
  }

  // 5. skip count
  const results = filtered.slice(0, parseInt(skip, 10));

  return results.map((evt) => {
    const { _distance, ...rest } = evt;
    rest._id = rest._id.toString();
    return rest;
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
  const checked_title = check.checkTitle(title);
  const checked_content = check.checkContent(content);
  const checked_location = check.checkLocation(location);
  const checked_category = check.checkCategory(category);
  const checked_photoUrl = check.checkPhotoUrl(photoUrl);

  // get old event
  const eventsCollection = await events();
  const event = await getEventByEventId(checked_eventId);

  const updatedEventData = {
    user_id: event.user_id,
    title: checked_title,
    content: checked_content,
    created_at: event.created_at,
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
