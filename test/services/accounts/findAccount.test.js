import accountModel from '../../../src/models/accountModel.js';
import findAccount from '../../../src/services/accounts/findAccount';
import userModel from '../../../src/models/userModel.js';
import transactionModel from '../../../src/models/transactionModel';
import setupDB from '../../setupDatabase';

setupDB('find-account-test');

describe('findAccount', () => {
  test('single account', async () => {
    const owner = await userModel.create({
      name: 'John',
      email: 'john@404.com',
      password: '123',
    });

    const acc = await accountModel.create({
      owner,
    });

    const obj = await findAccount(acc._id);

    expect(obj.toObject()).toMatchObject(acc.toObject());
  });

  test('multiple accounts', async () => {
    const owner = await userModel.create({
      name: 'John',
      email: 'john@404.com',
      password: '123',
    });

    const acc = await accountModel.create({
      owner,
    });

    await accountModel.create({
      owner,
    });

    const obj = await findAccount(acc._id);

    expect(obj.toObject()).toMatchObject(acc.toObject());
  });

  test('fake account', async () => {
    const owner = await userModel.create({
      name: 'John',
      email: 'john@404.com',
      password: '123',
    });

    const acc = await accountModel.create({
      owner,
    });

    await accountModel.findByIdAndDelete(acc._id);

    const obj = await findAccount(acc._id);

    expect(obj).toBeNull();
  });
});
