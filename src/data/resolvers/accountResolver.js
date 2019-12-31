import userModel from '../../models/userModel';
import accountModel from '../../models/accountModel';

const accountResolver = {
  account: async ({ id }, request) => {
    let account = await accountModel
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
  },

  createAccount: async ({ customName }, request) => {
    const account = await accountModel.create({
      customName,
      owner: request.user.id.toString(),
    });
    const user = await userModel.findById(request.user.id).exec();

    user.accounts.push(account);
    user.save();
    account.save();

    return account;
  },
};

export default accountResolver;
