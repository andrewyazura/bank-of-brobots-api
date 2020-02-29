import accountModel from '../../../src/models/accountModel.js';
import allUsers from '../../../src/services/users/allUsers';
import userModel from '../../../src/models/userModel.js';
import setupDB from '../../setupDatabase';

setupDB('all-users-test');

describe('allUsers', () => {
  test('single user', async () => {
    const user = await userModel.create({
      name: 'John',
      telegram_id: '51314124',
    });

    const users = await allUsers();

    expect(users[0].toObject()).toMatchObject(user.toObject());
  });

  test('multiple users', async () => {
    await userModel.create({
      name: 'John',
      telegram_id: '51314124',
    });

    await userModel.create({
      name: 'Jonny',
      telegram_id: '511234124',
    });

    const users = await allUsers();

    expect(users.length).toBe(2);
  });
});
