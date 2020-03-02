import userModel from '../../models/userModel';

export default async () => {
  let users = await userModel
    .find({})
    .populate('transactions')
    .exec();

  return users;
};
