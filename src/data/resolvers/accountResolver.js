import userModel from '../../models/userModel';
import accountModel from '../../models/accountModel';

const accountResolver = {
  account: async ({ id }, request) => {
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

    if (request.user.id != account.owner.id)
      throw new Error("Account isn't owned by the user");

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

  changeAccountName: async ({ accountId, newCustomName }, request) => {
    const account = await accountModel.findById(accountId).exec();

    if (request.user.id != account.owner.id)
      throw new Error("Account isn't owned by the user");

    account.customName = newCustomName;
    account.save();

    return account;
  },
};

export default accountResolver;
