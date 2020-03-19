import adminResolver from './adminResolver';
import subscriptionResolver from './subscriptionResolver';
import transactionResolver from './transactionResolver';
import userResolver from './userResolver';

export default {
  ...userResolver,
  ...adminResolver,
  ...transactionResolver,
  ...subscriptionResolver,
};
