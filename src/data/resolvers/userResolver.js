import { subscriptions } from '../../config';
import transactionModel from '../../models/transactionModel';
import addMoney from '../../services/addMoney';
import findUser from '../../services/users/findUser';

const userResolver = {
  user: async ({ id }, request) => {
    const user = await findUser(id);

    if (request.user.id != id)
      throw new Error("User can't see other users' data");

    return user;
  },

  transfer: async (
    { from_user_id, to_user_id, money, message = '' },
    request,
  ) => {
    const user1 = await findUser(from_user_id);
    const user2 = await findUser(to_user_id);
    const user = await findUser(request.user.id);

    if (user._id != from_user_id) throw new Error('Wrong user ID');

    if (money > user1.money) throw new Error('Sender has not enough money');
    if (user.weekLeft !== null) {
      if (money > user.weekLeft)
        throw new Error("It's over sender's week limit");
      user.weekLeft -= money;
    }

    const transaction = await transactionModel.create({
      fromUser: from_user_id,
      toUser: to_user_id,
      money,
      message,
    });

    user1.transactions.push(transaction);
    user2.transactions.push(transaction);

    user1.money -= money;
    user2.money += money;

    await user.save();
    await user1.save();
    await user2.save();

    return transaction;
  },

  changeSubscription: async ({ subscriptionId, userId }, request) => {
    const subscription = subscriptions[subscriptionId] || null;
    const user = await findUser(request.user.id);

    if (request.user.id != user.id) throw new Error('Wrong user ID');

    if (user.isAdmin) throw new Error("Admins can't change their plan!");

    if (subscription) {
      if (await addMoney(userId, -subscription.cost)) {
        user.weekLimit = subscription.limit;
        user.weekLeft = subscription.limit;
        user.planCost = subscription.cost;
        user.planName = subscription.name;
        user.planId = subscriptionId;
      } else throw new Error('Not enough money');
    } else throw new Error('No such subscription');

    await user.save();

    return subscription;
  },
};

export default userResolver;
