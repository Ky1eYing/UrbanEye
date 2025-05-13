# 🏙️ UrbanEye - Event Check & Report Platform

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![Express.js](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/) [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

*Empowering communities through real-time event reporting and discovery*

</div>

## 📋 Overview

UrbanEye is a web-based platform that empowers users to report and track events in their vicinity, helping communities stay informed about local happenings including safety incidents, traffic conditions, and street entertainment. The platform enables real-time reporting, browsing of local events, and community engagement through discussions.

---

## 🚀 Technology Stack

- **Frontend:** HTML, CSS, JavaScript, Handlebars templates
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **APIs:** Google Maps API, OpenAI API
- **Security:** bcrypt for password hashing, XSS protection
- **Real-time Features:** Browser geolocation, session management

---

## 📂 Project Structure
```
UrbanEye/
├── server/                # Backend application
│   ├── config/            # Database and configuration
│   ├── data/              # Data access layer
│   ├── middleware/        # Authentication and session
│   ├── routes/            # API endpoints
│   ├── scripts/           # Database seeding scripts
│   ├── utils/             # Helper functions and utilities
│   ├── views/             # Handlebars templates for server-side rendering
│   │   └── layouts/       # Page layout templates
│   └── public/            # Static assets
│       ├── css/           # Stylesheets
│       ├── js/            # Client-side JavaScript
│       └── images/        # Image assets
│   ├── app.js             # Express application entry point
└── README.md
```

---

## 🔧 Getting Started

1. Clone the repository
```bash
git clone https://github.com/sunxy488/UrbanEye.git
```

2. Navigate to the server directory
```bash
cd UrbanEye/server
```

3. Install dependencies
```bash
npm install
```

4. Seed the database
```bash
npm run seed
```

5. Start the server
```bash
npm start
```

6. Visit http://localhost:3000 in your browser

---

## ✨ Core Features

### 1. Landing Page
- Navigate to different sections of the platform from the central hub
- Explore key features of the platform

### 2. About Page
- Introduce our team members
- Showcase the project's mission and vision, Explain the motivation behind UrbanEye

### 3. Create Event
- Users can report events by uploading:
  - Title (maximum 50 characters)
  - Content (maximum 200 characters)
  - Photos (must be valid image format)
  - Location (requires latitude, longitude, and address. User can select their location on the map)
  - Category (must be one of the following):
    - Safety incidents: gun shot, fight, stealing, assaulting
    - Urban infrastructure: traffic jam, road closed, accident
    - Community events: performance, food truck, parade

### 4. Event Listing Page
- **Map View**:
  - Shows all events on an interactive Google Map
  - Displays distance from user's current location
  - Different markers based on event category
- **List View**:
  - Displays events with title, location, and time posted
  - Shows distance from user's current location
  - Includes thumbnail preview of event images
- **Filtering & Search**:
  - Filter by event category
  - Filter by distance (0.5km, 1km, 5km, 10km, 25km)
  - Filter by time range (last hour, today, this week, this month)
  - Search by keywords in title and description

### 5. Event Details Page
- Displays comprehensive event information:
  - Full title and content
  - High-resolution images of the event
  - Exact location on embedded Google Map
  - Event post time
  - Distance from current location
  - Event category and view times
- Recommendation options to nearby events
- Share button for social media and messaging platforms
- Report inappropriate content option

### 6. Like and Comment System
- **Comment system**:
  - Add comments (up to 100 characters)
  - View all comments with usernamem, comment and timestamp
  - Edit or delete your own comments
- **Like system**:
  - Like/unlike toggle for events
  - View total like count
  - Edit or delete your own likes

### 7. Events Recommendation
- Shows popular events near the currently viewed event
- Popularity based on view count and distance
- Displays 3 recommended events with preview images and event infomation

### 8. Trends Page
- Interactive chart showing number of events per day and statistics of all event types
- Filter chart by event category

### 9. User Profile
- **Authentication**:
  - User registration with:
    - Username (maximum 20 characters, alphanumeric only)
    - Password (4-30 characters, letters, numbers, and symbols)
  - User can login with username and password
- **Profile Management**:
  - Name (maximum 40 characters, default)
  - Introduction (optional, maximum 200 characters)
  - Gender selection (optional, from predefined list)
  - Email (optional, must be valid format)
  - Phone (optional, 7-15 digits with optional '+' prefix)
  - **Password Change**:
    - Requires current password verification
    - New password must be 4-30 characters with letters, numbers, and symbols
    - User is automatically logged out after password change
    - Clicking cancel will revert to previously saved information
- **User Content**:
  - List of all events, commments and likes reported by the user
  - Option to edit or delete user's own events, commments and likes
- **Access Levels**:
  - Non-registered users can only view events
  - Registered users can create, like, and comment on events
  - Edit/delete permissions limited to own content

---

## 🌟 Extra Features

### 1. Report & Block System
- Users can report events they believe are inappropriate or inaccurate
- Automatic blocking logic:
  - Events are automatically blocked if **reports ≥ 5**
  - **AND** reports > (click count / 10)
  - **AND** reports > like count
- Blocked events are hidden from general view but remain in the database

### 2. Personalized Event Recommendations
- Shows three events that align with users' interests on the event list
- Recommendation engine analyzes based on past click history and viewing patterns
- Recommended events are continuously displayed if user does not perform search or filter by category
- Non-logged in users do not see personalized recommendations
- Login is required to access the personalized recommendation feature

### 3. AI Assistant
- Intelligent chatbot providing event insights and assistance:
  - **Event Summarization**: Condense event details into concise summaries
  - **Specific Event Queries**: Answer questions about particular events
  - **Trend Analysis**: Analyze historical event data to identify patterns
  - **Predictive Analytics**: Forecast future event frequencies based on historical data
- Natural language processing for intuitive interactions
- Contextual understanding of user queries

---

## 🔌 API Endpoints

### Events API
- `GET /api/events` - Get all events
- `POST /api/events` - Create a new event
- `GET /api/events/:eventId` - Get event by ID
- `PUT /api/events/:eventId` - Update event
- `DELETE /api/events/:eventId` - Delete event
- `GET /api/events/filter` - Get filtered events
- `GET /api/events/user/:userId` - Get events by user

### Users API
- `POST /api/users` - Register new user
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile
- `DELETE /api/users/:userId` - Delete user account
- `PUT /api/users/introduction/:userId` - Update user introduction
- `PUT /api/users/avatar/:userId` - Update user avatar
- `GET /api/users/:userId/top-category` - Get user's top event category

### Comments API
- `GET /api/comments/event/:eventId` - Get comments for event
- `POST /api/comments/event/:eventId` - Add comment to event
- `GET /api/comments/user/:userId` - Get user's comments
- `PUT /api/comments/:commentId` - Update comment
- `DELETE /api/comments/:commentId` - Delete comment

### Likes API
- `POST /api/likes` - Like an event
- `DELETE /api/likes/:userId/:eventId` - Unlike an event
- `GET /api/likes/user/:userId` - Get user's liked events

### Reports API
- `POST /api/reports` - Report an event

### Charts API
- `GET /api/chart/daily` - Get daily event counts
- `GET /api/chart/stats` - Get detailed event statistics

### AI Agent API
- `GET /api/agent/events` - Get events data for AI
- `POST /api/agent/chat` - Chat with AI assistant

---

## 👥 Contributors

This project was developed by:

- Xiaoyu Sun
- Junhe Jiao
- Kaiyuan Ying
- Ruikang Li
    
## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
