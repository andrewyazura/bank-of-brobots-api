import userModel from '../models/userModel';

export default async (name, telegram_id) => {
  let user = await userModel.create({
    name,
    telegram_id,
  });

  user = user.toObject();
  return user;
};
