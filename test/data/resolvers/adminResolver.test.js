import adminResolver from '../../../src/data/resolvers/adminResolver';
import transactionModel from '../../../src/models/transactionModel';
import userModel from '../../../src/models/userModel.js';
import setupDB from '../../setupDatabase';
import findUser from '../../../src/services/users/findUser';

setupDB('admin-resolver-test');

describe('admin resolver', () => {
  test('users endpoint', async () => {
    let name = 'x',
      telegram_id = '01234567890';

    const admin = await userModel.create({
      name,
      telegram_id,
      is_admin: true,
    });

    const users = await adminResolver.users({}, { user: { id: admin._id } });

    expect(users[0].toObject()).toMatchObject(admin.toObject());
  });

  test('transactions endpoint', async () => {
    let name = 'x',
      telegram_id = '01234567890';

    const admin = await userModel.create({
      name,
      telegram_id,
      is_admin: true,
    });

    await transactionModel.create({
      fromUser: admin._id,
      money: 500,
    });

    const transactions = await adminResolver.transactions(
      {},
      { user: { id: admin._id } },
    );

    let result = transactions[0].fromUser.toObject();

    expect(result).toMatchObject(admin.toObject());
  });

  test('addMoney endpoint', async () => {
    let name = 'x',
      telegram_id = '01234567890';

    let admin = await userModel.create({
      name,
      telegram_id,
      is_admin: true,
    });

    await adminResolver.addMoney(
      { userId: admin._id, money: 500 },
      { user: { id: admin._id } },
    );

    admin = await findUser(admin._id);

    expect(admin.money).toBe(500);
  });
});
