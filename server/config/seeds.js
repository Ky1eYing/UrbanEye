// seed.js
import { dbConnection, closeConnection } from "./mongoConnection.js";
import eventsData from "../data/events.js";
import { ObjectId } from "mongodb";

const db = await dbConnection();
await db.dropDatabase();

const eventsToCreate = [
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Gun shot reported near Central Park.",
    created_at: new Date("2025-03-21T12:00:00Z"),
    location: "New York",
    category: "crime",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T13:00:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "lao tie 666!",
        created_at: new Date("2025-03-21T13:05:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Minor traffic accident on 5th Avenue.",
    created_at: new Date("2025-03-21T12:05:00Z"),
    location: "New York",
    category: "traffic",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T13:05:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Stay safe!",
        created_at: new Date("2025-03-21T13:10:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Concert event at Madison Square Garden.",
    created_at: new Date("2025-03-21T12:10:00Z"),
    location: "New York",
    category: "entertainment",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T13:10:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Awesome event!",
        created_at: new Date("2025-03-21T13:15:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Robbery reported in Times Square.",
    created_at: new Date("2025-03-21T12:15:00Z"),
    location: "New York",
    category: "crime",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T13:15:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Unbelievable!",
        created_at: new Date("2025-03-21T13:20:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Heavy traffic due to road construction in Brooklyn.",
    created_at: new Date("2025-03-21T12:20:00Z"),
    location: "New York",
    category: "traffic",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T13:20:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Hope it clears up soon.",
        created_at: new Date("2025-03-21T13:25:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Street performance event in SoHo.",
    created_at: new Date("2025-03-21T12:25:00Z"),
    location: "New York",
    category: "entertainment",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T13:25:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Love street art!",
        created_at: new Date("2025-03-21T13:30:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Mugging incident on Wall Street.",
    created_at: new Date("2025-03-21T12:30:00Z"),
    location: "New York",
    category: "crime",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T13:30:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "That's scary!",
        created_at: new Date("2025-03-21T13:35:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Traffic jam near the Brooklyn Bridge.",
    created_at: new Date("2025-03-21T12:35:00Z"),
    location: "New York",
    category: "traffic",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T13:35:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "So frustrating!",
        created_at: new Date("2025-03-21T13:40:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Movie premiere event at AMC theaters.",
    created_at: new Date("2025-03-21T12:40:00Z"),
    location: "New York",
    category: "entertainment",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T13:40:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Excited for the premiere!",
        created_at: new Date("2025-03-21T13:45:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Armed robbery in Chinatown.",
    created_at: new Date("2025-03-21T12:45:00Z"),
    location: "New York",
    category: "crime",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T13:45:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Stay vigilant!",
        created_at: new Date("2025-03-21T13:50:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Major traffic accident on the FDR Drive.",
    created_at: new Date("2025-03-21T12:50:00Z"),
    location: "New York",
    category: "traffic",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T13:50:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Traffic nightmare!",
        created_at: new Date("2025-03-21T13:55:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Live music event in Greenwich Village.",
    created_at: new Date("2025-03-21T12:55:00Z"),
    location: "New York",
    category: "entertainment",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T13:55:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Can't wait for the live music!",
        created_at: new Date("2025-03-21T14:00:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Shooting incident reported near Harlem.",
    created_at: new Date("2025-03-21T13:00:00Z"),
    location: "New York",
    category: "crime",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T14:00:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "So dangerous!",
        created_at: new Date("2025-03-21T14:05:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Bus accident on the Queens Boulevard.",
    created_at: new Date("2025-03-21T13:05:00Z"),
    location: "New York",
    category: "traffic",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T14:05:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Better use alternate routes.",
        created_at: new Date("2025-03-21T14:10:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Art exhibition event in Chelsea.",
    created_at: new Date("2025-03-21T13:10:00Z"),
    location: "New York",
    category: "entertainment",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T14:10:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Exciting art scene!",
        created_at: new Date("2025-03-21T14:15:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Car chase incident on the Manhattan Bridge.",
    created_at: new Date("2025-03-21T13:15:00Z"),
    location: "New York",
    category: "crime",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T14:15:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Police are on it.",
        created_at: new Date("2025-03-21T14:20:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Festival event in Central Park.",
    created_at: new Date("2025-03-21T13:20:00Z"),
    location: "New York",
    category: "entertainment",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T14:20:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Enjoy the festival!",
        created_at: new Date("2025-03-21T14:25:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Bike accident reported in Upper East Side.",
    created_at: new Date("2025-03-21T13:25:00Z"),
    location: "New York",
    category: "traffic",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T14:25:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Hope everyone is okay.",
        created_at: new Date("2025-03-21T14:30:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Stand-up comedy show in Brooklyn.",
    created_at: new Date("2025-03-21T13:30:00Z"),
    location: "New York",
    category: "entertainment",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T14:30:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "Sounds fun!",
        created_at: new Date("2025-03-21T14:35:00Z")
      }
    ]
  },
  {
    _id: new ObjectId(),
    user_id: new ObjectId(),
    content: "Break-in reported in Midtown.",
    created_at: new Date("2025-03-21T13:35:00Z"),
    location: "New York",
    category: "crime",
    likes: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        liked_at: new Date("2025-03-21T14:35:00Z")
      }
    ],
    comments: [
      {
        _id: new ObjectId(),
        user_id: new ObjectId(),
        content: "That's alarming!",
        created_at: new Date("2025-03-21T14:40:00Z")
      }
    ]
  }
];

for (const eventData of eventsToCreate) {
  try {
    const event = await eventsData.createEvent(
      eventData.user_id,
      eventData.content,
      eventData.created_at,
      eventData.location,
      eventData.category,
      eventData.likes,
      eventData.comments
    );
    console.log(`Created event: ${event.content}`);
  } catch (e) {
    console.error(`Error creating event "${eventData.content}": ${e}`);
  }
}

console.log("Done seeding events database");
await closeConnection();
