import findUser from '../services/users/findUser';

export default async (userId, money) => {
  const user = await findUser(userId);

  if (money < 0 && user.money < Math.abs(money)) return false;

  user.money += money;
  await user.save();

  return true;
};
