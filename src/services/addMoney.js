import findAccount from './findAccount';

export default async (accountId, money) => {
  const account = await findAccount(accountId);

  if (money < 0 && account.money < Math.abs(money)) return false;

  account.money += money;
  await account.save();

  return true;
};
