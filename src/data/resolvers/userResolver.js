import transactionModel from '../../models/transactionModel';
import findUser from '../../services/findUser';
import findAccount from '../../services/findAccount';

const userResolver = {
  user: async ({ id }, request) => {
    const user = await findUser(id);

    if (request.user.id != id)
      throw new Error("User can't see other users' data");

    return user;
  },

  transfer: async ({ from_account_id, to_account_id, money }, request) => {
    const account1 = await findAccount(from_account_id);
    const account2 = await findAccount(to_account_id);

    if (request.user.id != account1.owner.id)
      throw new Error("Account isn't owned by the user");

    const transaction = await transactionModel.create({
      fromAccount: from_account_id,
      toAccount: to_account_id,
      money,
    });

    account1.transactions.push(transaction);
    account2.transactions.push(transaction);

    account1.money -= money;
    account2.money += money;

    account1.save();
    account2.save();

    return transaction;
  },
};

export default userResolver;
