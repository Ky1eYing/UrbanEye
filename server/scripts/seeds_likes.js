// scripts/seeds_likes.js
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { events } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const db = await dbConnection();

// Get the first event and user from existing data to add likes
const eventsCollection = await events();
const firstEvent = await eventsCollection.findOne({});

if (!firstEvent) {
    console.log("No events found. Please run the events seed file first.");
    await closeConnection();
    process.exit(0);
}

// Create a test user ID if needed
const testUserId = new ObjectId();

// Add a like to the first event
const newLike = {
    _id: new ObjectId(),
    user_id: testUserId,
    liked_at: new Date()
};

const updateResult = await eventsCollection.updateOne(
    { _id: firstEvent._id },
    { $push: { likes: newLike } }
);

console.log(`Added like to event: ${updateResult.modifiedCount > 0 ? 'Success' : 'Failed'}`);

await closeConnection();