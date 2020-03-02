import userModel from '../../models/userModel';

export default async (id) => {
  const user = await userModel
    .findById(id)
    .populate('transactions')
    .exec();

  return user;
};
