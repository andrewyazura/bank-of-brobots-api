import addMoney from '../../services/addMoney';
import allTransactions from '../../services/allTransactions';
import allUsers from '../../services/users/allUsers';
import findUser from '../../services/users/findUser';

const adminResolver = {
  users: async (args, request) => {
    const user = await findUser(request.user.id);

    if (!user.isAdmin) throw new Error('Only admins can use this endpoint');

    const users = await allUsers();

    return users;
  },

  transactions: async (args, request) => {
    const user = await findUser(request.user.id);

    if (!user.isAdmin) throw new Error('Only admins can use this endpoint');

    const transactions = await allTransactions();
    return transactions;
  },

  addMoney: async ({ userId, money, message }, request) => {
    const user = await findUser(request.user.id);

    if (!user.isAdmin) throw new Error('Only admins can use this endpoint');

    return await addMoney(userId, money, message);
  },
};

export default adminResolver;
