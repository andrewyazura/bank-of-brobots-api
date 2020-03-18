import findUser from '../services/users/findUser';
import transactionModel from '../models/transactionModel';

export default async (userId, money, message = '') => {
  const user = await findUser(userId);

  const transaction = await transactionModel.create({
    fromUser: user._id,
    money,
    message,
  });

  if (money < 0 && user.money < Math.abs(money)) return false;

  user.transactions.push(transaction);
  user.money += money;
  await user.save();

  return true;
};
