import { ObjectId } from "mongodb";
import { events } from "../config/mongoCollections.js";
import * as check from "../utils/helpers.js";
import eventsDataFunctions from "./events.js";

const createReport = async (user_id, event_id) => {
  if (!user_id || !event_id) {
    throw new Error("All fields must have valid values");
  }

  const checked_user_id = check.checkObjectId(user_id);
  const checked_event_id = check.checkObjectId(event_id);

  const eventsCollection = await events();
  const event = await eventsCollection.findOne({
    _id: new ObjectId(checked_event_id),
  });
  if (!event) {
    throw new Error("Event not found");
  }

  const userAlreadyReported = event.reports?.some(
    (report) => report.user_id.toString() === checked_user_id
  );
  if (userAlreadyReported) {
    throw new Error("User has already reported this event");
  }

  const newReport = {
    _id: new ObjectId(),
    user_id: new ObjectId(checked_user_id),
    reported_at: new Date(),
  };

  const updateInfo = await eventsCollection.updateOne(
    { _id: new ObjectId(checked_event_id) },
    { $push: { reports: newReport } }
  );

  if (!updateInfo.acknowledged || updateInfo.modifiedCount !== 1) {
    throw new Error("Could not add report to event");
  }

  try {
    await dealBlocked(checked_event_id);
  } catch (err) {
    console.error(err?.message || err);
  }

  return {
    _id: newReport._id.toString(),
    user_id: checked_user_id,
    event_id: checked_event_id,
    reported_at: newReport.reported_at,
  };
};

const dealBlocked = async (eventId) => {
  const event = await eventsDataFunctions.getEventByEventId(eventId);

  if (event.blocked === true) return false;

  const reportCount = event.reports.length;
  const clickCount = event.click_time;
  const likeCount = event.likes.length;

  if (reportCount >= 5) {
    if (reportCount > likeCount && reportCount > clickCount / 10) {
      const eventsCollection = await events();

      const updateInfo = await eventsCollection.updateOne(
        { _id: new ObjectId(eventId) },
        { $set: { blocked: true } }
      );

      if (!updateInfo.acknowledged || updateInfo.matchedCount === 0) {
        throw new Error("Could not update blocked to event");
      }

      return true;
    }
  }
  return false;
};

export default {
  createReport,
};
