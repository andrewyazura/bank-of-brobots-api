import transactionModel from '../../../src/models/transactionModel';
import findUserByTelegram from '../../../src/services/users/findUserByTelegram';
import userModel from '../../../src/models/userModel.js';
import setupDB from '../../setupDatabase';

setupDB('find-user-telegram-test');

describe('findUserByTelegram', () => {
  test('single user', async () => {
    const user = await userModel.create({
      name: 'x',
      telegram_id: '01234567890',
      username: 'xxxx',
    });

    const obj = await findUserByTelegram(user.telegram_id);

    expect(obj.toObject()).toMatchObject(user.toObject());
  });

  test('multiple users', async () => {
    const user = await userModel.create({
      name: 'x',
      telegram_id: '01234567890',
      username: 'xxxx',
    });

    await userModel.create({
      name: 'y',
      telegram_id: '11234567890',
      username: 'yyyy',
    });

    const obj = await findUserByTelegram(user.telegram_id);

    expect(obj.toObject()).toMatchObject(user.toObject());
  });

  test('fake user', async () => {
    const user = await userModel.create({
      name: 'x',
      telegram_id: '01234567890',
      username: 'xxxx',
    });

    await userModel.findByIdAndDelete(user._id);

    const obj = await findUserByTelegram(user.telegram_id);

    expect(obj).toBeNull();
  });
});
