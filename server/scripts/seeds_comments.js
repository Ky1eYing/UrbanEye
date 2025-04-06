import comments from '../data/comments.js';
import events from '../data/events.js';
import { dbConnection, closeConnection } from '../config/mongoConnection.js';
import { ObjectId } from 'mongodb';

const db = await dbConnection();

async function main() {

    const eventList = await events.getAllEvents();
    let event0 = eventList[0];
    let event1 = eventList[1];
    event1 = await comments.createComment(
        event1._id.toString(),
        event0.user_id.toString(),
        "This is a second test comment"
    );
    await comments.createComment(
        event0._id.toString(),
        event0.user_id.toString(),
        "This is a test comment"
    );

    // Create a new comment
    event0 = await comments.createComment(
        event0._id.toString(),
        event0.user_id.toString(),
        "This is a test comment"
    );
    console.log("New Comment:", event0);
    // Get all comments by event ID
    const allCommentsByEventId = await comments.getAllCommentsByEventId(
        event0._id.toString()
    );
    console.log("All Comments by Event ID:", allCommentsByEventId);
    // Get all comments by user ID
    const allCommentsByUserId = await comments.getAllCommentsByUserId(
        event0.user_id.toString()
    );
    console.log("All Comments by User ID:", allCommentsByUserId);

    // Get comment by ID
    const commentById = await comments.getCommentById(
        allCommentsByUserId[allCommentsByUserId.length - 1]._id.toString()
    );
    console.log("Comment by ID:", commentById);
    // Update comment by ID
    const updatedComment = await comments.updateComment(
        event0.comments[1]._id.toString(),
        "This is an updated test comment"
    );
    console.log("Updated Comment:", updatedComment);
    // Delete comment by ID
    const removeComment = await comments.removeComment(
        event0.comments[1]._id.toString()
    );
    console.log("Removed Comment:", removeComment);


    await closeConnection();

}

main();