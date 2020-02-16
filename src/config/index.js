require('dotenv').config();

const expConf = {
  port: process.env.EXPRESS_PORT || '8080',
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
    name: 'Free',
    limit: 40,
    cost: 0,
  },
  {
    name: 'Basic',
    limit: 60,
    cost: 10,
  },
  {
    name: 'Premium',
    limit: null,
    cost: 30,
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
