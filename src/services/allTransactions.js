import transactionModel from '../models/transactionModel';

export default async () => {
  let users = await transactionModel
    .find({})
    .populate('fromAccount')
    .populate('toAccount')
    .populate({
      path: 'fromAccount',
      populate: {
        path: 'owner',
      },
    })
    .populate({
      path: 'toAccount',
      populate: {
        path: 'owner',
      },
    })
    .exec();

  return users;
};
