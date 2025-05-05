import express from "express";
import { chartData } from "../data/index.js";
import * as check from "../utils/helpers.js";

const router = express.Router();

// Get event counts by day
router.route("/daily").get(async (req, res) => {
  try {
    let { startDate, endDate } = req.query;
    
    if (startDate) {
      try {
        startDate = check.checkStringAllowNull(startDate, "Start Date");
        if (startDate) {
          const dateObj = new Date(startDate);
          if (isNaN(dateObj.getTime())) {
            return res.status(400).json({
              code: 400,
              message: "Invalid start date format. Use YYYY-MM-DD format."
            });
          }
        }
      } catch (e) {
        return res.status(400).json({
          code: 400,
          message: `Invalid start date: ${e.message}`
        });
      }
    }
    
    if (endDate) {
      try {
        endDate = check.checkStringAllowNull(endDate, "End Date");
        if (endDate) {
          const dateObj = new Date(endDate);
          if (isNaN(dateObj.getTime())) {
            return res.status(400).json({
              code: 400,
              message: "Invalid end date format. Use YYYY-MM-DD format."
            });
          }
        }
      } catch (e) {
        return res.status(400).json({
          code: 400,
          message: `Invalid end date: ${e.message}`
        });
      }
    }
    
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      if (startDateObj > endDateObj) {
        return res.status(400).json({
          code: 400,
          message: "Start date cannot be after end date"
        });
      }
    }
    
    const dailyCounts = await chartData.getEventsCountByDay(startDate, endDate);
    
    return res.status(200).json({
      code: 200,
      message: "success",
      data: dailyCounts
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message || "Error retrieving event statistics"
    });
  }
});

// Get detailed event statistics by day and category
router.route("/stats").get(async (req, res) => {
  try {
    let { startDate, endDate } = req.query;
    
    if (startDate) {
      try {
        startDate = check.checkStringAllowNull(startDate, "Start Date");
        if (startDate) {
          const dateObj = new Date(startDate);
          if (isNaN(dateObj.getTime())) {
            return res.status(400).json({
              code: 400,
              message: "Invalid start date format. Use YYYY-MM-DD format."
            });
          }
        }
      } catch (e) {
        return res.status(400).json({
          code: 400,
          message: `Invalid start date: ${e.message}`
        });
      }
    }
    
    if (endDate) {
      try {
        endDate = check.checkStringAllowNull(endDate, "End Date");
        if (endDate) {
          const dateObj = new Date(endDate);
          if (isNaN(dateObj.getTime())) {
            return res.status(400).json({
              code: 400,
              message: "Invalid end date format. Use YYYY-MM-DD format."
            });
          }
        }
      } catch (e) {
        return res.status(400).json({
          code: 400,
          message: `Invalid end date: ${e.message}`
        });
      }
    }
    
    if (startDate && endDate) {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      if (startDateObj > endDateObj) {
        return res.status(400).json({
          code: 400,
          message: "Start date cannot be after end date"
        });
      }
    }
    
    const stats = await chartData.getEventStatsByDay(startDate, endDate);
    
    return res.status(200).json({
      code: 200,
      message: "success",
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: error.message || "Error retrieving event statistics"
    });
  }
});

export default router;