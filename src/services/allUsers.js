import userModel from '../models/userModel';

export default async () => {
  let users = await userModel
    .find({})
    .populate('accounts')
    .populate({
      path: 'accounts',
      populate: {
        path: 'transactions',
      },
    })
    .exec();

  return users;
};
