import session from 'express-session';
import { SESSION_COOKIE_NAME, SESSION_SECRET, SESSION_MAX_AGE } from '../config/env.js';


const sessionMiddleware = session({
    name: SESSION_COOKIE_NAME || 'connect.sid',
    secret: SESSION_SECRET || 'UrbanEyeUrbanEyeUrbanEyeUrbanEyeUrbanEye',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
    maxAge: parseInt(SESSION_MAX_AGE) || 60000,
    httpOnly: true,
    secure: false
  }
});

export default sessionMiddleware;