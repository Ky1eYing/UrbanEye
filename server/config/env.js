import dotenv from 'dotenv';
dotenv.config();

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const SESSION_MAX_AGE = process.env.SESSION_MAX_AGE;