import { subscriptions } from '../../config';

const subscriptionResolver = {
  subscriptions: async (args, request) => {
    subscriptions.slice(0, -1);
    return subscriptions;
  },
};

export default subscriptionResolver;
