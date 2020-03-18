import userModel from '../../../src/models/userModel.js';
import setupDB from '../../setupDatabase';
import getPayments from '../../../src/services/subscriptions/getPayments';
import findUser from '../../../src/services/users/findUser';

setupDB('get-payments-test');

describe('getPayments', () => {
  test('free plan', async () => {
    let user = await userModel.create({
      name: 'x',
      telegram_id: '01234567890',
      money: 10,
    });

    await getPayments();

    user = await findUser(user._id);

    expect(user.money).toBe(10);
  });

  test('basic plan', async () => {
    let user = await userModel.create({
      name: 'x',
      telegram_id: '01234567890',
      money: 10,
      planCost: 10,
    });

    await getPayments();

    user = await findUser(user._id);

    expect(user.money).toBe(0);
  });
});
