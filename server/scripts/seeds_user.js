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

        //  Hidden
        password: "$2a$10$512l1O/5S8DTXRfYNuOvGOd1y7x0ikZOlXU/C6bzYwIZT92zazoI6",   // "admin123", Bcrypt Rounds: 10, not null
        avatar: "USER1avatar.jpg",                                                  // filename.jpg, png,...

        createdAt: new Date(),                                                      // auto_created
        updatedAt: new Date(),                                                      // auto_created
        lastLogin: null,                                                            // auto_created
        token: null,                                                                // auto_created
        expiresAt: null,                                                            // auto_created
    },
    {
        _id: new ObjectId(),
        userName: "USER2",
        name: "USER2Name",
        introduction: null,
        sex: "CustomXXXXXX",
        email: null,
        phone: null,

        password: "$2a$10$512l1O/5S8DTXRfYNuOvGOd1y7x0ikZOlXU/C6bzYwIZT92zazoI6",    // "admin123",
        avatar: null,

        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        token: null,
        expiresAt: null,
    },

];

const usersCollection = await users();

await usersCollection.drop();

const insertResult = await usersCollection.insertMany(usersToCreate);
console.log(`Inserted ${insertResult.insertedCount} users`);

await closeConnection();
