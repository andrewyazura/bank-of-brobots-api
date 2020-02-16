import userModel from '../../models/userModel';

export default async (id) => {
  const user = await userModel
    .findById(id)
    .populate('accounts')
    .populate({
      path: 'accounts',
      populate: {
        path: 'transactions',
      },
    })
    .exec();

  return user;
};
