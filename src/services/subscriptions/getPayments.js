import userResolver from '../../data/resolvers/userResolver';
import addMoney from '../addMoney';
import allUsers from '../users/allUsers';

export default async () => {
  const users = await allUsers();

  for (let user of users) {
    if (user.isAdmin) {
      userResolver.changeSubscription(
        { subscriptionId: 3, userId: user._id },
        {
          user: { id: user._id },
        },
      );
    }

    if (await addMoney(user._id, -user.planCost, 'Monthly fee')) {
      continue;
    }

    userResolver.changeSubscription(
      { subscriptionId: 0, userId: user._id },
      {
        user: { id: user._id },
      },
    );
  }

  return true;
};
