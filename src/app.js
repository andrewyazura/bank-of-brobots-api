import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { expConf, dbConf, dbConnectConf } from './config';

import cors from './middleware/cors';
import auth from './middleware/auth';

import routes from './routes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);
app.use(auth.unless({ path: ['/api/login', '/api/register'] }));

app.use('/api', routes);

let server = app.listen(expConf['port'], () => {
  console.log('Listening on port: ' + server.address().port);
  mongoose.connect(dbConf['dbPath'], dbConnectConf);
});
