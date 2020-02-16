import transactionModel from '../../models/transactionModel';
import findAccount from '../../services/accounts/findAccount';
import findUser from '../../services/users/findUser';
import { subscriptions } from '../../config';
import addMoney from '../../services/addMoney';

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
    const user = await findUser(request.user.id);

    if (user.id != account1.owner.id)
      throw new Error("Account isn't owned by the user");

    if (money > account1.money) throw new Error('Not enough money on account');
    if (user.weekLeft !== null) {
      if (money > user.weekLeft) throw new Error("It's over your week limit");
      user.weekLeft -= money;
    }

    const transaction = await transactionModel.create({
      fromAccount: from_account_id,
      toAccount: to_account_id,
      money,
    });

    account1.transactions.push(transaction);
    account2.transactions.push(transaction);

    account1.money -= money;
    account2.money += money;

    await user.save();
    await account1.save();
    await account2.save();

    return transaction;
  },

  changeSubscription: async ({ subscriptionId, accountId }, request) => {
    const subscription = subscriptions[subscriptionId] || null;
    const user = await findUser(request.user.id);
    const account = await findAccount(accountId);

    if (request.user.id != account.owner.id)
      throw new Error("Account isn't owned by the user");

    if (subscription) {
      if (await addMoney(accountId, -subscription.cost)) {
        user.weekLimit = subscription.limit;
        user.weekLeft = subscription.limit;
        user.planCost = subscription.cost;
        user.planName = subscription.name;
      } else throw new Error('Not enough money');
    } else throw new Error('No such subscription');

    await user.save();

    return subscription;
  },
};

export default userResolver;
