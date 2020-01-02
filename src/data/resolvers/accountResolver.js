import accountModel from '../../models/accountModel';
import findUser from '../../services/findUser';
import findAccount from '../../services/findAccount';

const accountResolver = {
  account: async ({ id }, request) => {
    const account = await findAccount(id);

    if (request.user.id != account.owner.id)
      throw new Error("Account isn't owned by the user");

    return account;
  },

  createAccount: async ({ customName }, request) => {
    const account = await accountModel.create({
      customName,
      owner: request.user.id.toString(),
    });
    const user = await findUser(request.user.id);

    user.accounts.push(account);
    user.save();
    account.save();

    return account;
  },

  changeAccountName: async ({ accountId, newCustomName }, request) => {
    const account = await findAccount(accountId);

    if (request.user.id != account.owner.id)
      throw new Error("Account isn't owned by the user");

    account.customName = newCustomName;
    account.save();

    return account;
  },
};

export default accountResolver;
