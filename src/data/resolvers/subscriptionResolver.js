import { subscriptions } from '../../config';

const subscriptionResolver = {
  subscriptions: async (args, request) => {
    return subscriptions.slice(0, -1);
  },
};

export default subscriptionResolver;
