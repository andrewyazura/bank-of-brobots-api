import addMoney from '../../src/services/addMoney';
import userModel from '../../src/models/userModel.js';
import accountModel from '../../src/models/accountModel.js';
import findAccount from '../../src/services/accounts/findAccount';
import transactionModel from '../../src/models/transactionModel';
import setupDB from '../setupDatabase';

setupDB('add-money-test');

describe('', () => {
  test('add money', async () => {
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

    await addMoney(acc1._id, 500);

    acc1 = await findAccount(acc1._id);

    expect(acc1.money).toBe(500);
  });

  test('remove money', async () => {
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
      money: 1000,
    });

    await addMoney(acc1._id, -500);

    acc1 = await findAccount(acc1._id);

    expect(acc1.money).toBe(500);
  });
});
