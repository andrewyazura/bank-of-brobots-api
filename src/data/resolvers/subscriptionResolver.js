import { subscriptions } from '../../config';

const subscriptionResolver = {
  subscriptions: async (args, request) => {
    subscriptions.pop();
    return subscriptions;
  },
};

export default subscriptionResolver;
