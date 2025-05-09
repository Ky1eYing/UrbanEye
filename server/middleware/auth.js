import { usersData } from "../data/index.js";
import { ENABLE_AUTH_CHECK } from "../config/env.js";

const requireLogin = (req, res, next) => {
  if (!ENABLE_AUTH_CHECK) {
    return next();
  }

  if (!req.session?.userId) {
    return res
      .status(401)
      .json({ code: 401, message: "Unauthorized! Please log in first" });
  }

  next();
};

const requireNotLogin = (req, res, next) => {
  if (!ENABLE_AUTH_CHECK) {
    return next();
  }

  if (req.session && req.session.userId) {
    return res
      .status(401)
      .json({ code: 401, message: "Unauthorized! You are logged in" });
  }

  next();
};

const redirectLogin = (req, res, next) => {
  if (!ENABLE_AUTH_CHECK) {
    return next();
  }

  if (!req.session?.userId) {
    return res.redirect("/login");
  }

  next();
};

const ifLoggedRedirectHome = (req, res, next) => {
  if (!ENABLE_AUTH_CHECK) {
    return next();
  }

  if (req.session && req.session.userId) {
    return res.redirect("/profile");
  }

  next();
};

const ifNotLoggedRedirectHome = (req, res, next) => {
  if (!ENABLE_AUTH_CHECK) {
    return next();
  }

  if (!req.session?.userId) {
    return res.redirect("/");
  }

  next();
};

const attachUser = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await usersData.getUserByUserId(req.session.userId);
      if (user) {
        req.user = {
          _id: user._id,
          userName: user.userName,
          name: user.name,
          avatar: user.avatar,
        };
      }
    } catch (error) {
      console.error("Error attaching user:", error);
    }
  }

  next();
};

export {
  requireLogin,
  requireNotLogin,
  redirectLogin,
  ifLoggedRedirectHome,
  ifNotLoggedRedirectHome,
  attachUser,
};
