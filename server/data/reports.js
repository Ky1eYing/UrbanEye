import { ObjectId } from "mongodb";
import { events } from "../config/mongoCollections.js";
import * as check from "../utils/helpers.js";

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

  const userAlreadyReported = event.reports.some(
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

  return {
    _id: newReport._id.toString(),
    user_id: checked_user_id,
    event_id: checked_event_id,
    reported_at: newReport.reported_at,
  };
};

export default {
  createReport,
};
