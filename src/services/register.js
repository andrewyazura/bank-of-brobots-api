import userModel from '../models/userModel';

export default async (name, telegram_id, username) => {
  let user = await userModel.create({
    name,
    telegram_id,
    username,
  });

  user = user.toObject();
  return user;
};
