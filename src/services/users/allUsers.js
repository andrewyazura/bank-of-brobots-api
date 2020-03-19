import userModel from '../../models/userModel';

export default async () => {
  let users = await userModel
    .find({})
    .populate('transactions')
    .populate({
      path: 'transactions',
      populate: {
        path: 'fromUser',
      },
    })
    .populate({
      path: 'transactions',
      populate: {
        path: 'toUser',
      },
    })
    .exec();

  return users;
};
