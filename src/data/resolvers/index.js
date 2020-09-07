import adminResolver from './adminResolver';
import transactionResolver from './transactionResolver';
import userResolver from './userResolver';

export default {
  ...userResolver,
  ...adminResolver,
  ...transactionResolver,
};
