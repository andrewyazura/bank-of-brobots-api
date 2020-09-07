require('dotenv').config();

const expConf = {
  port: process.env.EXPRESS_PORT || '8000',
};

const corsConf = {
  origin: process.env.ALLOW_ORIGIN_HEADER || '',
  allowedHeaders: process.env.ALLOW_HEADERS_HEADER || '',
};

const dbConf = {
  dbPath: process.env.DB_PATH || 'mongodb://localhost:27017/test',
};

const dbConnectConf = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

export { expConf, corsConf, dbConf, dbConnectConf };
