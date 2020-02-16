import userResolver from '../../data/resolvers/userResolver';
import addMoney from '../addMoney';
import allUsers from '../users/allUsers';

export default async () => {
  const users = await allUsers();
  let payed = 0;

  for (let user of users) {
    for (let account of user.accounts) {
      if (await addMoney(account, -user.planCost)) {
        ++payed;
        break;
      }

      if (!payed) {
        userResolver.changeSubscription(
          { subscriptionId: 0, accountId: user.accounts[0].id },
          {
            user: { id: user._id },
          },
        );
      }
    }
  }

  return true;
};
