import accountResolver from '../../../src/data/resolvers/accountResolver';
import userModel from '../../../src/models/userModel.js';
import accountModel from '../../../src/models/accountModel.js';
import findAccount from '../../../src/services/accounts/findAccount';
import setupDB from '../../setupDatabase';

setupDB('transaction-resolver-test');

describe('transaction resolver', () => {
  test('no endpoint', () => {});
});
