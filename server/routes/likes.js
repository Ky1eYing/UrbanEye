import express from "express";
import { likesData } from "../data/index.js";
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

// Create a like
router.route("/").post(requireLogin, async (req, res) => {
  const likeInfo = req.body;
  if (!likeInfo || Object.keys(likeInfo).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }

  const { user_id, event_id } = likeInfo;
  if (!user_id || !event_id) {
    return res
      .status(400)
      .json({ error: "All fields need to have valid values" });
  }

  let checked_user_id, checked_event_id;
  try {
    checked_user_id = check.checkObjectId(user_id);
    checked_event_id = check.checkObjectId(event_id);
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
    const newLike = await likesData.createLike(
      checked_user_id,
      checked_event_id
    );
    return res.status(200).json({
      code: 200,
      message: "success",
      data: newLike,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

// Remove a like
router.route("/:userId/:eventId").delete(requireLogin, async (req, res) => {
  let checked_user_id, checked_event_id;
  try {
    checked_user_id = check.checkVaildString(req.params.userId, "userId");
    checked_event_id = check.checkVaildString(req.params.eventId, "eventId");

    if (
      !ObjectId.isValid(checked_user_id) ||
      !ObjectId.isValid(checked_event_id)
    ) {
      throw new Error("IDs are not valid ObjectIds");
    }
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
    const result = await likesData.removeLike(
      checked_user_id,
      checked_event_id
    );
    return res.status(200).json({
      code: 200,
      message: "success",
      data: result,
    });
  } catch (e) {
    return res.status(404).json({ error: e.message });
  }
});

// Get all likes by user ID
router.route("/user/:userId").get(requireLogin, async (req, res) => {
  let checked_user_id;
  try {
    checked_user_id = check.checkVaildString(req.params.userId, "userId");
    if (!ObjectId.isValid(checked_user_id)) {
      throw new Error("ID is not a valid ObjectId");
    }
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
    const likes = await likesData.getLikeByUserId(checked_user_id);
    return res.status(200).json({
      code: 200,
      message: "success",
      data: likes,
    });
  } catch (e) {
    return res.status(404).json({ error: e.message });
  }
});

// Get like status for an event by a user
router.route("/:userId/:eventId").get(requireLogin, async (req, res) => {
  let checked_user_id, checked_event_id;
  try {
    checked_user_id = check.checkVaildString(req.params.userId, "userId");
    checked_event_id = check.checkVaildString(req.params.eventId, "eventId");

    if (
      !ObjectId.isValid(checked_user_id) ||
      !ObjectId.isValid(checked_event_id)
    ) {
      throw new Error("IDs are not valid ObjectIds");
    }
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
    const likeStatus = await likesData.getLikeByUserIdEventId(
      checked_user_id,
      checked_event_id
    );
    return res.status(200).json({
      code: 200,
      message: "success",
      data: likeStatus,
    });
  } catch (e) {
    return res.status(404).json({ error: e.message });
  }
});

export default router;
