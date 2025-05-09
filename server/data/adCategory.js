import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import * as check from "../utils/helpers.js";
import eventsData from "./events.js";


const addAdCategory = async (userId, eventId) => {
    if (!userId || !eventId) {
        throw new Error("All fields must have valid values");
    }

    const checked_user_id = check.checkObjectId(userId);
    const checked_event_id = check.checkObjectId(eventId);

    const event = await eventsData.getEventByEventId(checked_event_id);
    if (!event) {
        throw new Error("Event not found");
    }

    const category = event.category;

    const usersCollection = await users();

    const user = await usersCollection.findOne({ _id: new ObjectId(checked_user_id) });
    if (!user) {
        throw new Error("User not found");
    }

    let adCategory = user.adCategory || {};

    // update the category count, if it exists, then +1, otherwise, initialize it to 1
    adCategory[category] = (adCategory[category] || 0) + 1;

    const updateInfo = await usersCollection.updateOne(
        { _id: new ObjectId(checked_user_id) },
        { $set: { adCategory: adCategory } }
    );

    if (!updateInfo.acknowledged || updateInfo.modifiedCount !== 1) {
        throw new Error("Could not update user's adCategory");
    }

    return {
        userId: checked_user_id,
        eventId: checked_event_id,
        category: category,
        adCategory: adCategory
    };
};

const getTopCategories = async (userId) => {
    if (!userId) {
        throw new Error("User ID must be provided");
    }

    const checked_user_id = check.checkObjectId(userId);

    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(checked_user_id) });

    if (!user) {
        throw new Error("User not found");
    }

    const adCategory = user.adCategory || {};

    if (Object.keys(adCategory).length === 0) {
        return "";
    }

    let maxCategory = "";
    let maxCount = 0;

    for (const [category, count] of Object.entries(adCategory)) {
        if (count > maxCount) {
            maxCount = count;
            maxCategory = category;
        }
    }

    // return the category with the highest count, string type
    return maxCategory;
};

export default {
    addAdCategory,
    getTopCategories
}; 