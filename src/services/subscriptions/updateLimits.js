import allUsers from '../users/allUsers';
import { subscriptions } from '../../config';

export default async () => {
  let subscription;
  const users = await allUsers();

  for (let user of users) {
    subscription = subscriptions[user.planId] || null;

    if (!subscription) continue;

    user.weekLimit = subscription.limit;
    user.weekLeft = subscription.limit;
    user.planCost = subscription.cost;
    user.planName = subscription.name;

    await user.save();
  }

  return true;
};
