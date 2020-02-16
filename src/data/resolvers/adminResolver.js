import allAccounts from '../../services/allAccounts';
import allTransactions from '../../services/allTransactions';
import allUsers from '../../services/allUsers';
import addMoney from '../../services/addMoney';
import findUser from '../../services/findUser';

const adminResolver = {
  users: async (args, request) => {
    const user = await findUser(request.user.id);

    if (!user.isAdmin) throw new Error('Only admins can use this endpoint');

    const users = await allUsers();

    return users;
  },

  accounts: async (args, request) => {
    const user = await findUser(request.user.id);

    if (!user.isAdmin) throw new Error('Only admins can use this endpoint');

    const accounts = await allAccounts();
    return accounts;
  },

  transactions: async (args, request) => {
    const user = await findUser(request.user.id);

    if (!user.isAdmin) throw new Error('Only admins can use this endpoint');

    const transactions = await allTransactions();
    return transactions;
  },

  addMoney: async ({ accountId, money }, request) => {
    const user = await findUser(request.user.id);

    if (!user.isAdmin) throw new Error('Only admins can use this endpoint');

    return await addMoney(accountId, money);
  },
};

export default adminResolver;
