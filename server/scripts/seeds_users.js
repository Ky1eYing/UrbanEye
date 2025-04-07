// seed_user.js
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const db = await dbConnection();
// await db.dropDatabase();

const usersToCreate = [

    {
        //  Display
        _id: new ObjectId(),
        userName: "USER1",                                                          // unique, not null
        name: "UserFirstName UserLastName",                                         // not null
        introduction: "I am user1.",                                                // Less than 200 characters
        sex: "Male",                                                                // Less than 20 characters
        email: "user1@gmail.com",                                                   // email format                        
        phone: "+16667778888",                                                      // only number & "+"
        avatar: "USER1avatar.jpg",                                                  // filename.jpg, png,...

        //  Hidden
        password: "$2b$10$U/UvR7mvvChS/Vzxx8pvs.PonsNPYRENpHvXj3y/oCwp1pNmcFzS6"    // "admin123", Bcrypt Rounds: 10, not null
    },
    {
        _id: new ObjectId(),
        userName: "USER2",
        name: "USER2Name",
        introduction: null,
        sex: "CustomXXXXXX",
        email: null,
        phone: null,
        avatar: null,

        password: "$2b$10$U/UvR7mvvChS/Vzxx8pvs.PonsNPYRENpHvXj3y/oCwp1pNmcFzS6"
    },

];

const usersCollection = await users();

await usersCollection.drop();
await usersCollection.createIndex({ userName: 1 }, { unique: true });;

const insertResult = await usersCollection.insertMany(usersToCreate);
console.log(`Inserted ${insertResult.insertedCount} users`);

await closeConnection();
