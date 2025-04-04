import { ObjectId } from "mongodb";
import { events } from "../config/mongoCollections.js";

const allowedCategories = [
	"gun shot",
	"fight",
	"stealing",
	"assaulting",
	"traffic jam",
	"road closed",
	"accident",
	"performance",
	"food truck",
	"parade"
];

const createEvent = async (
	user_id,
	tilte,
	content,
	created_at,
	location,
	category,
	click_time = 0,
	likes = [],
	comments = []
) => {
	if (!user_id) throw new Error("Must provide user_id");
	if (!tilte) throw new Error("Must provide tilte");
	if (!content) throw new Error("Must provide content");
	if (!created_at) throw new Error("Must provide created_at");
	if (!location || !Array.isArray(location) || location.length === 0)
		throw new Error("Must provide location as a non-empty array");
	if (!category) throw new Error("Must provide category");
	if (!allowedCategories.includes(category)) throw new Error("Invalid category provided");

	const newEvent = {
		user_id: typeof user_id === "object" ? user_id : new ObjectId(user_id),
		tilte: tilte,
		content: content,
		created_at: new Date(created_at),
		location: location,
		category: category,
		click_time: click_time,
		likes: likes,
		comments: comments
	};

	const eventsCollection = await events();
	const insertInfo = await eventsCollection.insertOne(newEvent);
	if (!insertInfo.acknowledged || !insertInfo.insertedId) {
		throw new Error("Could not add event");
	}

	const newId = insertInfo.insertedId.toString();
	const event = await getEventById(newId);

	return event;
};

const getEventById = async eventId => {
	if (!ObjectId.isValid(eventId)) {
		throw new Error("ID is not a valid ObjectId");
	}

	const eventsCollection = await events();
	const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
	if (!event) {
		throw new Error("No event with that id");
	}
	event._id = event._id.toString();
	return event;
};

export default {
	createEvent,
	getEventById
};
