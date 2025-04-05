import express from "express";
import { eventsData } from "../data/index.js";
import * as check from "../utils/helpers.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router
	.route("/")
	// getAllEvents
	.get(async (req, res) => {
		try {
			const events = await eventsData.getAllEvents();
			return res.status(200).json(events);
		} catch (e) {
			return res.status(500).json({ error: e.message });
		}
	})
	// createEvent
	.post(async (req, res) => {
		const eventInfo = req.body;
		if (!eventInfo || Object.keys(eventInfo).length === 0) {
			return res.status(400).json({ error: "There are no fields in the request body" });
		}

		const { user_id, title, content, location, category } = eventInfo;
		if ([user_id, title, content, location, category].some(arg => arg === undefined)) {
			return res.status(400).json({ error: "All fields need to have valid values" });
		}

		let checked_user_id, checked_title, checked_content, checked_location, checked_category;
		try {
			checked_user_id = check.checkObjectId(user_id);
			checked_title = check.checkVaildString(title, "Title");
			checked_content = check.checkVaildString(content, "Content");
			checked_location = check.checkLocation(location);
			checked_category = check.checkCategory(category);
		} catch (e) {
			return res.status(400).json({ error: e.message });
		}

		try {
			const newEvent = await eventsData.createEvent(
				checked_user_id,
				checked_title,
				checked_content,
				checked_location,
				checked_category
			);
			return res.status(200).json(newEvent);
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
			return res.status(200).json(event);
		} catch (e) {
			return res.status(404).json({ error: e.message });
		}
	})
	// removeEvent
	.delete(async (req, res) => {
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
			const deleteInfo = await eventsData.removeEvent(checked_eventId);
			return res.status(200).json({ message: deleteInfo });
		} catch (e) {
			return res.status(404).json({ error: e.message });
		}
	})
	// updateEvent
	.put(async (req, res) => {
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
			return res.status(400).json({ error: "There are no fields in the request body" });
		}

		const { title, content, location, category } = eventInfo;
		if ([title, content, location, category].some(arg => arg === undefined)) {
			return res.status(400).json({ error: "All fields need to have valid values" });
		}

		let checked_title, checked_content, checked_location, checked_category;
		try {
			checked_title = check.checkVaildString(title, "Title");
			checked_content = check.checkVaildString(content, "Content");
			checked_location = check.checkLocation(location);
			checked_category = check.checkCategory(category);
		} catch (e) {
			return res.status(400).json({ error: e.message });
		}

		try {
			const updatedEvent = await eventsData.updateEvent(
				checked_eventId,
				checked_title,
				checked_content,
				checked_location,
				checked_category
			);
			return res.status(200).json(updatedEvent);
		} catch (e) {
			return res.status(404).json({ error: e.message });
		}
	});

// GET events by user id
router.route("/user/:userId").get(async (req, res) => {
	let checked_userId;
	try {
		checked_userId = check.checkVaildString(req.params.userId, "userId");
		if (!ObjectId.isValid(checked_userId)) {
			throw new Error("ID is not a valid ObjectId");
		}
	} catch (e) {
		return res.status(400).json({ error: e.message });
	}

	try {
		const userEvents = await eventsData.getEventByUserId(checked_userId);
		return res.status(200).json(userEvents);
	} catch (e) {
		return res.status(404).json({ error: e.message });
	}
});

export default router;
