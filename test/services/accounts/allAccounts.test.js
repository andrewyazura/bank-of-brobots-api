import accountModel from '../../../src/models/accountModel.js';
import allAccounts from '../../../src/services/accounts/allAccounts';
import userModel from '../../../src/models/userModel.js';
import transactionModel from '../../../src/models/transactionModel';
import setupDB from '../../setupDatabase';

setupDB('all-accounts-test');

describe('allAccounts', () => {
  test('single account', async () => {
    const owner = await userModel.create({
      name: 'John',
      email: 'john@404.com',
      password: '123',
    });

    const acc = await accountModel.create({
      owner,
    });

    const accounts = await allAccounts();

    expect(accounts[0].toObject()).toMatchObject(acc.toObject());
  });

  test('multiple accounts', async () => {
    const owner = await userModel.create({
      name: 'John',
      email: 'john@404.com',
      password: '123',
    });

    await accountModel.create({
      owner,
    });

    await accountModel.create({
      owner,
    });

    const accounts = await allAccounts();

    expect(accounts.length).toBe(2);
  });
});
