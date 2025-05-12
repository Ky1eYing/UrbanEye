import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { users, events } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const db = await dbConnection();

// create 4 users
const usersToCreate = [
    {
        _id: new ObjectId("111111111111111111111111"),
        userName: "xiaoyusun",
        name: "Xiaoyu Sun",
        introduction: "Everyone has two lives; the second one truly begins the moment you realize you only have one.",
        sex: "Male",
        email: "sxy@gmail.com",
        phone: "5516333489",
        avatar: "https://urban-eye.oss-us-east-1.aliyuncs.com/users-pic/sun.JPG",
        password: "$2b$10$jrdM1fr1OJ7J.dIF1ozOdekiDnK9Y7M2woUQMWeOETzMQjs/sPs2e",
        adCategory: {
            "gun shot": 90,
            "fight": 7,
            "performance": 8,
            "parade": 6,
            "food truck": 11,
            "assaulting": 2
        }
    },
    {
        _id: new ObjectId("222222222222222222222222"),
        userName: "junhejiao",
        name: "Junhe Jiao",
        introduction: "Stop trying to control everything and just let go!",
        sex: "Female",
        email: "jjh@gmail.com",
        phone: "5516889489",
        avatar: "https://urban-eye.oss-us-east-1.aliyuncs.com/users-pic/Jo..JPG",
        password: "$2b$10$jrdM1fr1OJ7J.dIF1ozOdekiDnK9Y7M2woUQMWeOETzMQjs/sPs2e",
        adCategory: {
            "gun shot": 9,
            "fight": 70,
            "performance": 8,
            "parade": 6,
            "food truck": 11,
            "assaulting": 2
        }
    },
    {
        _id: new ObjectId("333333333333333333333333"),
        userName: "kaiyuanying",
        name: "Kaiyuan Ying",
        introduction: "Indeed, the world is a dream.",
        sex: "Male",
        email: "yky@gmail.com",
        phone: "5517779409",
        avatar: "https://urban-eye.oss-us-east-1.aliyuncs.com/users-pic/Kyle.JPG",
        password: "$2b$10$jrdM1fr1OJ7J.dIF1ozOdekiDnK9Y7M2woUQMWeOETzMQjs/sPs2e",
        adCategory: {
            "gun shot": 9,
            "fight": 7,
            "performance": 80,
            "parade": 6,
            "food truck": 11,
            "assaulting": 2
        }
    },
    {
        _id: new ObjectId("444444444444444444444444"),
        userName: "ruikangli",
        name: "Ruikang Li",
        introduction: "Life's fleeting journey abides in a dream within a dream; The world's affairs arrive as whispers on the wind.",
        sex: "Male",
        email: "lrk@gmail.com",
        phone: "5518889409",
        avatar: "https://urban-eye.oss-us-east-1.aliyuncs.com/users-pic/Radeomonia..JPG",
        password: "$2b$10$jrdM1fr1OJ7J.dIF1ozOdekiDnK9Y7M2woUQMWeOETzMQjs/sPs2e",
        adCategory: {
            "gun shot": 9,
            "fight": 7,
            "performance": 8,
            "parade": 60,
            "food truck": 11,
            "assaulting": 2
        }
    }
];

const usersCollection = await users();

try {
    await usersCollection.drop();
    await usersCollection.createIndex({ userName: 1 }, { unique: true });

    const insertResult = await usersCollection.insertMany(usersToCreate);
    console.log(`Successfully inserted ${insertResult.insertedCount} users`);
} catch (error) {
    if (error.code === 11000) {
        console.error('Error: Username already exists, please ensure username uniqueness');
    } else {
        console.error('Error inserting users:', error);
    }
}

// create events
const getRandomDate = () => {
    const randomDays = Math.floor(Math.random() * 60);
    return new Date(Date.now() - randomDays * 24 * 60 * 60 * 1000);
};

