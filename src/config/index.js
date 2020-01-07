require('dotenv').config();

const expConf = {
  port: process.env.EXPRESS_PORT || '8080',
  allowOriginHeader: process.env.ALLOW_ORIGIN_HEADER || '',
  allowHeadersHeader: process.env.ALLOW_HEADERS_HEADER || '',
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

export { expConf, jwtConf, exJwtConf, dbConf, dbConnectConf };
