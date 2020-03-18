import jwt from 'jsonwebtoken';

import userModel from '../models/userModel';
import { jwtConf, exJwtConf } from '../config';

export default async (telegram_id) => {
  const user = await userModel.findOne({ telegram_id }).exec();

  if (!user) throw new Error('Invalid credentials');

  let token = jwt.sign(
    {
      id: user.id,
      username: user.telegram_id,
    },
    exJwtConf['secret'],
    jwtConf,
  );

  return token;
};
