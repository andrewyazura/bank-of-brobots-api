import userResolver from '../../data/resolvers/userResolver';
import addMoney from '../addMoney';
import allUsers from '../users/allUsers';

export default async () => {
  const users = await allUsers();
  let payed = 0;

  for (let user of users) {
    if (await addMoney(user._id, -user.planCost, 'Monthly fee')) {
      ++payed;
      break;
    }

    if (!payed) {
      userResolver.changeSubscription(
        { subscriptionId: 0, userId: user._id },
        {
          user: { id: user._id },
        },
      );
    }
    payed = 0;
  }

  return true;
};
