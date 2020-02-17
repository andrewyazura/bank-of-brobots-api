import accountModel from '../../models/accountModel';

export default async () => {
  let accounts = await accountModel
    .find({})
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

  return accounts;
};
