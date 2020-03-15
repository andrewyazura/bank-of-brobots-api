require('dotenv').config();

const expConf = {
  port: process.env.EXPRESS_PORT || '8000',
};

const corsConf = {
  origin: process.env.ALLOW_ORIGIN_HEADER || '',
  allowedHeaders: process.env.ALLOW_HEADERS_HEADER || '',
};

const jwtConf = { expiresIn: process.env.JWT_EXPIRATION || '24h' };

const exJwtConf = {
  secret: process.env.JWT_SECRET || 'the_secret',
  credentialsRequired: true,
};

const dbConf = {
  dbPath: process.env.DB_PATH || 'mongodb://localhost:27017/test',
};

const dbConnectConf = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

const subscriptions = [
  {
    id: 0,
    name: 'Free',
    limit: 100,
    cost: 0,
  },
  {
    id: 1,
    name: 'Basic',
    limit: 180,
    cost: 10,
  },
  {
    id: 2,
    name: 'Premium',
    limit: null,
    cost: 30,
  },
  {
    id: 100,
    name: 'Admin',
    limit: null,
    cost: 0,
  },
];

export {
  expConf,
  corsConf,
  jwtConf,
  exJwtConf,
  dbConf,
  dbConnectConf,
  subscriptions,
};
