// seed.js
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { events } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const db = await dbConnection();
await db.dropDatabase();

const eventsToCreate = [
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "Gun Shot Incident",
		content: "Gun shot reported near Central Park.",
		created_at: new Date("2025-03-21T12:00:00Z"),
		location: [{ latitude: 40.785091, longitude: -73.968285, address: "Central Park, NY" }],
		category: "gun shot",
		click_time: 10,
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
				content: "Scary incident!",
				created_at: new Date("2025-03-21T13:05:00Z")
			}
		]
	},
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "Traffic Accident",
		content: "Minor traffic accident on 5th Avenue.",
		created_at: new Date("2025-03-21T12:05:00Z"),
		location: [{ latitude: 40.775, longitude: -73.965, address: "5th Avenue, NY" }],
		category: "accident",
		click_time: 5,
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
				content: "Drive carefully!",
				created_at: new Date("2025-03-21T13:10:00Z")
			}
		]
	},
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "Concert at MSG",
		content: "Concert event at Madison Square Garden.",
		created_at: new Date("2025-03-21T12:10:00Z"),
		location: [{ latitude: 40.7505045, longitude: -73.9934387, address: "Madison Square Garden, NY" }],
		category: "performance",
		click_time: 20,
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
				content: "Amazing performance!",
				created_at: new Date("2025-03-21T13:15:00Z")
			}
		]
	},
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "Robbery at Times Square",
		content: "Robbery reported in Times Square.",
		created_at: new Date("2025-03-21T12:15:00Z"),
		location: [{ latitude: 40.758, longitude: -73.9855, address: "Times Square, NY" }],
		category: "stealing",
		click_time: 8,
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
				content: "Stay alert!",
				created_at: new Date("2025-03-21T13:20:00Z")
			}
		]
	},
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "Brooklyn Road Construction",
		content: "Heavy traffic due to road construction in Brooklyn.",
		created_at: new Date("2025-03-21T12:20:00Z"),
		location: [{ latitude: 40.678178, longitude: -73.944158, address: "Brooklyn, NY" }],
		category: "traffic jam",
		click_time: 12,
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
				content: "Hope it clears soon.",
				created_at: new Date("2025-03-21T13:25:00Z")
			}
		]
	},
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "SoHo Street Performance",
		content: "Street performance event in SoHo.",
		created_at: new Date("2025-03-21T12:25:00Z"),
		location: [{ latitude: 40.723301, longitude: -74.002988, address: "SoHo, NY" }],
		category: "performance",
		click_time: 15,
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
				content: "Great street art!",
				created_at: new Date("2025-03-21T13:30:00Z")
			}
		]
	},
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "Mugging on Wall Street",
		content: "Mugging incident on Wall Street.",
		created_at: new Date("2025-03-21T12:30:00Z"),
		location: [{ latitude: 40.706877, longitude: -74.011265, address: "Wall Street, NY" }],
		category: "stealing",
		click_time: 7,
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
				content: "Unsettling news!",
				created_at: new Date("2025-03-21T13:35:00Z")
			}
		]
	},
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "Brooklyn Bridge Traffic Jam",
		content: "Traffic jam near the Brooklyn Bridge.",
		created_at: new Date("2025-03-21T12:35:00Z"),
		location: [{ latitude: 40.706086, longitude: -73.996864, address: "Brooklyn Bridge, NY" }],
		category: "traffic jam",
		click_time: 9,
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
				content: "Very frustrating!",
				created_at: new Date("2025-03-21T13:40:00Z")
			}
		]
	},
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "Movie Premiere at AMC",
		content: "Movie premiere event at AMC theaters.",
		created_at: new Date("2025-03-21T12:40:00Z"),
		location: [{ latitude: 40.758, longitude: -73.9855, address: "AMC Theaters, NY" }],
		category: "performance",
		click_time: 18,
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
				content: "Excited for the show!",
				created_at: new Date("2025-03-21T13:45:00Z")
			}
		]
	},
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "Armed Robbery in Chinatown",
		content: "Armed robbery in Chinatown.",
		created_at: new Date("2025-03-21T12:45:00Z"),
		location: [{ latitude: 40.715751, longitude: -73.997031, address: "Chinatown, NY" }],
		category: "stealing",
		click_time: 11,
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
				content: "Be careful!",
				created_at: new Date("2025-03-21T13:50:00Z")
			}
		]
	},
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "FDR Drive Accident",
		content: "Major traffic accident on the FDR Drive.",
		created_at: new Date("2025-03-21T12:50:00Z"),
		location: [{ latitude: 40.800277, longitude: -73.958111, address: "FDR Drive, NY" }],
		category: "accident",
		click_time: 14,
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
				content: "What a mess!",
				created_at: new Date("2025-03-21T13:55:00Z")
			}
		]
	},
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "Live Music in Greenwich Village",
		content: "Live music event in Greenwich Village.",
		created_at: new Date("2025-03-21T12:55:00Z"),
		location: [{ latitude: 40.733573, longitude: -74.002742, address: "Greenwich Village, NY" }],
		category: "performance",
		click_time: 16,
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
				content: "Can't wait!",
				created_at: new Date("2025-03-21T14:00:00Z")
			}
		]
	},
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "Harlem Shooting",
		content: "Shooting incident reported near Harlem.",
		created_at: new Date("2025-03-21T13:00:00Z"),
		location: [{ latitude: 40.81155, longitude: -73.946477, address: "Harlem, NY" }],
		category: "gun shot",
		click_time: 13,
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
		tilte: "Bus Accident on Queens Blvd",
		content: "Bus accident on the Queens Boulevard.",
		created_at: new Date("2025-03-21T13:05:00Z"),
		location: [{ latitude: 40.745968, longitude: -73.846017, address: "Queens Boulevard, NY" }],
		category: "accident",
		click_time: 6,
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
				content: "Use alternate routes.",
				created_at: new Date("2025-03-21T14:10:00Z")
			}
		]
	},
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "Chelsea Art Exhibition",
		content: "Art exhibition event in Chelsea.",
		created_at: new Date("2025-03-21T13:10:00Z"),
		location: [{ latitude: 40.7465, longitude: -74.001374, address: "Chelsea, NY" }],
		category: "performance",
		click_time: 17,
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
		tilte: "Manhattan Bridge Car Chase",
		content: "Car chase incident on the Manhattan Bridge.",
		created_at: new Date("2025-03-21T13:15:00Z"),
		location: [{ latitude: 40.699722, longitude: -73.9875, address: "Manhattan Bridge, NY" }],
		category: "fight",
		click_time: 10,
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
		tilte: "Central Park Festival",
		content: "Festival event in Central Park.",
		created_at: new Date("2025-03-21T13:20:00Z"),
		location: [{ latitude: 40.785091, longitude: -73.968285, address: "Central Park, NY" }],
		category: "parade",
		click_time: 22,
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
		tilte: "Upper East Side Bike Accident",
		content: "Bike accident reported in Upper East Side.",
		created_at: new Date("2025-03-21T13:25:00Z"),
		location: [{ latitude: 40.773565, longitude: -73.956555, address: "Upper East Side, NY" }],
		category: "accident",
		click_time: 4,
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
				content: "Hope everyone's okay.",
				created_at: new Date("2025-03-21T14:30:00Z")
			}
		]
	},
	{
		_id: new ObjectId(),
		user_id: new ObjectId(),
		tilte: "Brooklyn Comedy Show",
		content: "Stand-up comedy show in Brooklyn.",
		created_at: new Date("2025-03-21T13:30:00Z"),
		location: [{ latitude: 40.678178, longitude: -73.944158, address: "Brooklyn, NY" }],
		category: "performance",
		click_time: 12,
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
		tilte: "Midtown Break-in",
		content: "Break-in reported in Midtown.",
		created_at: new Date("2025-03-21T13:35:00Z"),
		location: [{ latitude: 40.754932, longitude: -73.984016, address: "Midtown, NY" }],
		category: "stealing",
		click_time: 6,
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

const eventsCollection = await events();
const insertResult = await eventsCollection.insertMany(eventsToCreate);
console.log(`Inserted ${insertResult.insertedCount} events`);

await closeConnection();
