import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import userModel from '../models/userModel';
import { jwtConf, exJwtConf } from '../config';

export default async (email, password) => {
  const user = await userModel.findOne({ email }).exec();

  if (!user) throw new Error('Invalid credentials');

  const matchPasswords = bcrypt.compareSync(password, user.password);

  if (!matchPasswords) throw new Error('Invalid credentials');

  let token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    exJwtConf['secret'],
    jwtConf,
  );

  return token;
};
