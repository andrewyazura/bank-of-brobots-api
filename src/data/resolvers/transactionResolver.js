import findUser from '../../services/findUser';
import allTransactions from '../../services/allTransactions';

const transactionResolver = {
  transactions: async (args, request) => {
    const user = await findUser(request.user.id);

    if (!user.isAdmin) throw new Error('Only admins can use this endpoint');

    const transactions = await allTransactions();
    return transactions;
  },
};

export default transactionResolver;
