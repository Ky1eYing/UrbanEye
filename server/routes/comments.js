import express from "express";
import { commentsData } from "../data/index.js";
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
  .route("/event/:eventId")
  // getAllCommentsByEventId
  .get(async (req, res) => {
    let event_id = xss(req.params.eventId);
    try {
      event_id = check.checkObjectId(event_id);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    try {
      const comments = await commentsData.getAllCommentsWithUserByEventId(event_id);
      return res.status(200).json({
        code: 200,
        message: "success",
        data: comments,
      });
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })

  // createComment
  .post(requireLogin, async (req, res) => {
    let event_id = xss(req.params.eventId);
    let user_id = xss(req.body.user_id);
    let content = xss(req.body.content);

    if (!user_id || !content) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    try {
      event_id = check.checkObjectId(event_id);
      user_id = check.checkObjectId(user_id);
      content = check.checkComment(content);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    if (ENABLE_AUTH_CHECK) {
      if (req.session.userId !== user_id) {
        return res
          .status(403)
          .json({ error: "Forbidden! You are not authorized" });
      }
    }

    try {
      const newComment = await commentsData.createComment(
        event_id,
        user_id,
        content
      );
      return res.status(200).json({
        code: 200,
        message: "success",
        data: newComment,
      });
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  });

router
  .route("/user/:userId")
  // getAllCommentsByUserId
  .get(requireLogin, async (req, res) => {
    let user_id = xss(req.params.userId);
    try {
      user_id = check.checkObjectId(user_id);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    if (ENABLE_AUTH_CHECK) {
      if (req.session.userId !== user_id) {
        return res
          .status(403)
          .json({ error: "Forbidden! You are not authorized" });
      }
    }

    try {
      const comments = await commentsData.getAllCommentsByUserId(user_id);
      return res.status(200).json({
        code: 200,
        message: "success",
        data: comments,
      });
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  });

router
  .route("/:commentId")
  //getCommentById
  .get(async (req, res) => {
    let comment_id = xss(req.params.commentId);
    try {
      comment_id = check.checkObjectId(comment_id);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    try {
      const comment = await commentsData.getCommentById(comment_id);
      return res.status(200).json({
        code: 200,
        message: "success",
        data: comment,
      });
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  // removeComment
  .delete(requireLogin, async (req, res) => {
    let comment_id = xss(req.params.commentId);
    try {
      comment_id = check.checkObjectId(comment_id);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    if (ENABLE_AUTH_CHECK) {
      let authUserId;
      try {
        const comment = await commentsData.getCommentById(comment_id);
        authUserId = comment.user_id.toString();
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
      const updatedEvent = await commentsData.removeComment(comment_id);
      return res.status(200).json({
        code: 200,
        message: "success",
        data: updatedEvent,
      });
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  })
  // updateComment
  .put(requireLogin, async (req, res) => {
    let comment_id = xss(req.params.commentId);
    let content = xss(req.body.content);

    if (!content) {
      return res
        .status(400)
        .json({ error: "Comment content is required" });
    }

    try {
      comment_id = check.checkObjectId(comment_id);
      content = check.checkComment(content);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    if (ENABLE_AUTH_CHECK) {
      let authUserId;
      try {
        const comment = await commentsData.getCommentById(comment_id);
        authUserId = comment.user_id.toString();
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
      const updatedComment = await commentsData.updateComment(
        comment_id,
        content
      );
      return res.status(200).json({
        code: 200,
        message: "success",
        data: updatedComment,
      });
    } catch (e) {
      return res.status(404).json({ error: e.message });
    }
  });

export default router;
