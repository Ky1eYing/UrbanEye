import express from "express";
import { eventsData, adCategoryData } from "../data/index.js";
import * as check from "../utils/helpers.js";
import { ObjectId } from "mongodb";
import {
  requireLogin,
  requireNotLogin,
  redirectLogin,
  attachUser,
} from "../middleware/auth.js";
import { ENABLE_AUTH_CHECK } from "../config/env.js";
import xss from "xss";

const router = express.Router();

router
  .route("/filter")
  // getFilterEvents
  .get(async (req, res) => {
    let titleLike = xss(req.query.titleLike);
    let distance = xss(req.query.distance);
    let sortBy = xss(req.query.sortBy);
    let category = xss(req.query.category);
    let timeRange = xss(req.query.timeRange);
    let skip = xss(req.query.skip);
    let lat = xss(req.query.latitude);
    let lng = xss(req.query.longitude);

    // Default user location (New York City)
    const nyPosition = { lat: 40.75171244845984, lng: -73.98179241229592 };
    let userLocation = {
      latitude: nyPosition.lat,
      longitude: nyPosition.lng
    };
    if (lat && lng) {
      userLocation = {
        latitude: lat,
        longitude: lng
      };
    }
    console.log("userLocation", userLocation);

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
    let user_id = xss(req.body.user_id);
    let title = xss(req.body.title);
    let content = xss(req.body.content);
    let location = req.body.location;
    let category = xss(req.body.category);
    let photoUrl = xss(req.body.photoUrl);
    if (!user_id || !title || !content || !location || !category || !photoUrl) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // add xss processing to location object
    if (typeof location === 'object') {
      if (location.address) location.address = xss(location.address);
      if (location.name) location.name = xss(location.name);
      if (location.description) location.description = xss(location.description);
    }

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
      checked_title = check.checkTitle(title);
      checked_content = check.checkContent(content);
      checked_location = check.checkLocation(location);
      checked_category = check.checkCategory(category);
      checked_photoUrl = check.checkPhotoUrl(photoUrl);
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
      checked_eventId = check.checkVaildString(xss(req.params.eventId), "eventId");
      if (!ObjectId.isValid(checked_eventId)) {
        throw new Error("ID is not a valid ObjectId");
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    try {
      const event = await eventsData.getEventByEventId(checked_eventId);

      try {
        await eventsData.addClickTime(checked_eventId);

        // check if the user is logged in
        if (ENABLE_AUTH_CHECK) {
          // if the user is logged in, then update the user's ad category record
          if (req.session && req.session.userId) {
            try {
              await adCategoryData.addAdCategory(req.session.userId, checked_eventId);
              console.log("Successfully updated ad category for user:", req.session.userId);
            } catch (adCategoryErr) {
              // just show the error
              console.error(`Failed to update ad category: ${adCategoryErr.message}`);
            }
          } else {
            console.log("User not logged in, skipping ad category update");
          }
        }
      } catch (err) {
        return res.status(500).json({
          error: `Failed to increment click count: ${err.message}`
        });
      }

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
      checked_eventId = check.checkVaildString(xss(req.params.eventId), "eventId");
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
      checked_eventId = check.checkVaildString(xss(req.params.eventId), "eventId");
      if (!ObjectId.isValid(checked_eventId)) {
        throw new Error("ID is not a valid ObjectId");
      }
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    let user_id = xss(req.body.user_id);
    let title = xss(req.body.title);
    let content = xss(req.body.content);
    let location = req.body.location;
    let category = xss(req.body.category);
    let photoUrl = xss(req.body.photoUrl);
    if (!title || !content || !location || !category || !photoUrl) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // add xss processing to location object
    if (typeof location === 'object') {
      if (location.address) location.address = xss(location.address);
      if (location.name) location.name = xss(location.name);
      if (location.description) location.description = xss(location.description);
    }

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
      checked_title = check.checkTitle(title);
      checked_content = check.checkContent(content);
      checked_location = check.checkLocation(location);
      checked_category = check.checkCategory(category);
      checked_photoUrl = check.checkPhotoUrl(photoUrl);
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
    checked_userId = check.checkVaildString(xss(req.params.userId), "userId");
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
