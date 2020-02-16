import adminResolver from '../../../src/data/resolvers/adminResolver';
import transactionModel from '../../../src/models/transactionModel';
import userModel from '../../../src/models/userModel.js';
import accountModel from '../../../src/models/accountModel.js';
import findAccount from '../../../src/services/accounts/findAccount';
import setupDB from '../../setupDatabase';

setupDB('admin-resolver-test');

describe('admin resolver', () => {
  test('users endpoint', async () => {
    let name = 'John Doe',
      email = 'john@doe.com';

    const admin = await userModel.create({
      name,
      email,
      password: '123',
      isAdmin: true,
    });

    const users = await adminResolver.users({}, { user: { id: admin._id } });

    if (users.length > 0) {
      expect(users[0].toObject()).toMatchObject(admin.toObject());
    }
  });

  test('accounts endpoint', async () => {
    let name = 'John Doe',
      email = 'john@doe.com';

    const admin = await userModel.create({
      name,
      email,
      password: '123',
      isAdmin: true,
    });

    const account = await accountModel.create({
      owner: admin,
    });

    const accounts = await adminResolver.accounts(
      {},
      { user: { id: admin._id } },
    );

    if (accounts.length > 0) {
      expect(accounts[0].toObject()).toMatchObject(account.toObject());
    }
  });

  test('transactions endpoint', async () => {
    let name = 'John Doe',
      email = 'john@doe.com';

    const admin = await userModel.create({
      name,
      email,
      password: '123',
      isAdmin: true,
    });

    const acc1 = await accountModel.create({
      owner: admin,
      money: 500,
    });

    const acc2 = await accountModel.create({
      owner: admin,
    });

    const tr = await transactionModel.create({
      fromAccount: acc1,
      toAccount: acc2,
      money: 500,
    });

    const transactions = await adminResolver.transactions(
      {},
      { user: { id: admin._id } },
    );

    if (transactions.length > 0) {
      expect(transactions[0].toObject()).toMatchObject(tr.toObject());
    }
  });

  test('addMoney endpoint', async () => {
    let name = 'John Doe',
      email = 'john@doe.com';

    const admin = await userModel.create({
      name,
      email,
      password: '123',
      isAdmin: true,
    });

    let acc1 = await accountModel.create({
      owner: admin,
    });

    await adminResolver.addMoney(
      { accountId: acc1._id, money: 500 },
      { user: { id: admin._id } },
    );

    acc1 = await findAccount(acc1._id);

    expect(acc1.money).toBe(500);
  });
});
