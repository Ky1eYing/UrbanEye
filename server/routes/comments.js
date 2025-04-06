import express from "express";
import { commentsData } from "../data/index.js";
import * as check from "../utils/helpers.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router
    .route("/event/:eventId")
    // getAllCommentsByEventId
    .get(async (req, res) => {
        let event_id = req.params.eventId;
        try {
            event_id = check.checkObjectId(event_id);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }

        try {
            const comments = await commentsData.getAllCommentsByEventId(event_id);
            return res.status(200).json(comments);
        } catch (e) {
            return res.status(404).json({ error: e.message });
        }
    })
    
    // createComment
    .post(async (req, res) => {
        let event_id = req.params.eventId;
        const commentInfo = req.body;
        
        if (!commentInfo || Object.keys(commentInfo).length === 0) {
            return res.status(400).json({ error: "There are no fields in the request body" });
        }

        let { user_id, content } = commentInfo;

        try {
            event_id = check.checkObjectId(event_id);
            user_id = check.checkObjectId(user_id);
            content = check.checkVaildString(content, "Content");
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }

        try {
            const newComment = await commentsData.createComment(
                event_id,
                user_id,
                content
            );
            return res.status(200).json(newComment);
        } catch (e) {
            return res.status(404).json({ error: e.message });
        }
    });
    

router
    .route("/user/:userId")
    // getAllCommentsByUserId
    .get(async (req, res) => {
        let user_id = req.params.userId;
        try {
            user_id = check.checkObjectId(user_id);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }

        try {
            const comments = await commentsData.getAllCommentsByUserId(user_id);
            return res.status(200).json(comments);
        } catch (e) {
            return res.status(404).json({ error: e.message });
        }
    });

router
    .route("/:commentId")
    //getCommentById
    .get(async (req, res) => {
        let comment_id = req.params.commentId;
        try {
            comment_id = check.checkObjectId(comment_id);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }

        try {
            const comment = await commentsData.getCommentById(comment_id);
            return res.status(200).json(comment);
        } catch (e) {
            return res.status(404).json({ error: e.message });
        }
    })
    // removeComment
    .delete(async (req, res) => {
        let comment_id = req.params.commentId;
        try {
            comment_id = check.checkObjectId(comment_id);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }

        try {
            const updatedEvent = await commentsData.removeComment(comment_id);
            return res.status(200).json(updatedEvent);
        } catch (e) {
            return res.status(404).json({ error: e.message });
        }
    })
    // updateComment
    .put(async (req, res) => {
        let comment_id = req.params.commentId;
        const commentInfo = req.body;

        if (!commentInfo || Object.keys(commentInfo).length === 0) {
            return res.status(400).json({ error: "There are no fields in the request body" });
        }

        let { content } = commentInfo;

        try {
            comment_id = check.checkObjectId(comment_id);
            content = check.checkVaildString(content, "Content");
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }

        try {
            const updatedComment = await commentsData.updateComment(
                comment_id,
                content
            );
            return res.status(200).json(updatedComment);
        } catch (e) {
            return res.status(404).json({ error: e.message });
        }
    });

export default router;