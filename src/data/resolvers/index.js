import accountResolver from './accountResolver';
import adminResolver from './adminResolver';
import transactionResolver from './transactionResolver';
import userResolver from './userResolver';

export default {
  ...userResolver,
  ...accountResolver,
  ...adminResolver,
  ...transactionResolver,
};