const eventsToCreate = [
    {
        _id: new ObjectId("666666666666666666666001"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Multi-vehicle collision",
        content: "Three cars collided at an intersection, ambulances and police cars have arrived. No serious injuries reported, but road temporarily blocked.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.783100",
            longitude: "-73.971200",
            address: "Central Park, New York, NY, USA"
        },
        category: "accident",
        click_time: 15,
        likes: [
            {
                _id: new ObjectId("777777777777777777777001"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777002"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888001"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888002"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888003"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888004"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666002"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Traffic accident causing congestion",
        content: "Two cars collided causing a minor accident, drivers are exchanging information. Traffic can still pass but at reduced speed.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.748817",
            longitude: "-73.985428",
            address: "350 5th Ave, New York, NY 10118, USA"
        },
        category: "accident",
        click_time: 133,
        likes: [
            {
                _id: new ObjectId("777777777777777777777003"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777004"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888005"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888006"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888007"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888008"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666003"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Minor car accident scene",
        content: "A car and bicycle were involved in a minor collision, fortunately no one was injured. Police have arrived to assist.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.730610",
            longitude: "-73.935242",
            address: "150 1st Ave, New York, NY 10009, USA"
        },
        category: "accident",
        click_time: 38,
        likes: [
            {
                _id: new ObjectId("777777777777777777777005"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777006"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888009"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888010"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888011"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888012"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666004"),
        user_id: new ObjectId("444444444444444444444444"),
        title: "Chain reaction crash with injuries",
        content: "A chain reaction crash occurred on the highway involving 5 vehicles, injuries confirmed. Paramedics are treating the injured, road temporarily closed.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.706192",
            longitude: "-74.009160",
            address: "Wall Street, New York, NY 10005, USA"
        },
        category: "accident",
        click_time: 164,
        likes: [
            {
                _id: new ObjectId("777777777777777777777007"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777008"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888013"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888014"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888015"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888016"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666005"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Six Died After Helicopter Crashes Into Hudson River",
        content: "Three adults and three children were on board the helicopter, which left from the downtown skyport, Mayor Eric Adams said in a press conference. The pilot and the family on board were visiting from Spain. All six victims have been pronounced dead.\n\nFour were pronounced dead at the scene, and two others were pronounced dead at the hospital. An executive from Spain, his wife and three children died in the crash, along with the helicopter's pilot, officials said.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.729507",
            longitude: "-74.013035",
            address: "40 5th Ave, New York, NY 10011, USA"
        },
        category: "accident",
        click_time: 236,
        likes: [
            {
                _id: new ObjectId("777777777777777777777009"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777010"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888017"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888018"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888019"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888020"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666006"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Taxi hits pedestrian near Times Square",
        content: "A taxi hit a pedestrian near Times Square. The victim is being treated for non-life-threatening injuries.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.758896",
            longitude: "-73.985130",
            address: "Times Square, New York, NY, USA"
        },
        category: "accident",
        click_time: 194,
        likes: [
            {
                _id: new ObjectId("777777777777777777777011"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777012"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888021"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888022"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888023"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888024"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666007"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Delivery truck overturns on FDR Drive",
        content: "A delivery truck overturned on the FDR Drive, causing major delays. Cleanup crews are working to clear the scene.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.710803",
            longitude: "-73.987365",
            address: "FDR Drive, New York, NY, USA"
        },
        category: "accident",
        click_time: 174,
        likes: [
            {
                _id: new ObjectId("777777777777777777777013"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777014"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888025"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888026"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888027"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888028"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666008"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Scooter accident near NYU",
        content: "A scooter rider collided with a car near NYU. Minor injuries reported, police are investigating.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.729513",
            longitude: "-73.996460",
            address: "NYU, New York, NY, USA"
        },
        category: "accident",
        click_time: 41,
        likes: [
            {
                _id: new ObjectId("777777777777777777777015"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777016"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888029"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888030"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888031"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888032"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666009"),
        user_id: new ObjectId("444444444444444444444444"),
        title: "Bus collision in Harlem",
        content: "A bus collided with a sedan in Harlem, resulting in two hospitalizations. Traffic is being rerouted.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.811550",
            longitude: "-73.946477",
            address: "Harlem, New York, NY, USA"
        },
        category: "accident",
        click_time: 131,
        likes: [
            {
                _id: new ObjectId("777777777777777777777017"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777018"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888033"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888034"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888035"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888036"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666010"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Motorcycle slips on wet road",
        content: "A motorcycle skidded on a wet road and crashed. Rider is stable, road briefly closed for cleanup.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.749641",
            longitude: "-73.987190",
            address: "7th Ave & 23rd St, New York, NY, USA"
        },
        category: "accident",
        click_time: 141,
        likes: [
            {
                _id: new ObjectId("777777777777777777777019"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777020"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888037"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888038"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888039"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888040"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666011"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Drunk driving incident near Chelsea",
        content: "A suspected drunk driver crashed into a parked car near Chelsea Market. No injuries reported.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.742054",
            longitude: "-74.004821",
            address: "Chelsea Market, New York, NY, USA"
        },
        category: "accident",
        click_time: 179,
        likes: [
            {
                _id: new ObjectId("777777777777777777777021"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777022"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888041"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888042"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888043"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888044"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666012"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Rear-end collision near Lincoln Tunnel",
        content: "Two vehicles involved in a rear-end collision near the Lincoln Tunnel entrance. Expect traffic delays.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.760586",
            longitude: "-74.002742",
            address: "Lincoln Tunnel Entrance, NY, USA"
        },
        category: "accident",
        click_time: 289,
        likes: [
            {
                _id: new ObjectId("777777777777777777777023"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777024"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888045"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888046"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888047"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888048"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666013"),
        user_id: new ObjectId("444444444444444444444444"),
        title: "Bridge closure after traffic incident",
        content: "A traffic incident caused the temporary closure of Williamsburg Bridge. DOT and NYPD on site.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.713054",
            longitude: "-73.971252",
            address: "Williamsburg Bridge, New York, NY, USA"
        },
        category: "accident",
        click_time: 256,
        likes: [
            {
                _id: new ObjectId("777777777777777777777025"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777026"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888049"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888050"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888051"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888052"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666014"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Car fire near Brooklyn Bridge",
        content: "A car caught fire near the Brooklyn Bridge exit. Firefighters responded quickly, no injuries reported.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.706086",
            longitude: "-73.996864",
            address: "Brooklyn Bridge Exit, NY, USA"
        },
        category: "accident",
        click_time: 252,
        likes: [
            {
                _id: new ObjectId("777777777777777777777027"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777028"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888053"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888054"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888055"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888056"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666015"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "E-bike accident at Central Park South",
        content: "An e-bike accident occurred at Central Park South. Rider sustained minor injuries, scene is cleared.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.765125",
            longitude: "-73.974187",
            address: "Central Park S, New York, NY, USA"
        },
        category: "accident",
        click_time: 106,
        likes: [
            {
                _id: new ObjectId("777777777777777777777029"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777030"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888057"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I live close to this intersection and have noticed a worrying increase in accidents here over the past month.",
                created_at: new Date("2025-05-11T13:05:00Z")
            },
            {
                _id: new ObjectId("888888888888888888888058"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Just yesterday I almost became a bystander to another crash—something needs to be done to improve safety on this stretch.",
                created_at: new Date("2025-05-12T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888059"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "These frequent collisions are alarming; better street lighting and clearer signage could really help prevent them.",
                created_at: new Date("2025-05-13T05:23:44.656Z")
            },
            {
                _id: new ObjectId("888888888888888888888060"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City officials should consider adding speed bumps or lowering the speed limit—too many of us are getting hurt lately",
                created_at: new Date("2025-05-11T05:23:44.656Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1627398924667-7f4ab354ab49"
    },
    {
        _id: new ObjectId("666666666666666666666016"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Police report gunfire in the area",
        content: "Police received multiple calls reporting gunfire in the area. Officers have arrived at the scene to maintain order and investigate the cause.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.761581",
            longitude: "-73.982238",
            address: "Columbus Circle, New York, NY, USA"
        },
        category: "gun shot",
        click_time: 184,
        likes: [
            {
                _id: new ObjectId("777777777777777777777031"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777032"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888061"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This is terrifying… I hope everyone nearby is safe.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888062"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Gunshots in our neighborhood? What is going on lately?",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888063"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I saw police tape near the scene just now, looks serious.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888064"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Thank you NYPD for acting quickly, stay safe everyone.",
                created_at: new Date("2025-05-07T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1595590426346-a9d0348d802f"
    },
    {
        _id: new ObjectId("666666666666666666666017"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Witnesses report hearing gunshots",
        content: "Local residents report hearing consecutive gunshots, followed by multiple police cars arriving at the scene. Police advise residents to avoid the area temporarily.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.719526",
            longitude: "-73.998672",
            address: "Chinatown, New York, NY, USA"
        },
        category: "gun shot",
        click_time: 158,
        likes: [
            {
                _id: new ObjectId("777777777777777777777033"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777034"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888065"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This is terrifying… I hope everyone nearby is safe.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888066"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Gunshots in our neighborhood? What is going on lately?",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888067"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I saw police tape near the scene just now, looks serious.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888068"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Thank you NYPD for acting quickly, stay safe everyone.",
                created_at: new Date("2025-05-12T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1595590426346-a9d0348d802f"
    },
    {
        _id: new ObjectId("666666666666666666666018"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Emergency: Suspected shooting",
        content: "Multiple pedestrians report hearing consecutive gunshots, police have quickly secured the scene and evacuated people. No injuries confirmed yet.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.807536",
            longitude: "-73.962573",
            address: "Columbia University, New York, NY, USA"
        },
        category: "gun shot",
        click_time: 120,
        likes: [
            {
                _id: new ObjectId("777777777777777777777035"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777036"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888069"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This is terrifying… I hope everyone nearby is safe.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888070"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Gunshots in our neighborhood? What is going on lately?",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888071"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I saw police tape near the scene just now, looks serious.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888072"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Thank you NYPD for acting quickly, stay safe everyone.",
                created_at: new Date("2025-05-07T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1595590426346-a9d0348d802f"
    },
    {
        _id: new ObjectId("666666666666666666666019"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Group conflict erupts nearby",
        content: "A heated argument escalated into a physical conflict involving several young adults. Security personnel have intervened to separate the parties.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.760280",
            longitude: "-73.984091",
            address: "8th Ave & W 47th St, New York, NY, USA"
        },
        category: "fight",
        click_time: 162,
        likes: [
            {
                _id: new ObjectId("777777777777777777777037"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777038"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888073"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This is scary... hope police have it under control.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888074"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Why do these fights keep happening? Getting worse!",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888075"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I heard shouting and then sirens. Glad no one got seriously hurt.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888076"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "We need more patrols in this neighborhood at night.",
                created_at: new Date("2025-05-09T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1602865597998-b39c7a370110"
    },
    {
        _id: new ObjectId("666666666666666666666020"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Physical altercation between groups",
        content: "Two groups of people began pushing and fighting after an argument in a public place, police quickly arrived after bystanders called for help.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.733616",
            longitude: "-73.989440",
            address: "Union Square, New York, NY, USA"
        },
        category: "fight",
        click_time: 97,
        likes: [
            {
                _id: new ObjectId("777777777777777777777039"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777040"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888077"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This is scary... hope police have it under control.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888078"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Why do these fights keep happening? Getting worse!",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888079"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I heard shouting and then sirens. Glad no one got seriously hurt.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888080"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "We need more patrols in this neighborhood at night.",
                created_at: new Date("2025-05-10T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1602865597998-b39c7a370110"
    },
    {
        _id: new ObjectId("666666666666666666666021"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Violent conflict outside bar",
        content: "A dispute outside a bar escalated into a violent conflict involving about 10 people, with at least two suffering minor injuries. Police have taken several suspects for questioning.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.726477",
            longitude: "-74.002741",
            address: "SoHo, New York, NY, USA"
        },
        category: "fight",
        click_time: 89,
        likes: [
            {
                _id: new ObjectId("777777777777777777777041"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777042"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888081"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This is scary... hope police have it under control.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888082"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Why do these fights keep happening? Getting worse!",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888083"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I heard shouting and then sirens. Glad no one got seriously hurt.",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888084"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "We need more patrols in this neighborhood at night.",
                created_at: new Date("2025-05-07T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1602865597998-b39c7a370110"
    },
    {
        _id: new ObjectId("666666666666666666666022"),
        user_id: new ObjectId("444444444444444444444444"),
        title: "Multi-person street brawl",
        content: "Multiple young people involved in a street brawl, some using improvised weapons. Police arrived and arrested 3 individuals, others fled the scene.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.721786",
            longitude: "-74.004172",
            address: "Canal St, New York, NY, USA"
        },
        category: "fight",
        click_time: 116,
        likes: [
            {
                _id: new ObjectId("777777777777777777777043"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777044"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888085"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This is scary... hope police have it under control.",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888086"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Why do these fights keep happening? Getting worse!",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888087"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I heard shouting and then sirens. Glad no one got seriously hurt.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888088"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "We need more patrols in this neighborhood at night.",
                created_at: new Date("2025-05-12T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1602865597998-b39c7a370110"
    },
    {
        _id: new ObjectId("666666666666666666666023"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Police intervene in public fight",
        content: "Law enforcement officers were called to stop a public fight, several participants sustained minor injuries but refused medical treatment.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.807456",
            longitude: "-73.961929",
            address: "Morningside Heights, New York, NY, USA"
        },
        category: "fight",
        click_time: 299,
        likes: [
            {
                _id: new ObjectId("777777777777777777777045"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777046"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888089"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This is scary... hope police have it under control.",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888090"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Why do these fights keep happening? Getting worse!",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888091"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I heard shouting and then sirens. Glad no one got seriously hurt.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888092"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "We need more patrols in this neighborhood at night.",
                created_at: new Date("2025-05-11T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1602865597998-b39c7a370110"
    },
    {
        _id: new ObjectId("666666666666666666666024"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Group conflict erupts nearby",
        content: "A heated argument escalated into a physical conflict involving several young adults. Security personnel have intervened to separate the parties.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.764356",
            longitude: "-73.923461",
            address: "Queens Plaza, New York, NY, USA"
        },
        category: "fight",
        click_time: 204,
        likes: [
            {
                _id: new ObjectId("777777777777777777777047"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777048"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888093"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This is scary... hope police have it under control.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888094"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Why do these fights keep happening? Getting worse!",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888095"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I heard shouting and then sirens. Glad no one got seriously hurt.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888096"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "We need more patrols in this neighborhood at night.",
                created_at: new Date("2025-05-11T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1602865597998-b39c7a370110"
    },
    {
        _id: new ObjectId("666666666666666666666025"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Physical altercation between groups",
        content: "Two groups of people began pushing and fighting after an argument in a public place, police quickly arrived after bystanders called for help.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.758091",
            longitude: "-73.968285",
            address: "Midtown East, New York, NY, USA"
        },
        category: "fight",
        click_time: 258,
        likes: [
            {
                _id: new ObjectId("777777777777777777777049"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777050"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888097"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This is scary... hope police have it under control.",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888098"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Why do these fights keep happening? Getting worse!",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888099"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I heard shouting and then sirens. Glad no one got seriously hurt.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888100"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "We need more patrols in this neighborhood at night.",
                created_at: new Date("2025-05-10T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1602865597998-b39c7a370110"
    },
    {
        _id: new ObjectId("666666666666666666666026"),
        user_id: new ObjectId("444444444444444444444444"),
        title: "Violent conflict outside bar",
        content: "A dispute outside a bar escalated into a violent conflict involving about 10 people, with at least two suffering minor injuries. Police have taken several suspects for questioning.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.743991",
            longitude: "-74.032362",
            address: "Hoboken Terminal, Hoboken, NJ, USA"
        },
        category: "fight",
        click_time: 95,
        likes: [
            {
                _id: new ObjectId("777777777777777777777051"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777052"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888101"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This is scary... hope police have it under control.",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888102"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Why do these fights keep happening? Getting worse!",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888103"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I heard shouting and then sirens. Glad no one got seriously hurt.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888104"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "We need more patrols in this neighborhood at night.",
                created_at: new Date("2025-05-08T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1602865597998-b39c7a370110"
    },
    {
        _id: new ObjectId("666666666666666666666027"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Sudden robbery alert",
        content: "A man stole a woman's wallet in broad daylight before running away, police are tracking the suspect through surveillance footage. Residents are advised to remain vigilant.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.751620",
            longitude: "-73.977230",
            address: "Bryant Park, New York, NY, USA"
        },
        category: "stealing",
        click_time: 95,
        likes: [
            {
                _id: new ObjectId("777777777777777777777053"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777054"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888105"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "Can't believe this happened in broad daylight.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888106"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "This area used to feel safe. What changed?",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888107"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Hope the thief gets caught soon!",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888108"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Be careful out there everyone, especially tourists.",
                created_at: new Date("2025-05-12T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1579071072955-6304ab5da48b"
    },
    {
        _id: new ObjectId("666666666666666666666028"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Convenience store theft case",
        content: "A convenience store reports a man wearing a hat and mask stole cash and goods, the clerk provided a detailed description to assist police investigation.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.755322",
            longitude: "-73.993287",
            address: "Penn Station, New York, NY, USA"
        },
        category: "stealing",
        click_time: 42,
        likes: [
            {
                _id: new ObjectId("777777777777777777777055"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777056"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888109"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "Can't believe this happened in broad daylight.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888110"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "This area used to feel safe. What changed?",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888111"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Hope the thief gets caught soon!",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888112"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Be careful out there everyone, especially tourists.",
                created_at: new Date("2025-05-08T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1579071072955-6304ab5da48b"
    },
    {
        _id: new ObjectId("666666666666666666666029"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Tourist items stolen incident",
        content: "Multiple tourists report pickpocketing at a tourist attraction, police have increased patrols and remind visitors to guard their valuables.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.706192",
            longitude: "-74.008874",
            address: "Financial District, New York, NY, USA"
        },
        category: "stealing",
        click_time: 32,
        likes: [
            {
                _id: new ObjectId("777777777777777777777057"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777058"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888113"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "Can't believe this happened in broad daylight.",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888114"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "This area used to feel safe. What changed?",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888115"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Hope the thief gets caught soon!",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888116"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Be careful out there everyone, especially tourists.",
                created_at: new Date("2025-05-10T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1579071072955-6304ab5da48b"
    },
    {
        _id: new ObjectId("666666666666666666666030"),
        user_id: new ObjectId("444444444444444444444444"),
        title: "Robbery incident in Upper East Side",
        content: "A woman's bag was snatched in Upper East Side, police are reviewing surveillance footage and seeking witnesses. Residents are advised to be alert and report suspicious activities.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.768731",
            longitude: "-73.964916",
            address: "Upper East Side, New York, NY, USA"
        },
        category: "stealing",
        click_time: 199,
        likes: [
            {
                _id: new ObjectId("777777777777777777777059"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777060"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888117"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "Can't believe this happened in broad daylight.",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888118"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "This area used to feel safe. What changed?",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888119"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Hope the thief gets caught soon!",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888120"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Be careful out there everyone, especially tourists.",
                created_at: new Date("2025-05-08T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1579071072955-6304ab5da48b"
    },
    {
        _id: new ObjectId("666666666666666666666031"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Store theft in West Village",
        content: "A store in West Village reports a theft of merchandise, the suspect was caught on security cameras. Police are investigating and seeking public assistance in identifying the suspect.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.735863",
            longitude: "-74.003571",
            address: "West Village, New York, NY, USA"
        },
        category: "stealing",
        click_time: 236,
        likes: [
            {
                _id: new ObjectId("777777777777777777777061"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777062"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888121"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "Can't believe this happened in broad daylight.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888122"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "This area used to feel safe. What changed?",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888123"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Hope the thief gets caught soon!",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888124"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Be careful out there everyone, especially tourists.",
                created_at: new Date("2025-05-10T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1579071072955-6304ab5da48b"
    },
    {
        _id: new ObjectId("666666666666666666666032"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Pickpocket incident at Grand Central",
        content: "Multiple reports of pickpocketing at Grand Central Terminal during rush hour. Police are reviewing surveillance footage and advising commuters to secure their belongings.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.752655",
            longitude: "-73.977295",
            address: "Grand Central Terminal, New York, NY, USA"
        },
        category: "stealing",
        click_time: 157,
        likes: [
            {
                _id: new ObjectId("777777777777777777777063"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777064"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888125"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I always keep my wallet in my front pocket when at Grand Central now.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888126"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Rush hour is prime time for these thieves. Stay alert everyone!",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888127"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Need more undercover officers during peak times.",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888128"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "I saw someone suspicious yesterday but wasn't sure who to report to.",
                created_at: new Date("2025-05-12T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1579071072955-6304ab5da48b"
    },
    {
        _id: new ObjectId("666666666666666666666033"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Smartphone theft on subway",
        content: "A passenger had their smartphone snatched while on the subway near Union Square. The suspect fled at the next station. Police are increasing patrols in the area.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.735736",
            longitude: "-73.990272",
            address: "Union Square Subway Station, New York, NY, USA"
        },
        category: "stealing",
        click_time: 122,
        likes: [
            {
                _id: new ObjectId("777777777777777777777065"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777066"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888129"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This is the third incident I've heard about this week.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888130"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Never hold your phone near the doors, especially when they're about to open.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888131"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "The MTA needs to install more cameras on platforms and trains.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888132"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "I've started using phone leashes after my friend had hers stolen last month.",
                created_at: new Date("2025-05-09T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1579071072955-6304ab5da48b"
    },
    {
        _id: new ObjectId("666666666666666666666034"),
        user_id: new ObjectId("444444444444444444444444"),
        title: "Retail shoplifting incident",
        content: "A high-end retail store in SoHo reports a coordinated shoplifting incident where multiple suspects quickly took merchandise and fled. NYPD is reviewing security footage.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.724525",
            longitude: "-74.001254",
            address: "SoHo Shopping District, New York, NY, USA"
        },
        category: "stealing",
        click_time: 187,
        likes: [
            {
                _id: new ObjectId("777777777777777777777067"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777068"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888133"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "Organized retail theft is becoming epidemic here.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888134"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Stores need more security guards, not just cameras.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888135"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I witnessed something similar last week but in a different store.",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888136"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "These thieves are getting more brazen by the day.",
                created_at: new Date("2025-05-10T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1579071072955-6304ab5da48b"
    },
    {
        _id: new ObjectId("666666666666666666666035"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Bike theft increasing in Brooklyn",
        content: "Several residents report bicycle thefts in the Williamsburg area. Police recommend using U-locks and registering bikes with the NYPD to aid in recovery if stolen.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.717096",
            longitude: "-73.953149",
            address: "Williamsburg, Brooklyn, NY, USA"
        },
        category: "stealing",
        click_time: 114,
        likes: [
            {
                _id: new ObjectId("777777777777777777777069"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777070"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888137"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "Lost two bikes this year already. Considering giving up on cycling.",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888138"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "There's a special place in hell for bike thieves.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888139"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "We need more secure bike parking stations with cameras.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888140"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Check local pawn shops if your bike gets stolen - found mine that way!",
                created_at: new Date("2025-05-12T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1579071072955-6304ab5da48b"
    },
    {
        _id: new ObjectId("666666666666666666666036"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Woman reports harassment by stranger",
        content: "A pedestrian reports being attacked by a group of teenagers without provocation, police are looking for witnesses and surveillance footage.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.752726",
            longitude: "-73.977229",
            address: "Grand Central Terminal, NY, USA"
        },
        category: "assaulting",
        click_time: 170,
        likes: [
            {
                _id: new ObjectId("777777777777777777777071"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777072"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888141"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "That's terrifying. Hope the victim is okay.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888142"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "We need more cameras in public areas.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888143"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Random assaults like this are becoming too common.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888144"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Good job to the police for responding fast.",
                created_at: new Date("2025-05-11T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1606323570217-3c9071e4b4ee"
    },
    {
        _id: new ObjectId("666666666666666666666037"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Intoxicated person attacking pedestrians",
        content: "A woman reports being followed and verbally harassed by an unknown man in the area, security personnel have intervened to help.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.754932",
            longitude: "-73.984016",
            address: "Times Square, NY, USA"
        },
        category: "assaulting",
        click_time: 226,
        likes: [
            {
                _id: new ObjectId("777777777777777777777073"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777074"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888145"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "That's terrifying. Hope the victim is okay.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888146"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "We need more cameras in public areas.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888147"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Random assaults like this are becoming too common.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888148"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Good job to the police for responding fast.",
                created_at: new Date("2025-05-08T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1606323570217-3c9071e4b4ee"
    },
    {
        _id: new ObjectId("666666666666666666666038"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Midnight assault incident",
        content: "A suspected intoxicated man attacked multiple pedestrians in a public area, he has been detained by police and removed from the scene.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.706192",
            longitude: "-74.013120",
            address: "Battery Park, NY, USA"
        },
        category: "assaulting",
        click_time: 83,
        likes: [
            {
                _id: new ObjectId("777777777777777777777075"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777076"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888149"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "That's terrifying. Hope the victim is okay.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888150"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "We need more cameras in public areas.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888151"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Random assaults like this are becoming too common.",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888152"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Good job to the police for responding fast.",
                created_at: new Date("2025-05-08T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1606323570217-3c9071e4b4ee"
    },
    {
        _id: new ObjectId("666666666666666666666039"),
        user_id: new ObjectId("444444444444444444444444"),
        title: "Harassment case in subway station",
        content: "Late at night, a pedestrian was attacked and robbed by two strangers, the victim sustained minor injuries, police are searching for suspects.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.729100",
            longitude: "-73.996500",
            address: "Washington Square Park, NY, USA"
        },
        category: "assaulting",
        click_time: 43,
        likes: [
            {
                _id: new ObjectId("777777777777777777777077"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777078"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888153"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "That's terrifying. Hope the victim is okay.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888154"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "We need more cameras in public areas.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888155"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Random assaults like this are becoming too common.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888156"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Good job to the police for responding fast.",
                created_at: new Date("2025-05-09T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1606323570217-3c9071e4b4ee"
    },
    {
        _id: new ObjectId("666666666666666666666040"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Unprovoked attack in park",
        content: "A female passenger was verbally and physically harassed by a stranger in the subway station, transit security responded quickly and detained the suspect.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.785091",
            longitude: "-73.968285",
            address: "Central Park, NY, USA"
        },
        category: "assaulting",
        click_time: 242,
        likes: [
            {
                _id: new ObjectId("777777777777777777777079"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777080"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888157"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "That's terrifying. Hope the victim is okay.",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888158"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "We need more cameras in public areas.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888159"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Random assaults like this are becoming too common.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888160"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Good job to the police for responding fast.",
                created_at: new Date("2025-05-07T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1606323570217-3c9071e4b4ee"
    },
    {
        _id: new ObjectId("666666666666666666666041"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Park jogger harassment",
        content: "Reports indicate a man randomly attacked joggers in the park, several people were frightened, park management has increased patrols.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.730974",
            longitude: "-73.991084",
            address: "Astor Place Station, NY, USA"
        },
        category: "assaulting",
        click_time: 290,
        likes: [
            {
                _id: new ObjectId("777777777777777777777081"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777082"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888161"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "That's terrifying. Hope the victim is okay.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888162"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "We need more cameras in public areas.",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888163"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Random assaults like this are becoming too common.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888164"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Good job to the police for responding fast.",
                created_at: new Date("2025-05-10T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1606323570217-3c9071e4b4ee"
    },
    {
        _id: new ObjectId("666666666666666666666042"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Rush hour traffic congestion",
        content: "Rush hour traffic congestion has worsened, some sections almost at a standstill, please plan ahead or consider public transportation.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.749825",
            longitude: "-73.987963",
            address: "Herald Square, New York, NY, USA"
        },
        category: "traffic jam",
        click_time: 70,
        likes: [
            {
                _id: new ObjectId("777777777777777777777083"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777084"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888165"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I've been stuck in this for 30 minutes. Ridiculous!",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888166"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "NYC traffic never fails to disappoint during rush hour.",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888167"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "We need better planning for these parades and events.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888168"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Public transport saved me today, avoid driving here!",
                created_at: new Date("2025-05-08T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1568119806199-17d9d32e3ae9"
    },
    {
        _id: new ObjectId("666666666666666666666043"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Heavy congestion at bridge entrance",
        content: "Bridge entrance is severely congested due to excessive vehicles, traffic police are on site directing traffic, estimated at least an hour to return to normal.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.721630",
            longitude: "-74.004697",
            address: "Manhattan Bridge Entrance, NY, USA"
        },
        category: "traffic jam",
        click_time: 127,
        likes: [
            {
                _id: new ObjectId("777777777777777777777085"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777086"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888169"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I've been stuck in this for 30 minutes. Ridiculous!",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888170"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "NYC traffic never fails to disappoint during rush hour.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888171"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "We need better planning for these parades and events.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888172"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Public transport saved me today, avoid driving here!",
                created_at: new Date("2025-05-11T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1568119806199-17d9d32e3ae9"
    },
    {
        _id: new ObjectId("666666666666666666666044"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Traffic blockage at tunnel exit",
        content: "A minor accident at the tunnel exit has caused traffic blockage, emergency vehicles have arrived at the scene, please be patient.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.739180",
            longitude: "-73.998620",
            address: "Hudson Tunnel Exit, NY, USA"
        },
        category: "traffic jam",
        click_time: 61,
        likes: [
            {
                _id: new ObjectId("777777777777777777777087"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777088"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888173"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I've been stuck in this for 30 minutes. Ridiculous!",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888174"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "NYC traffic never fails to disappoint during rush hour.",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888175"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "We need better planning for these parades and events.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888176"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Public transport saved me today, avoid driving here!",
                created_at: new Date("2025-05-12T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1568119806199-17d9d32e3ae9"
    },
    {
        _id: new ObjectId("666666666666666666666045"),
        user_id: new ObjectId("444444444444444444444444"),
        title: "Severe congestion in downtown area",
        content: "Downtown main roads are temporarily closed due to a parade, surrounding roads are severely congested, completely avoiding the area is recommended.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.712776",
            longitude: "-74.005974",
            address: "City Hall, Downtown Manhattan, NY, USA"
        },
        category: "traffic jam",
        click_time: 69,
        likes: [
            {
                _id: new ObjectId("777777777777777777777089"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777090"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888177"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "I've been stuck in this for 30 minutes. Ridiculous!",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888178"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "NYC traffic never fails to disappoint during rush hour.",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888179"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "We need better planning for these parades and events.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888180"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Public transport saved me today, avoid driving here!",
                created_at: new Date("2025-05-07T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1568119806199-17d9d32e3ae9"
    },
    {
        _id: new ObjectId("666666666666666666666046"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Main street closure notice",
        content: "City government announces the main street will be temporarily closed for asphalt resurfacing, closure time is all weekend, please plan routes in advance.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.742054",
            longitude: "-74.001593",
            address: "14th St, New York, NY, USA"
        },
        category: "road closed",
        click_time: 20,
        likes: [
            {
                _id: new ObjectId("777777777777777777777091"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777092"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888181"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "Why is this always scheduled during rush hour?",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888182"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Appreciate the notice, just wish it came earlier.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888183"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Hope emergency crews are okay. This looks serious.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888184"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City events are fun but the traffic disruption is huge.",
                created_at: new Date("2025-05-11T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1593436878048-92622a77d315"
    },
    {
        _id: new ObjectId("666666666666666666666047"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Road closed due to accident",
        content: "A serious traffic accident involving multiple vehicles has completely closed the road, police and paramedics are on scene, expected to last several hours.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.750504",
            longitude: "-73.993439",
            address: "7th Ave & W 33rd St, New York, NY, USA"
        },
        category: "road closed",
        click_time: 46,
        likes: [
            {
                _id: new ObjectId("777777777777777777777093"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777094"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888185"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "Why is this always scheduled during rush hour?",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888186"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Appreciate the notice, just wish it came earlier.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888187"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Hope emergency crews are okay. This looks serious.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888188"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City events are fun but the traffic disruption is huge.",
                created_at: new Date("2025-05-07T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1593436878048-92622a77d315"
    },
    {
        _id: new ObjectId("666666666666666666666048"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Temporary road closure for public event",
        content: "For the annual marathon, multiple main roads will be temporary closed Sunday from 6am to 2pm, please check the official website for detailed detour information.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.776676",
            longitude: "-73.971321",
            address: "Columbus Ave, New York, NY, USA"
        },
        category: "road closed",
        click_time: 155,
        likes: [
            {
                _id: new ObjectId("777777777777777777777095"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777096"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888189"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "Why is this always scheduled during rush hour?",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888190"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Appreciate the notice, just wish it came earlier.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888191"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Hope emergency crews are okay. This looks serious.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888192"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "City events are fun but the traffic disruption is huge.",
                created_at: new Date("2025-05-12T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1593436878048-92622a77d315"
    },
    {
        _id: new ObjectId("666666666666666666666049"),
        user_id: new ObjectId("444444444444444444444444"),
        title: "Bridge maintenance road closure",
        content: "Due to urgent bridge maintenance work, the east-bound lanes will be closed from Friday night to Monday morning, please use alternative routes.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.700661",
            longitude: "-73.992580",
            address: "Brooklyn Bridge, New York, NY, USA"
        },
        category: "road closed",
        click_time: 213,
        likes: [
            {
                _id: new ObjectId("777777777777777777777097"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777098"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888193"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This is going to cause chaos for commuters!",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888194"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Better maintenance now than dealing with bigger problems later.",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888195"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Anyone know if pedestrian access will still be available?",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888196"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Will definitely affect my weekend plans. Thanks for the heads-up.",
                created_at: new Date("2025-05-08T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1593436878048-92622a77d315"
    },
    {
        _id: new ObjectId("666666666666666666666050"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Tunnel closure for maintenance",
        content: "The tunnel will be completely closed from midnight to 5am for regular maintenance, please use bridge crossings during this period.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.761603",
            longitude: "-74.016559",
            address: "Lincoln Tunnel, New York, NY, USA"
        },
        category: "road closed",
        click_time: 87,
        likes: [
            {
                _id: new ObjectId("777777777777777777777099"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777100"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888197"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "At least they're doing it during off-peak hours.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888198"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Is this going to happen every week? Planning my night shifts.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888199"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "The bridges will be packed! Better plan extra time.",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888200"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Thanks for sharing this information early!",
                created_at: new Date("2025-05-07T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1593436878048-92622a77d315"
    },
    {
        _id: new ObjectId("666666666666666666666051"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Major intersection closure",
        content: "Due to utility work, the major intersection at Broadway and 42nd Street will be closed this weekend. All traffic will be detoured, expect significant delays.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.756205",
            longitude: "-73.986709",
            address: "Broadway & 42nd Street, New York, NY, USA"
        },
        category: "road closed",
        click_time: 175,
        likes: [
            {
                _id: new ObjectId("777777777777777777777101"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777102"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888201"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "Times Square will be a nightmare! Avoid at all costs.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888202"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Will they finish on time? These projects always seem to run over.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888203"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "This is why I avoid driving in midtown on weekends.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888204"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Any info on which subway entrances might be affected?",
                created_at: new Date("2025-05-11T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1593436878048-92622a77d315"
    },
    {
        _id: new ObjectId("666666666666666666666052"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Street music performance",
        content: "A group of talented musicians are performing an impromptu concert on the street, attracting many pedestrians to stop and enjoy.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.758896",
            longitude: "-73.985130",
            address: "Times Square, New York, NY, USA"
        },
        category: "performance",
        click_time: 201,
        likes: [
            {
                _id: new ObjectId("777777777777777777777103"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777104"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888205"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This performance was so inspiring, glad I stopped!",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888206"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "New York never disappoints with its street art.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888207"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I hope they come back again soon, amazing talent.",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888208"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "I recorded a part of this and shared it — stunning!",
                created_at: new Date("2025-05-07T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1588671815815-b0cd3b2a9189"
    },
    {
        _id: new ObjectId("666666666666666666666053"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Amazing street art show",
        content: "Street artists are showcasing amazing paintings and crafts, creating a vibrant atmosphere.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.730610",
            longitude: "-73.935242",
            address: "East Village, New York, NY, USA"
        },
        category: "performance",
        click_time: 176,
        likes: [
            {
                _id: new ObjectId("777777777777777777777105"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777106"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888209"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This performance was so inspiring, glad I stopped!",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888210"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "New York never disappoints with its street art.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888211"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I hope they come back again soon, amazing talent.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888212"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "I recorded a part of this and shared it — stunning!",
                created_at: new Date("2025-05-07T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1588671815815-b0cd3b2a9189"
    },
    {
        _id: new ObjectId("666666666666666666666054"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Stunning street dance performance",
        content: "A professional dance troupe is performing an excellent show on the street, attracting a large audience. Performance expected to continue until 5pm.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.729513",
            longitude: "-73.996460",
            address: "NYU, New York, NY, USA"
        },
        category: "performance",
        click_time: 137,
        likes: [
            {
                _id: new ObjectId("777777777777777777777107"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777108"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888213"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This performance was so inspiring, glad I stopped!",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888214"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "New York never disappoints with its street art.",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888215"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I hope they come back again soon, amazing talent.",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888216"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "I recorded a part of this and shared it — stunning!",
                created_at: new Date("2025-05-10T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1588671815815-b0cd3b2a9189"
    },
    {
        _id: new ObjectId("666666666666666666666055"),
        user_id: new ObjectId("444444444444444444444444"),
        title: "Impromptu theater performance",
        content: "A group of young actors are holding an impromptu theatrical performance in the square, addressing social issues in a humorous way, audience response enthusiastic.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.741061",
            longitude: "-73.989699",
            address: "Madison Square Park, New York, NY, USA"
        },
        category: "performance",
        click_time: 293,
        likes: [
            {
                _id: new ObjectId("777777777777777777777109"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777110"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888217"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This performance was so inspiring, glad I stopped!",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888218"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "New York never disappoints with its street art.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888219"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I hope they come back again soon, amazing talent.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888220"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "I recorded a part of this and shared it — stunning!",
                created_at: new Date("2025-05-12T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1588671815815-b0cd3b2a9189"
    },
    {
        _id: new ObjectId("666666666666666666666056"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Street opera performance",
        content: "An opera singer is performing classic opera excerpts on the street corner, their wonderful voice making passersby stop in amazement to listen.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.707496",
            longitude: "-74.011276",
            address: "Battery Park, New York, NY, USA"
        },
        category: "performance",
        click_time: 108,
        likes: [
            {
                _id: new ObjectId("777777777777777777777111"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777112"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888221"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This performance was so inspiring, glad I stopped!",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888222"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "New York never disappoints with its street art.",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888223"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I hope they come back again soon, amazing talent.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888224"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "I recorded a part of this and shared it — stunning!",
                created_at: new Date("2025-05-12T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1588671815815-b0cd3b2a9189"
    },
    {
        _id: new ObjectId("666666666666666666666057"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Street acrobat performance",
        content: "Artists from an international circus are performing amazing acrobatics in the square, including aerial stunts and fire dancing, attracting hundreds of spectators.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.762421",
            longitude: "-73.973291",
            address: "Rockefeller Center, New York, NY, USA"
        },
        category: "performance",
        click_time: 88,
        likes: [
            {
                _id: new ObjectId("777777777777777777777113"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777114"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888225"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This performance was so inspiring, glad I stopped!",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888226"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "New York never disappoints with its street art.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888227"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I hope they come back again soon, amazing talent.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888228"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "I recorded a part of this and shared it — stunning!",
                created_at: new Date("2025-05-12T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1588671815815-b0cd3b2a9189"
    },
    {
        _id: new ObjectId("666666666666666666666058"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Street music performance",
        content: "A group of talented musicians are performing an impromptu concert on the street, attracting many pedestrians to stop and enjoy.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.744679",
            longitude: "-73.948542",
            address: "Long Island City, New York, NY, USA"
        },
        category: "performance",
        click_time: 290,
        likes: [
            {
                _id: new ObjectId("777777777777777777777115"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777116"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888229"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This performance was so inspiring, glad I stopped!",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888230"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "New York never disappoints with its street art.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888231"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I hope they come back again soon, amazing talent.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888232"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "I recorded a part of this and shared it — stunning!",
                created_at: new Date("2025-05-08T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1588671815815-b0cd3b2a9189"
    },
    {
        _id: new ObjectId("666666666666666666666059"),
        user_id: new ObjectId("444444444444444444444444"),
        title: "Amazing street art show",
        content: "Street artists are showcasing amazing paintings and crafts, creating a vibrant atmosphere.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.772464",
            longitude: "-73.983489",
            address: "Lincoln Center, New York, NY, USA"
        },
        category: "performance",
        click_time: 224,
        likes: [
            {
                _id: new ObjectId("777777777777777777777117"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777118"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888233"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "This performance was so inspiring, glad I stopped!",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888234"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "New York never disappoints with its street art.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888235"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "I hope they come back again soon, amazing talent.",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888236"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "I recorded a part of this and shared it — stunning!",
                created_at: new Date("2025-05-11T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1588671815815-b0cd3b2a9189"
    },
    {
        _id: new ObjectId("666666666666666666666060"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "International flavor food trucks gathering",
        content: "Food trucks from around the world have gathered here, offering everything from Italian pizza to Thai street food, a one-stop world culinary tour.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.733572",
            longitude: "-74.002742",
            address: "Washington Square North, New York, NY, USA"
        },
        category: "food truck",
        click_time: 288,
        likes: [
            {
                _id: new ObjectId("777777777777777777777119"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777120"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888237"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "Just tried the tacos — absolutely amazing!",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888238"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "I love how this supports small local vendors.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888239"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Perfect spot to grab dinner after a long day.",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888240"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Hope they make this a regular thing every weekend.",
                created_at: new Date("2025-05-07T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb"
    },
    {
        _id: new ObjectId("666666666666666666666061"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Organic food truck market",
        content: "The weekend organic food market has added several food trucks providing meals made with local organic ingredients, supporting sustainable development.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.752786",
            longitude: "-73.977306",
            address: "Grand Central Market, New York, NY, USA"
        },
        category: "food truck",
        click_time: 163,
        likes: [
            {
                _id: new ObjectId("777777777777777777777121"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777122"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888241"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "Just tried the tacos — absolutely amazing!",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888242"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "I love how this supports small local vendors.",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888243"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Perfect spot to grab dinner after a long day.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888244"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Hope they make this a regular thing every weekend.",
                created_at: new Date("2025-05-09T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb"
    },
    {
        _id: new ObjectId("666666666666666666666062"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Late night food truck service",
        content: "A late-night food truck now serving night owls, offering options from snacks to full meals, operating until 3am.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.761480",
            longitude: "-73.982079",
            address: "Columbus Circle Plaza, New York, NY, USA"
        },
        category: "food truck",
        click_time: 245,
        likes: [
            {
                _id: new ObjectId("777777777777777777777123"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777124"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888245"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "Just tried the tacos — absolutely amazing!",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888246"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "I love how this supports small local vendors.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888247"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Perfect spot to grab dinner after a long day.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888248"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "Hope they make this a regular thing every weekend.",
                created_at: new Date("2025-05-07T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb"
    },
    {
        _id: new ObjectId("666666666666666666666063"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Celebration parade about to begin",
        content: "The annual celebration parade will begin at 3pm today, featuring floats, bands and street dance performances.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.757974",
            longitude: "-73.985543",
            address: "Broadway & W 46th St, New York, NY, USA"
        },
        category: "parade",
        click_time: 95,
        likes: [
            {
                _id: new ObjectId("777777777777777777777125"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777126"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888249"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "The floats this year were incredibly well-designed!",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888250"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Love seeing the cultural costumes and dancing.",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888251"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Can't believe how packed the streets were—amazing turnout.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888252"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "The parade made the whole city feel so festive!",
                created_at: new Date("2025-05-12T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1677211310859-5a263e96f99c"
    },
    {
        _id: new ObjectId("666666666666666666666064"),
        user_id: new ObjectId("222222222222222222222222"),
        title: "Special themed parade",
        content: "An environmentally themed parade is taking place, attracting many citizens concerned about environmental issues.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.743164",
            longitude: "-73.982253",
            address: "2nd Ave & E 23rd St, New York, NY, USA"
        },
        category: "parade",
        click_time: 87,
        likes: [
            {
                _id: new ObjectId("777777777777777777777127"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777128"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888253"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "The floats this year were incredibly well-designed!",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888254"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Love seeing the cultural costumes and dancing.",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888255"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Can't believe how packed the streets were—amazing turnout.",
                created_at: new Date("2025-05-12T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888256"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "The parade made the whole city feel so festive!",
                created_at: new Date("2025-05-11T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1677211310859-5a263e96f99c"
    },
    {
        _id: new ObjectId("666666666666666666666065"),
        user_id: new ObjectId("333333333333333333333333"),
        title: "Cultural diversity parade",
        content: "A multicultural celebration parade is underway, with groups from different cultural backgrounds showcasing their traditional costumes, music and dance, displaying the city's diversity.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.762356",
            longitude: "-73.975409",
            address: "5th Ave & E 50th St, New York, NY, USA"
        },
        category: "parade",
        click_time: 44,
        likes: [
            {
                _id: new ObjectId("777777777777777777777129"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777130"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888257"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "The floats this year were incredibly well-designed!",
                created_at: new Date("2025-05-07T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888258"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Love seeing the cultural costumes and dancing.",
                created_at: new Date("2025-05-10T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888259"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Can't believe how packed the streets were—amazing turnout.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888260"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "The parade made the whole city feel so festive!",
                created_at: new Date("2025-05-07T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1677211310859-5a263e96f99c"
    },
    {
        _id: new ObjectId("666666666666666666666066"),
        user_id: new ObjectId("444444444444444444444444"),
        title: "Historical commemoration parade",
        content: "A parade commemorating an important historical event will be held tomorrow, participants will wear historical costumes to recreate key historical moments.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.778998",
            longitude: "-73.963785",
            address: "Central Park West, New York, NY, USA"
        },
        category: "parade",
        click_time: 137,
        likes: [
            {
                _id: new ObjectId("777777777777777777777131"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777132"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888261"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "The floats this year were incredibly well-designed!",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888262"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Love seeing the cultural costumes and dancing.",
                created_at: new Date("2025-05-09T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888263"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Can't believe how packed the streets were—amazing turnout.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888264"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "The parade made the whole city feel so festive!",
                created_at: new Date("2025-05-07T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1677211310859-5a263e96f99c"
    },
    {
        _id: new ObjectId("666666666666666666666067"),
        user_id: new ObjectId("111111111111111111111111"),
        title: "Float costume parade",
        content: "The annual float parade is about to begin, this year's theme is 'Future City', many creative floats are ready to go.",
        created_at: getRandomDate(),
        location: {
            latitude: "40.733986",
            longitude: "-74.003473",
            address: "Washington Square Park, New York, NY, USA"
        },
        category: "parade",
        click_time: 175,
        likes: [
            {
                _id: new ObjectId("777777777777777777777133"),
                user_id: new ObjectId("111111111111111111111111"),
                liked_at: new Date("2025-05-11T13:00:00Z")
            },
            {
                _id: new ObjectId("777777777777777777777134"),
                user_id: new ObjectId("222222222222222222222222"),
                liked_at: new Date("2025-05-12T05:23:44.410Z")
            }
        ],
        comments: [
            {
                _id: new ObjectId("888888888888888888888265"),
                user_id: new ObjectId("111111111111111111111111"),
                content: "The floats this year were incredibly well-designed!",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888266"),
                user_id: new ObjectId("222222222222222222222222"),
                content: "Love seeing the cultural costumes and dancing.",
                created_at: new Date("2025-05-11T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888267"),
                user_id: new ObjectId("333333333333333333333333"),
                content: "Can't believe how packed the streets were—amazing turnout.",
                created_at: new Date("2025-05-08T04:11:13Z")
            },
            {
                _id: new ObjectId("888888888888888888888268"),
                user_id: new ObjectId("444444444444444444444444"),
                content: "The parade made the whole city feel so festive!",
                created_at: new Date("2025-05-08T04:11:13Z")
            }
        ],
        photoUrl: "https://images.unsplash.com/photo-1677211310859-5a263e96f99c"
    }
];

const eventsCollection = await events();

try {
    await eventsCollection.drop();

    const insertEventsResult = await eventsCollection.insertMany(eventsToCreate);
    console.log(`Successfully inserted ${insertEventsResult.insertedCount} events`);
} catch (error) {
    console.error('Error inserting events:', error);
} finally {
    await closeConnection();
}
