import userModel from '../../models/userModel';
import accountModel from '../../models/accountModel';
import transactionModel from '../../models/transactionModel';

const userResolver = {
  user: async ({ id }, request) => {
    const user = await userModel
      .findById(id)
      .populate('accounts')
      .populate({
        path: 'accounts',
        populate: {
          path: 'transactions',
        },
      })
      .populate({
        path: 'accounts',
        populate: {
          path: 'owner',
        },
      })
      .exec();

    return user;
  },

  transfer: async ({ from_account_id, to_account_id, money }, request) => {
    const transaction = await transactionModel.create({
      fromAccount: from_account_id,
      toAccount: to_account_id,
      money,
    });

    const account1 = await accountModel
      .findById(from_account_id)
      .populate('owner')
      .exec();
    const account2 = await accountModel.findById(to_account_id).exec();

    if (request.user.id != account1.owner.id)
      throw new Error("Account isn't owned by the user");

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
