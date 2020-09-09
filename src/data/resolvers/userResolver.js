import transactionModel from '../../models/transactionModel';
import findUser from '../../services/users/findUser';

const userResolver = {
  user: async ({ id }, request) => {
    const user = await findUser(id);

    if (request.user.id != id)
      throw new Error("User can't see other users' data");

    return user;
  },

  userIdToTelegram: async ({ telegram_id }, request) => {
    if (request.user.telegram_id != telegram_id)
      throw new Error("User can't see other users' data");

    return request.user.id;
  },

  transfer: async (
    { from_user_id, to_user_id, money, message = '' },
    request,
  ) => {
    const user1 = await findUser(from_user_id);
    const user2 = await findUser(to_user_id);

    if (request.user.id != from_user_id) throw new Error('Wrong user ID');

    if (money > user1.money) throw new Error('Sender has not enough money');

    if (user1.weekLeft !== null) {
      if (money > user1.weekLeft)
        throw new Error("It's over sender's week limit");
      user1.weekLeft -= money;
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

    await user1.save();
    await user2.save();

    return transaction;
  },
};

export default userResolver;
