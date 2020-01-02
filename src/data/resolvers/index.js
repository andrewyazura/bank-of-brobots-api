import accountResolver from './accountResolver';
import transactionResolver from './transactionResolver';
import userResolver from './userResolver';

export default { ...userResolver, ...accountResolver, ...transactionResolver };
