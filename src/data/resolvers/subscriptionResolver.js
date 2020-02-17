import { subscriptions } from '../../config';

const subscriptionResolver = {
  subscriptions: async (args, request) => {
    return subscriptions;
  },
};

export default subscriptionResolver;
