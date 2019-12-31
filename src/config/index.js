require('dotenv').config();

const expConf = {
  port: process.env.EXPRESS_PORT,
  allowOriginHeader: process.env.ALLOW_ORIGIN_HEADER,
  allowHeadersHeader: process.env.ALLOW_HEADERS_HEADER,
};

const jwtConf = { expiresIn: process.env.JWT_EXPIRATION };

const exJwtConf = {
  secret: process.env.JWT_SECRET,
  credentialsRequired: true,
};

const dbConf = {
  dbPath: process.env.DB_PATH,
};

const dbConnectConf = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

export { expConf, jwtConf, exJwtConf, dbConf, dbConnectConf };
