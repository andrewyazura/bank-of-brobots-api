import accountModel from '../models/accountModel';

export default async (id) => {
  const account = await accountModel
    .findById(id)
    .populate('owner')
    .populate({
      path: 'transactions',
      populate: {
        path: 'fromAccount',
      },
    })
    .populate({
      path: 'transactions',
      populate: {
        path: 'toAccount',
      },
    })
    .exec();

  return account;
};
