import allTransactions from '../../src/services/allTransactions';
import userModel from '../../src/models/userModel.js';
import transactionModel from '../../src/models/transactionModel';
import setupDB from '../setupDatabase';

setupDB('all-transactions-test');

describe('allTransactions', () => {
  test('single transaction', async () => {
    const fromUser = await userModel.create({
      name: 'x',
      telegram_id: '01234567890',
      username: 'xxxx',
      money: 100,
    });

    const toUser = await userModel.create({
      name: 'y',
      telegram_id: '11234567890',
      username: 'yyyy',
    });

    const tr = await transactionModel.create({
      fromUser,
      toUser,
      money: 100,
    });

    const transactions = await allTransactions();

    expect(transactions[0].toObject()).toMatchObject(tr.toObject());
  });

  test('multiple transactions', async () => {
    const fromUser = await userModel.create({
      name: 'x',
      telegram_id: '01234567890',
      username: 'xxxx',
      money: 100,
    });

    const toUser = await userModel.create({
      name: 'y',
      telegram_id: '11234567890',
      username: 'yyyy',
    });

    await transactionModel.create({
      fromUser,
      toUser,
      money: 50,
    });

    await transactionModel.create({
      fromUser,
      toUser,
      money: 50,
    });

    const transactions = await allTransactions();

    expect(transactions.length).toBe(2);
  });
});
