import userModel from '../../models/userModel';

export default async (telegram_id) => {
  const user = await userModel
    .findOne({ telegram_id })
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
