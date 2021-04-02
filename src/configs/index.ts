import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("🔥 Couldn't find .env file");
}

export const configs = {
  port: parseInt(process.env.PORT || '3000', 10),
  databaseURL: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET,
  jwtAlgorithm: process.env.JWT_ALGO,
  logs: { level: process.env.LOG_LEVEL || 'silly' },
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY || '10', 10),
  },
  agendash: {
    user: process.env.AGENDASH_USER,
    password: process.env.AGENDASH_PWD,
  },
  api: { prefix: '/api' },
  emails: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  },
};
