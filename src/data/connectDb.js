import mongoose from 'mongoose';
import { dbConf, dbConnectConf } from '../config';

const connectDb = () => {
  mongoose.connect(dbConf['dbPath'], dbConnectConf);
};

export default connectDb;
