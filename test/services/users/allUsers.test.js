import transactionModel from '../../../src/models/transactionModel';
import allUsers from '../../../src/services/users/allUsers';
import userModel from '../../../src/models/userModel.js';
import setupDB from '../../setupDatabase';

setupDB('all-users-test');

describe('allUsers', () => {
  test('single user', async () => {
    const user = await userModel.create({
      name: 'x',
      telegram_id: '01234567890',
      username: 'xxxx',
    });

    const users = await allUsers();

    expect(users[0].toObject()).toMatchObject(user.toObject());
  });

  test('multiple users', async () => {
    await userModel.create({
      name: 'x',
      telegram_id: '01234567890',
      username: 'xxxx',
    });

    await userModel.create({
      name: 'y',
      telegram_id: '11234567890',
      username: 'yyyy',
    });

    const users = await allUsers();

    expect(users.length).toBe(2);
  });
});
