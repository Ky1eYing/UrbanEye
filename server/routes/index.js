import eventsRoutes from "./events.js";
import usersRoutes from "./users.js";
import likesRoutes from "./likes.js";

const constructorMethod = app => {
	app.use("/events", eventsRoutes);
	app.use("/users", usersRoutes);
	app.use("/likes", likesRoutes);

	app.use("*", (req, res) => {
		return res.status(404).json({ error: "Route Not found" });
	});
};

export default constructorMethod;
