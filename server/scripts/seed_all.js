import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { users, events } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import usersData from "../data/users.js";
import eventsData from "../data/events.js";

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    console.log("Starting to create seed data...");

    // Helper functions
    const generateRandomDate = () => {
        const start = new Date("2025-03-15T00:00:00Z");
        const end = new Date("2025-05-11T23:59:59Z");
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };
    const generateCreatedDate = () => {
        const now = new Date();
        const daysAgo = Math.floor(Math.random() * 30);
        const d = new Date(now);
        d.setDate(now.getDate() - daysAgo);
        return d;
    };
    const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // Category definitions: titles & contents
    const categoryData = {
        "gun shot": {
            titles: [
                "Gun shot incident at",
                "Police report gunfire in the area",
                "Witnesses report hearing gunshots",
                "Emergency: Suspected shooting",
                "Police secure area after shooting",
                "Multiple witnesses report gunfire nearby"
            ],
            contents: [
                "Multiple witnesses report hearing several gunshots, police have cordoned off the area for investigation. No casualties reported at this time.",
                "Police received multiple calls reporting gunfire in the area. Officers have arrived at the scene to maintain order and investigate the cause.",
                "Local residents report hearing consecutive gunshots, followed by multiple police cars arriving at the scene. Police advise residents to avoid the area temporarily.",
                "Multiple pedestrians report hearing consecutive gunshots, police have quickly secured the scene and evacuated people. No injuries confirmed yet.",
                "Police are investigating a possible shooting incident, the area has been cordoned off, please stay away from this location until further notice.",
                "Surrounding residents report hearing multiple gunshots, police and ambulances have arrived at the scene. Police urge nearby residents to remain vigilant and report any suspicious activity immediately."
            ]
        },
        "fight": {
            titles: [
                "Street fight incident at",
                "Group conflict erupts nearby",
                "Physical altercation between groups",
                "Violent conflict outside bar",
                "Multi-person street brawl",
                "Police intervene in public fight"
            ],
            contents: [
                "Witnesses report approximately 5-6 adult males getting into an argument that escalated into a physical fight, police quickly intervened.",
                "A heated argument escalated into a physical conflict involving several young adults. Security personnel have intervened to separate the parties.",
                "Two groups of people began pushing and fighting after an argument in a public place, police quickly arrived after bystanders called for help.",
                "A dispute outside a bar escalated into a violent conflict involving about 10 people, with at least two suffering minor injuries. Police have taken several suspects for questioning.",
                "Multiple young people involved in a street brawl, some using improvised weapons. Police arrived and arrested 3 individuals, others fled the scene.",
                "Law enforcement officers were called to stop a public fight, several participants sustained minor injuries but refused medical treatment."
            ]
        },
        "stealing": {
            titles: [
                "Shop theft at",
                "Pedestrian reports backpack stolen",
                "Phone snatching incident at",
                "Sudden robbery alert",
                "Convenience store theft case",
                "Tourist items stolen incident"
            ],
            contents: [
                "A man was caught on store cameras taking merchandise and quickly fleeing the scene. The store owner has provided surveillance footage to police.",
                "A tourist reports their backpack was snatched on a crowded street. Police advise tourists to keep valuables secure.",
                "Victim reports a man on a motorcycle grabbed their phone while passing by and quickly fled the scene. Police are investigating.",
                "A man stole a woman's wallet in broad daylight before running away, police are tracking the suspect through surveillance footage. Residents are advised to remain vigilant.",
                "A convenience store reports a man wearing a hat and mask stole cash and goods, the clerk provided a detailed description to assist police investigation.",
                "Multiple tourists report pickpocketing at a tourist attraction, police have increased patrols and remind visitors to guard their valuables."
            ]
        },
        "assaulting": {
            titles: [
                "Pedestrian assault incident at",
                "Woman reports harassment by stranger",
                "Intoxicated person attacking pedestrians",
                "Midnight assault incident",
                "Harassment case in subway station",
                "Unprovoked attack in park"
            ],
            contents: [
                "A pedestrian reports being attacked by a group of teenagers without provocation, police are looking for witnesses and surveillance footage.",
                "A woman reports being followed and verbally harassed by an unknown man in the area, security personnel have intervened to help.",
                "A suspected intoxicated man attacked multiple pedestrians in a public area, he has been detained by police and removed from the scene.",
                "Late at night, a pedestrian was attacked and robbed by two strangers, the victim sustained minor injuries, police are searching for suspects.",
                "A female passenger was verbally and physically harassed by a stranger in the subway station, transit security responded quickly and detained the suspect.",
                "Reports indicate a man randomly attacked joggers in the park, several people were frightened, park management has increased patrols."
            ]
        },
        "traffic jam": {
            titles: [
                "Severe traffic congestion",
                "Traffic jam situation",
                "Rush hour traffic congestion",
                "Heavy congestion at bridge entrance",
                "Traffic blockage at tunnel exit",
                "Severe congestion in downtown area"
            ],
            contents: [
                "Due to high traffic volume, this area is severely congested, estimated to take 30-45 minutes to return to normal. Drivers advised to consider alternative routes.",
                "Traffic congestion has occurred due to temporary road construction, traffic department is directing vehicles.",
                "Rush hour traffic congestion has worsened, some sections almost at a standstill, please plan ahead or consider public transportation.",
                "Bridge entrance is severely congested due to excessive vehicles, traffic police are on site directing traffic, estimated at least an hour to return to normal.",
                "A minor accident at the tunnel exit has caused traffic blockage, emergency vehicles have arrived at the scene, please be patient.",
                "Downtown main roads are temporarily closed due to a parade, surrounding roads are severely congested, completely avoiding the area is recommended."
            ]
        },
        "road closed": {
            titles: [
                "Temporary road closure",
                "Road closed due to construction",
                "Road closure for pipe repairs",
                "Main street closure notice",
                "Road closed due to accident",
                "Temporary road closure for public event"
            ],
            contents: [
                "This section of road has been temporarily closed for emergency repairs, expected to continue until tonight. Please use alternate routes.",
                "Due to road construction, this section will be closed for 3 days. The transportation department has set up temporary detour signs, please follow directions.",
                "Road is temporarily closed for underground pipe repairs. Expected work period is two days, please avoid this area or choose alternative routes.",
                "City government announces the main street will be temporarily closed for asphalt resurfacing, closure time is all weekend, please plan routes in advance.",
                "A serious traffic accident involving multiple vehicles has completely closed the road, police and paramedics are on scene, expected to last several hours.",
                "For the annual marathon, multiple main roads will be temporary closed Sunday from 6am to 2pm, please check the official website for detailed detour information."
            ]
        },
        "accident": {
            titles: [
                "Multi-vehicle collision",
                "Traffic accident causing congestion",
                "Minor car accident scene",
                "Chain reaction crash with injuries",
                "Pedestrian-vehicle collision",
                "Bus accident scene"
            ],
            contents: [
                "Three cars collided at an intersection, ambulances and police cars have arrived. No serious injuries reported, but road temporarily blocked.",
                "Two cars collided causing a minor accident, drivers are exchanging information. Traffic can still pass but at reduced speed.",
                "A car and bicycle were involved in a minor collision, fortunately no one was injured. Police have arrived to assist.",
                "A chain reaction crash occurred on the highway involving 5 vehicles, injuries confirmed. Paramedics are treating the injured, road temporarily closed.",
                "A pedestrian was hit by a vehicle while crossing the road, extent of injuries unknown, ambulance has taken the injured to hospital, police investigating cause.",
                "A bus collided with a private car, multiple passengers sustained minor injuries, transportation department investigating, traffic restricted in this section."
            ]
        },
        "performance": {
            titles: [
                "Street music performance",
                "Amazing street art show",
                "Stunning street dance performance",
                "Impromptu theater performance",
                "Street opera performance",
                "Street acrobat performance"
            ],
            contents: [
                "A group of talented musicians are performing an impromptu concert on the street, attracting many pedestrians to stop and enjoy.",
                "Street artists are showcasing amazing paintings and crafts, creating a vibrant atmosphere.",
                "A professional dance troupe is performing an excellent show on the street, attracting a large audience. Performance expected to continue until 5pm.",
                "A group of young actors are holding an impromptu theatrical performance in the square, addressing social issues in a humorous way, audience response enthusiastic.",
                "An opera singer is performing classic opera excerpts on the street corner, their wonderful voice making passersby stop in amazement to listen.",
                "Artists from an international circus are performing amazing acrobatics in the square, including aerial stunts and fire dancing, attracting hundreds of spectators."
            ]
        },
        "food truck": {
            titles: [
                "Food truck festival event",
                "Specialty food truck on site",
                "New food truck opening",
                "International flavor food trucks gathering",
                "Organic food truck market",
                "Late night food truck service"
            ],
            contents: [
                "Multiple specialty food trucks gathered here, offering various delicious foods. Event will continue until 9pm tonight.",
                "A food truck offering authentic Mexican cuisine is parked here today, attracting many customers lining up to taste.",
                "A new Asian-flavored food truck starts operating today, offering authentic Japanese ramen and dumplings at affordable prices.",
                "Food trucks from around the world have gathered here, offering everything from Italian pizza to Thai street food, a one-stop world culinary tour.",
                "The weekend organic food market has added several food trucks providing meals made with local organic ingredients, supporting sustainable development.",
                "A late-night food truck now serving night owls, offering options from snacks to full meals, operating until 3am."
            ]
        },
        "parade": {
            titles: [
                "Festival parade event",
                "Celebration parade about to begin",
                "Special themed parade",
                "Cultural diversity parade",
                "Historical commemoration parade",
                "Float costume parade"
            ],
            contents: [
                "A festival celebration parade will be held in this area, expected to last two hours. Temporary traffic control has been set up along the parade route.",
                "The annual celebration parade will begin at 3pm today, featuring floats, bands and street dance performances.",
                "An environmentally themed parade is taking place, attracting many citizens concerned about environmental issues.",
                "A multicultural celebration parade is underway, with groups from different cultural backgrounds showcasing their traditional costumes, music and dance, displaying the city's diversity.",
                "A parade commemorating an important historical event will be held tomorrow, participants will wear historical costumes to recreate key historical moments.",
                "The annual float parade is about to begin, this year's theme is 'Future City', many creative floats are ready to go."
            ]
        }
    };

    // Comment templates pool
    const commentTemplates = [
        "Thank you for sharing this important information, I just passed by there and didn't notice.",
        "I also witnessed this situation, it's exactly as you described.",
        "Authorities should pay more attention to these issues, hope it gets resolved soon.",
        "I live nearby, and these incidents seem to be getting more frequent lately.",
        "Does anyone know how long this situation will last?",
        "Thanks for the heads up, I was just about to go to that area.",
        "I just passed through there, the situation seems to have improved.",
        "Is there anything we as a community can do to help resolve this issue?",
        "This isn't the first time this has happened in this area.",
        "I think this is the result of poor local management, we need better urban planning.",
        "I hope no one was injured in this incident.",
        "Is there any official statement about this incident?",
        "I have reported this situation to the relevant authorities.",
        "More people need to pay attention to this issue!",
        "This has a significant impact on the daily lives of local residents.",
        "We should organize community discussions to address these recurring issues.",
        "Thanks for sharing real-time information, this app is really useful.",
        "I'm nearby, and the situation is indeed as described.",
        "These incidents are too common in this area, we need to take action.",
        "Who should we contact about this situation? Does anyone know?"
    ];

    // Create users
    console.log("Creating user data...");
    const userIds = [];
    const userNames = ["william", "jack", "tom", "selin"];
    const names = ["William", "Jack", "Tom", "Selin"];
    const sexes = ["Male", "Male", "Male", "Female"];
    const emails = ["william@gmail.com", "jack@gmail.com", "tom@gmail.com", "selin@gmail.com"];
    const phones = ["9171234567", "9182345678", "9193456789", "9204567890"];
    const avatars = [
        "https://urban-eye.oss-us-east-1.aliyuncs.com/users-pic/Radeomonia..JPG",
        "https://urban-eye.oss-us-east-1.aliyuncs.com/users-pic/sun.JPG",
        "https://urban-eye.oss-us-east-1.aliyuncs.com/users-pic/Kyle.JPG",
        "https://urban-eye.oss-us-east-1.aliyuncs.com/users-pic/Jo..JPG"
    ];
    for (let i = 0; i < userNames.length; i++) {
        try {
            const newUser = await usersData.createUser(
                userNames[i],
                names[i],
                "cs123456",
                `I'm ${names[i]}, a regular user of UrbanEye interested in community safety.`,
                sexes[i],
                emails[i],
                phones[i]
            );
            await usersData.updateAvatar(newUser._id, avatars[i]);
            // assign adCategory
            const cats = Object.keys(categoryData);
            const adCategory = {};
            const fav = getRandomElement(cats);
            cats.forEach(c => {
                adCategory[c] = c === fav ? getRandomInt(30, 50) : getRandomInt(5, 25);
            });
            await (await users()).updateOne(
                { _id: new ObjectId(newUser._id) },
                { $set: { adCategory } }
            );
            userIds.push(newUser._id);
            console.log(`User ${newUser.userName} created`);
        } catch (e) {
            console.error(`Failed to create user ${userNames[i]}`, e);
        }
    }
    console.log("User creation complete");

    // 1) Generate 60 uniform Manhattan locations
    function generateUniformLocations(n) {
        const locs = [];
        const minLat = 40.70, maxLat = 40.88;
        const minLng = -74.02, maxLng = -73.92;
        for (let i = 0; i < n; i++) {
            const lat = (Math.random() * (maxLat - minLat) + minLat).toFixed(6);
            const lng = (Math.random() * (maxLng - minLng) + minLng).toFixed(6);
            locs.push({ latitude: lat, longitude: lng, address: `${lat},${lng}` });
        }
        return locs;
    }
    const locations = generateUniformLocations(60);

    // 2) Prepare 4 fixed comments per category
    const categoriesList = Object.keys(categoryData);
    const commentTemplatesMap = {};
    categoriesList.forEach((cat, idx) => {
        const base = (idx * 4) % commentTemplates.length;
        commentTemplatesMap[cat] = [];
        for (let j = 0; j < 4; j++) {
            commentTemplatesMap[cat].push(
                commentTemplates[(base + j) % commentTemplates.length]
            );
        }
    });

    // 3) Create 60 events: 6 per category, user round-robin
    console.log("Creating event data...");
    const allEvents = [];
    let locIndex = 0;
    for (const category of categoriesList) {
        const { titles, contents } = categoryData[category];
        for (let i = 0; i < titles.length; i++) {
            const userId = userIds[allEvents.length % userIds.length];
            const location = locations[locIndex++];
            let title = titles[i];
            if (/\b(at|in|near)\b/.test(title)) {
                title = `${title} ${location.address.split(',')[0]}`;
            }
            const content = contents[i];
            // 使用固定图片 URL
            const photoUrl = "https://urban-eye.oss-us-east-1.aliyuncs.com/events-pic/23be41e3-7246-4ca5-b837-a801cae0f4f0-IMG_7863.JPG";
            const newEvent = await eventsData.createEvent(
                userId, title, content, location, category, photoUrl
            );
            await (await events()).updateOne(
                { _id: new ObjectId(newEvent._id) }, {
                $set: {
                    created_at: generateCreatedDate(),
                    click_time: getRandomInt(1, 500),
                    likes: [],
                    comments: [],
                    reports: [],
                    blocked: false
                }
            }
            );
            allEvents.push(newEvent);
            console.log(`Event "${title}" created`);
        }
    }
    console.log(`Total events created: ${allEvents.length}`);

    // 4) Add likes, comments (fixed 4), reports
    console.log("Creating likes, comments and reports data...");
    const eventsCollection = await events();
    for (const event of allEvents) {
        // likes
        const likesCount = getRandomInt(1, 4);
        const shuffled = [...userIds].sort(() => 0.5 - Math.random());
        const likes = shuffled.slice(0, likesCount).map(uid => ({
            _id: new ObjectId(), user_id: new ObjectId(uid), liked_at: generateRandomDate()
        }));
        // comments
        const comments = commentTemplatesMap[event.category].map(text => ({
            _id: new ObjectId(),
            user_id: new ObjectId(getRandomElement(userIds)),
            content: text,
            created_at: generateRandomDate()
        }));
        // reports
        const reports = [];
        if (Math.random() < 0.2) {
            reports.push({
                _id: new ObjectId(),
                user_id: new ObjectId(getRandomElement(userIds)),
                reported_at: new Date("2025-05-10T16:30:08.355Z")
            });
        }
        // update
        await eventsCollection.updateOne(
            { _id: new ObjectId(event._id) },
            { $set: { likes, comments, reports } }
        );
        console.log(`Event "${event.title}": ${likes.length} likes, ${comments.length} comments`);
    }

    console.log("All data creation complete!");
    await closeConnection();
}

main().catch(err => {
    console.error(err);
    closeConnection();
});