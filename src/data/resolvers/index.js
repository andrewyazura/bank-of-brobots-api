import accountResolver from './accountResolver';
import adminResolver from './adminResolver';
import subscriptionResolver from './subscriptionResolver';
import transactionResolver from './transactionResolver';
import userResolver from './userResolver';

export default {
  ...userResolver,
  ...accountResolver,
  ...adminResolver,
  ...transactionResolver,
  ...subscriptionResolver,
};
