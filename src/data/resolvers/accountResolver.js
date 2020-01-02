import accountModel from '../../models/accountModel';
import allAccounts from '../../services/allAccounts';
import findAccount from '../../services/findAccount';
import findUser from '../../services/findUser';

const accountResolver = {
  account: async ({ id }, request) => {
    const account = await findAccount(id);

    if (request.user.id != account.owner.id)
      throw new Error("Account isn't owned by the user");

    return account;
  },

  accounts: async (args, request) => {
    const user = await findUser(request.user.id);

    if (!user.isAdmin) throw new Error('Only admins can use this endpoint');

    const accounts = await allAccounts();
    return accounts;
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
