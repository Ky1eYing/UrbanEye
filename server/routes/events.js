import express from "express";
import { eventsData } from "../data/index.js";
import * as check from "../utils/helpers.js";
import { ObjectId } from "mongodb";
import {
  requireLogin,
  requireNotLogin,
  redirectLogin,
  attachUser,
} from "../middleware/auth.js";
import { ENABLE_AUTH_CHECK } from "../config/env.js";

const router = express.Router();

router
  .route("/filter")
  // getFilterEvents
  .get(async (req, res) => {
    const {
      titleLike,
      distance,
      sortBy,
      category,
      timeRange,
      skip
    } = req.query;

    let userLocation = null;
    if (req.query.latitude && req.query.longitude) {
      userLocation = {
        latitude: req.query.latitude,
        longitude: req.query.longitude
      };
    }

    try {
      const filterParams = {};

      if (titleLike) filterParams.titlelike = titleLike;
      if (distance) filterParams.distance = distance;
      if (sortBy) filterParams.sortBy = sortBy;
      if (category) filterParams.category = category;
      if (timeRange) filterParams.timeRange = timeRange;
      if (userLocation) filterParams.userLocation = userLocation;
      if (skip) filterParams.skip = parseInt(skip);

      const events = await eventsData.getAllEventsByFilter(filterParams);

      return res.status(200).json({
        code: 200,
        message: "success",
        data: events,
        total: events.length
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });

router
  .route("/")
  // getAllEvents
  .get(async (req, res) => {
    try {
      // Use default parameters for getAllEventsByFilter
      const events = await eventsData.getAllEventsByFilter();

      return res.status(200).json({
        code: 200,
        message: "success",
        data: events,
        total: events.length
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  })
  // createEvent
  .post(requireLogin, async (req, res) => {
    const eventInfo = req.body;
    if (!eventInfo || Object.keys(eventInfo).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    const { user_id, title, content, location, category, photoUrl } = eventInfo;
    if (
      [user_id, title, content, location, category, photoUrl].some(
        (arg) => arg === undefined
      )
    ) {
      return res.status(400).json({
        error: "All fields need to have valid values during create event.",
      });
    }

    let checked_user_id,
      checked_title,
      checked_content,
      checked_location,
      checked_category,
      checked_photoUrl;
    try {
      checked_user_id = check.checkObjectId(user_id);
      checked_title = check.checkVaildString(title, "Title");
      checked_content = check.checkVaildString(content, "Content");
      checked_location = check.checkLocation(location);
      checked_category = check.checkCategory(category);
      checked_photoUrl = check.checkVaildString(photoUrl, "PhotoUrl");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    if (ENABLE_AUTH_CHECK) {
      if (req.session.userId !== checked_user_id) {
        return res
          .status(403)
          .json({ error: "Forbidden! You are not authorized" });
      }
    }

    try {
      const newEvent = await eventsData.createEvent(
        checked_user_id,
        checked_title,
        checked_content,
        checked_location,
        checked_category,
        checked_photoUrl
      );
      return res.status(200).json({
        code: 200,
        message: "success",
        data: newEvent,
      });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  });

router
  .route("/:eventId")
  // getEventByEventId
  .get(async (req, res) => {
    let checked_eventId;
    try {
      checked_eventId = check.checkVaildString(req.params.eventId, "eventId");
      if (!ObjectId.isValid(checked_eventId)) {
        throw new Error("ID is not a valid ObjectId");
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    try {
      const event = await eventsData.getEventByEventId(checked_eventId);
      return res.status(200).json({
        code: 200,
        message: "success",
        data: event,
      });
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  // removeEvent
  .delete(requireLogin, async (req, res) => {
    let checked_eventId;
    try {
      checked_eventId = check.checkVaildString(req.params.eventId, "eventId");
      if (!ObjectId.isValid(checked_eventId)) {
        throw new Error("ID is not a valid ObjectId");
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    if (ENABLE_AUTH_CHECK) {
      let authUserId;
      try {
        const event = await eventsData.getEventByEventId(checked_eventId);
        authUserId = event.user_id.toString();
      } catch (e) {
        return res.status(404).json({ error: e.message });
      }

      if (req.session.userId !== authUserId) {
        return res
          .status(403)
          .json({ error: "Forbidden! You are not authorized" });
      }
    }

    try {
      const deleteInfo = await eventsData.removeEvent(checked_eventId);
      return res.status(200).json({
        code: 200,
        message: deleteInfo,
      });
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  // updateEvent
  .put(requireLogin, async (req, res) => {
    let checked_eventId;
    try {
      checked_eventId = check.checkVaildString(req.params.eventId, "eventId");
      if (!ObjectId.isValid(checked_eventId)) {
        throw new Error("ID is not a valid ObjectId");
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const eventInfo = req.body;
    if (!eventInfo || Object.keys(eventInfo).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    const { title, content, location, category, photoUrl } = eventInfo;
    if (
      [title, content, location, category, photoUrl].some(
        (arg) => arg === undefined
      )
    ) {
      return res
        .status(400)
        .json({ error: "All fields need to have valid values" });
    }

    let checked_title,
      checked_content,
      checked_location,
      checked_category,
      checked_photoUrl;
    try {
      checked_title = check.checkVaildString(title, "Title");
      checked_content = check.checkVaildString(content, "Content");
      checked_location = check.checkLocation(location);
      checked_category = check.checkCategory(category);
      checked_photoUrl = check.checkVaildString(photoUrl, "PhotoUrl");
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    if (ENABLE_AUTH_CHECK) {
      let authUserId;
      try {
        const event = await eventsData.getEventByEventId(checked_eventId);
        authUserId = event.user_id.toString();
      } catch (e) {
        return res.status(404).json({ error: e.message });
      }

      if (req.session.userId !== authUserId) {
        return res
          .status(403)
          .json({ error: "Forbidden! You are not authorized" });
      }
    }

    try {
      const updatedEvent = await eventsData.updateEvent(
        checked_eventId,
        checked_title,
        checked_content,
        checked_location,
        checked_category,
        checked_photoUrl
      );
      return res.status(200).json({
        code: 200,
        message: "success",
        data: updatedEvent,
      });
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  });

// GET events by user id
router.route("/user/:userId").get(requireLogin, async (req, res) => {
  let checked_userId;
  try {
    checked_userId = check.checkVaildString(req.params.userId, "userId");
    if (!ObjectId.isValid(checked_userId)) {
      throw new Error("ID is not a valid ObjectId");
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  if (ENABLE_AUTH_CHECK) {
    if (req.session.userId !== checked_userId) {
      return res
        .status(403)
        .json({ error: "Forbidden! You are not authorized" });
    }
  }

  try {
    const userEvents = await eventsData.getEventByUserId(checked_userId);
    return res.status(200).json({
      code: 200,
      message: "success",
      data: userEvents,
    });
  } catch (e) {
    return res.status(404).json({ error: e.message });
  }
});

export default router;
