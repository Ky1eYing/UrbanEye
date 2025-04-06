import express from 'express';
const app = express();
import configRoutesFunction from './routes/index.js';
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import { users } from "./config/mongoCollections.js";

const db = await dbConnection();
const usersCollection = await users();
await usersCollection.createIndex({ userName: 1 }, { unique: true });;
// await closeConnection();

app.use(express.json());
configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});