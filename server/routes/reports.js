import express from "express";
import { reportsData } from "../data/index.js";
import * as check from "../utils/helpers.js";
import { ObjectId } from "mongodb";
import {
  requireLogin,
  requireNotLogin,
  redirectLogin,
  attachUser,
} from "../middleware/auth.js";
import { ENABLE_AUTH_CHECK } from "../config/env.js";

const router = express.Router();

// Create a report
router.route("/").post(requireLogin, async (req, res) => {
  const reportInfo = req.body;
  if (!reportInfo || Object.keys(reportInfo).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }

  const { user_id, event_id } = reportInfo;
  if (!user_id || !event_id) {
    return res
      .status(400)
      .json({ error: "All fields need to have valid values" });
  }

  let checked_user_id, checked_event_id;
  try {
    checked_user_id = check.checkObjectId(user_id);
    checked_event_id = check.checkObjectId(event_id);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  if (ENABLE_AUTH_CHECK) {
    if (req.session.userId !== checked_user_id) {
      return res
        .status(403)
        .json({ error: "Forbidden! You are not authorized" });
    }
  }

  try {
    const newReport = await reportsData.createReport(
      checked_user_id,
      checked_event_id
    );
    return res.status(200).json({
      code: 200,
      message: "success",
      data: newReport,
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
});

export default router;
