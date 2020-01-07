import accountModel from '../../models/accountModel';
import findAccount from '../../services/findAccount';
import findUser from '../../services/findUser';

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
    await user.save();
    await account.save();

    return account;
  },

  changeAccountName: async ({ accountId, newCustomName }, request) => {
    const account = await findAccount(accountId);

    if (request.user.id != account.owner.id)
      throw new Error("Account isn't owned by the user");

    account.customName = newCustomName;
    await account.save();

    return account;
  },

  removeAccount: async ({ accountId }, request) => {
    const account = await findAccount(accountId);

    if (request.user.id != account.owner.id)
      throw new Error("Account isn't owned by the user");

    if (account.money < 0) throw new Error('Account balance is less than 0');

    await account.remove();
    return true;
  },
};

export default accountResolver;
