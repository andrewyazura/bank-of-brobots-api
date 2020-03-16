import express from 'express';
import bodyParser from 'body-parser';
import { expConf } from './config';
import scheduler from 'node-schedule';

import auth from './middleware/auth';
import cors from './middleware/cors';
import helmet from 'helmet';

import routes from './routes';
import connectDatabase from './data/connectDb';

import updateLimits from './services/subscriptions/updateLimits';
import getPayments from './services/subscriptions/getPayments';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(auth.unless({ path: ['/api/login', '/api/register'] }));
app.use(cors);
app.use(helmet());

app.use('/api', routes);

let server = app.listen(expConf['port'], () => {
  console.log('Listening on port: ' + server.address().port);
  connectDatabase();

  let update = scheduler.scheduleJob('0 0 0 * * 1', async () => {
    await updateLimits();
  });

  let payments = scheduler.scheduleJob('0 0 0 1 * *', async () => {
    await getPayments();
  });
});
