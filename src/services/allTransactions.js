import transactionModel from '../models/transactionModel';

export default async () => {
  let users = await transactionModel
    .find({})
    .populate('fromUser')
    .populate('toUser')
    .exec();

  return users;
};
