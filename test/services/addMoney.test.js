import addMoney from '../../src/services/addMoney';
import userModel from '../../src/models/userModel.js';
import setupDB from '../setupDatabase';
import findUser from '../../src/services/users/findUser';

setupDB('add-money-test');

describe('addMoney', () => {
  test('add money', async () => {
    let name = 'x';
    let telegram_id = '01234567890';
    let username = 'xxx';

    const admin = await userModel.create({
      name,
      telegram_id,
      username,
      is_admin: true,
    });

    await addMoney(admin._id, 500);

    let user = await findUser(admin._id);

    expect(user.money).toBe(500);
  });

  test('remove money', async () => {
    let name = 'x';
    let telegram_id = '01234567890';
    let username = 'xxx';

    const admin = await userModel.create({
      name,
      telegram_id,
      username,
      is_admin: true,
      money: 1000,
    });

    await addMoney(admin._id, -500);

    let user = await findUser(admin._id);

    expect(user.money).toBe(500);
  });
});
