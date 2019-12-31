import userModel from '../models/userModel';

export default async (name, email, password) => {
  let user = await userModel.create({
    name,
    email,
    password,
  });

  user = user.toObject();
  delete user.password;
  return user;
};
