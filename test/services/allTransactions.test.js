import allTransactions from '../../src/services/allTransactions';
import userModel from '../../src/models/userModel.js';
import accountModel from '../../src/models/accountModel.js';
import transactionModel from '../../src/models/transactionModel';
import setupDB from '../setupDatabase';

setupDB('all-transactions-test');

describe('allTransactions', () => {
  test('single transaction', async () => {
    let name = 'John Doe';
    let telegram_id = '51314124';

    const admin = await userModel.create({
      name,
      telegram_id,
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

    const transactions = await allTransactions();

    expect(transactions[0].toObject()).toMatchObject(tr.toObject());
  });

  test('multiple transactions', async () => {
    let name = 'John Doe';
    let telegram_id = '51314124';

    const admin = await userModel.create({
      name,
      telegram_id,
      isAdmin: true,
    });

    const acc1 = await accountModel.create({
      owner: admin,
      money: 500,
    });

    const acc2 = await accountModel.create({
      owner: admin,
    });

    await transactionModel.create({
      fromAccount: acc1,
      toAccount: acc2,
      money: 500,
    });

    await transactionModel.create({
      fromAccount: acc2,
      toAccount: acc1,
      money: 100,
    });

    const transactions = await allTransactions();

    expect(transactions.length).toBe(2);
  });
});
