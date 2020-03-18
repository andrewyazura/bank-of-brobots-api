import userModel from '../../models/userModel';

export default async (id) => {
  const user = await userModel
    .findById(id)
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

  return user;
};
