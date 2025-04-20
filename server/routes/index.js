import eventsRoutes from "./events.js";
import usersRoutes from "./users.js";
import commentsRoutes from "./comments.js";
import likesRoutes from "./likes.js";
import {
  requireLogin,
  requireNotLogin,
  redirectLogin,
  attachUser,
} from "../middleware/auth.js";

// const constructorMethod = app => {
// 	app.use("/events", eventsRoutes);
// 	app.use("/users", usersRoutes);
// 	app.use("/comments", commentsRoutes);
// 	app.use("/likes", likesRoutes);

// 	app.use("*", (req, res) => {
// 		return res.status(404).json({ error: "Route Not found" });
// 	});
// };

const constructorMethod = (app) => {
  // API路由
  app.use("/api/events", eventsRoutes);
  app.use("/api/users", usersRoutes);
  app.use("/api/comments", commentsRoutes);
  app.use("/api/likes", likesRoutes);

  // 页面路由
  app.get("/", attachUser, (req, res) => {
    res.render("home", {
      title: "Home",
      isHome: true,
      centeredContent: true,
      user: req.user,
    });
  });

  app.get("/event", attachUser, (req, res) => {
    res.render("event", {
      title: "Events",
      isEvent: true,
      user: req.user,
    });
  });

  app.get("/about", attachUser, (req, res) => {
    res.render("about", {
      title: "About",
      isAbout: true,
      centeredContent: true,
      user: req.user,
    });
  });

  app.get("/login", (req, res) => {
    res.render("login", {
      title: "Login",
      isLogin: true,
      centeredContent: true,
    });
  });

  app.get("/signup", (req, res) => {
    res.render("signup", {
      title: "Sign Up",
      isLogin: true,
      centeredContent: true,
    });
  });

  app.get("/profile", redirectLogin, attachUser, (req, res) => {
    res.render("profile", {
      title: "Profile",
      user: req.user,
    });
  });

  app.use("*", (req, res) => {
    return res.status(404).render("error", {
      title: "Not Found",
      error: "Page Not Found",
      centeredContent: true,
    });
  });
};

export default constructorMethod;
