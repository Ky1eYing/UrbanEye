import { events } from "../config/mongoCollections.js";
import * as check from "../utils/helpers.js";

// startDate (default: 30 days ago) and endDate (default: current date) are optional
const getEventStatsByDay = async (startDate, endDate) => {
  if (startDate) {
    try {
      startDate = check.checkStringAllowNull(startDate, "Start Date");
      if (startDate) {
        startDate = new Date(startDate);
        if (isNaN(startDate.getTime())) {
          throw new Error("Invalid start date format");
        }
      } else {
        const defaultStartDate = new Date();
        defaultStartDate.setDate(defaultStartDate.getDate() - 30);
        startDate = defaultStartDate;
      }
    } catch (e) {
      throw new Error(`Start date error: ${e.message}`);
    }
  } else {
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    startDate = defaultStartDate;
  }

  if (endDate) {
    try {
      endDate = check.checkStringAllowNull(endDate, "End Date");
      if (endDate) {
        endDate = new Date(endDate);
        if (isNaN(endDate.getTime())) {
          throw new Error("Invalid end date format");
        }
      } else {
        endDate = new Date();
      }
    } catch (e) {
      throw new Error(`End date error: ${e.message}`);
    }
  } else {
    endDate = new Date();
  }

  if (startDate > endDate) {
    throw new Error("Start date cannot be after end date");
  }

  const eventsCollection = await events();
  
  const pipeline = [
    // {
    //   $match: {
    //     created_at: { 
    //       $gte: startDate, 
    //       $lte: endDate 
    //     }
    //   }
    // },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          category: "$category"
        },
        count: { $sum: 1 },
        // titles: { $push: "$title" }
      }
    },
    {
      $sort: { "_id.date": 1 }
    }
  ];

  const result = await eventsCollection.aggregate(pipeline).toArray();
  
  const resultsByDate = {};
  
  result.forEach(item => {
    const date = item._id.date;
    const category = item._id.category;
    
    if (!resultsByDate[date]) {
      resultsByDate[date] = {
        date: date,
        total: 0,
        categories: {}
      };
    }
    
    resultsByDate[date].categories[category] = {
      count: item.count,
      titles: item.titles
    };
    
    resultsByDate[date].total += item.count;
  });
  
  return Object.values(resultsByDate).sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
};

// startDate (default: 30 days ago) and endDate (default: current date) are optional
const getEventsCountByDay = async (startDate, endDate) => {
  if (startDate) {
    try {
      startDate = check.checkStringAllowNull(startDate, "Start Date");
      if (startDate) {
        startDate = new Date(startDate);
        if (isNaN(startDate.getTime())) {
          throw new Error("Invalid start date format");
        }
      } else {
        const defaultStartDate = new Date();
        defaultStartDate.setDate(defaultStartDate.getDate() - 30);
        startDate = defaultStartDate;
      }
    } catch (e) {
      throw new Error(`Start date error: ${e.message}`);
    }
  } else {
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    startDate = defaultStartDate;
  }

  if (endDate) {
    try {
      endDate = check.checkStringAllowNull(endDate, "End Date");
      if (endDate) {
        endDate = new Date(endDate);
        if (isNaN(endDate.getTime())) {
          throw new Error("Invalid end date format");
        }
      } else {
        endDate = new Date();
      }
    } catch (e) {
      throw new Error(`End date error: ${e.message}`);
    }
  } else {
    endDate = new Date();
  }

  if (startDate > endDate) {
    throw new Error("Start date cannot be after end date");
  }

  const eventsCollection = await events();
  
  const pipeline = [
    {
      $match: {
        created_at: { 
          $gte: startDate, 
          $lte: endDate 
        }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ];

  const result = await eventsCollection.aggregate(pipeline).toArray();
  
  return result.map(item => ({
    date: item._id,
    count: item.count
  }));
};

export default {
  getEventStatsByDay,
  getEventsCountByDay
};