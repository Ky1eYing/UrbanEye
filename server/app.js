import configRoutesFunction from './routes/index.js';
import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import { users } from "./config/mongoCollections.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import exphbs from 'express-handlebars';
import sessionMiddleware from './middleware/session.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = await dbConnection();
const usersCollection = await users();
await usersCollection.createIndex({ userName: 1 }, { unique: true });;
// await closeConnection();

import express from 'express';
const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.handlebars',
  helpers: {
    eq: function (a, b) {
      return a === b;
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We've now got UrbanEye server!");
  console.log('Your routes will be running on http://localhost:3000');
});