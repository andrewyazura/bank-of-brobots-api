import accountModel from '../../src/models/accountModel.js';
import transactionModel from '../../src/models/transactionModel.js';
import setupDB from '../setupDatabase';

setupDB('transaction-model-test');

describe('transaction model', () => {
  test('create', async () => {
    let fromAccount = await accountModel.create({}),
      toAccount = await accountModel.create({});

    let money = 5000;

    const obj = await transactionModel.create({
      fromAccount,
      toAccount,
      money,
    });

    const expected = {
      fromAccount: fromAccount.toObject(),
      toAccount: toAccount.toObject(),
      money,
    };

    expect(obj.toObject()).toMatchObject(expected);
  });
});
