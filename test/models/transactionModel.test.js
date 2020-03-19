import userModel from '../../src/models/userModel.js';
import transactionModel from '../../src/models/transactionModel.js';
import setupDB from '../setupDatabase';

setupDB('transaction-model-test');

describe('transaction model', () => {
  test('create', async () => {
    let fromUser = await userModel({ name: 'x', telegram_id: '01234567890' }),
      toUser = await userModel({ name: 'y', telegram_id: '11234567890' });

    let money = 5000;

    const obj = await transactionModel.create({
      fromUser,
      toUser,
      money,
    });

    const expected = {
      fromUser: fromUser.toObject(),
      toUser: toUser.toObject(),
      money,
    };

    expect(obj.toObject()).toMatchObject(expected);
  });
});
