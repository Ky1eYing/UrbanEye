# CS546-group17

## Folder Structure
```
UrbanEye/
├── server/                   
│   ├── app.js                 # Main application entry point
│   ├── package.json           # Project dependencies
│   ├── config/                # Database and application configuration
│   │   ├── mongoCollections.js      
│   │   ├── mongoConnection.js       
│   │   ├── settings.js  
│   │   └── env.js             # Environment variables
│   ├── middleware/            # Express middleware
│   │   ├── auth.js            # Authentication middleware
│   │   └── session.js         # Session management
│   ├── data/                  # Data manipulation functions
│   │   ├── index.js               
│   │   ├── events.js          # Event data functions      
│   │   ├── users.js           # User data functions
│   │   ├── comments.js        # Comment data functions
│   │   └── likes.js           # Like data functions
│   ├── public/                # Static client assets
│   │   ├── css/    
│   │   │   └── styles.css
│   │   ├── images/
│   │   │   ├── avatars/
│   │   │   ├── category-icons/
│   │   │   └── logo/
│   │   └── js/
│   │       ├── event-modal.js
│   │       ├── event_api.js
│   │       ├── event_detail.js
│   │       ├── event_list.js
│   │       ├── event_router.js
│   │       ├── helps.js
│   │       ├── login.js
│   │       ├── maps.js
│   │       ├── profile.js
│   │       └── signup.js
│   ├── routes/                # Express routes
│   │   ├── index.js           # Main router configuration              
│   │   ├── events.js          # Event routes      
│   │   ├── users.js           # User routes
│   │   ├── comments.js        # Comment routes
│   │   └── likes.js           # Like routes
│   ├── scripts/               # Database seed scripts
│   │   ├── seeds_comments.js
│   │   ├── seeds_events.js
│   │   ├── seeds_likes.js
│   │   └── seeds_users.js
│   ├── utils/                 # Utility functions
│   │   └── helpers.js         # Input validation, etc.
│   └── views/                 # Handlebars templates
│       ├── layouts/    
│       │   └── main.handlebars
│       ├── about.handlebars
│       ├── error.handlebars
│       ├── event.handlebars
│       ├── home.handlebars
│       ├── login.handlebars
│       ├── profile.handlebars
│       └── signup.handlebars
└── README.md