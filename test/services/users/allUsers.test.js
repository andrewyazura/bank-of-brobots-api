import accountModel from '../../../src/models/accountModel.js';
import allUsers from '../../../src/services/users/allUsers';
import userModel from '../../../src/models/userModel.js';
import setupDB from '../../setupDatabase';

setupDB('all-users-test');

describe('allUsers', () => {
  test('single user', async () => {
    const user = await userModel.create({
      name: 'John',
      email: 'john@404.com',
      password: '123',
    });

    const users = await allUsers();

    expect(users[0].toObject()).toMatchObject(user.toObject());
  });

  test('multiple users', async () => {
    await userModel.create({
      name: 'John',
      email: 'john@404.com',
      password: '123',
    });

    await userModel.create({
      name: 'Jonny',
      email: 'jonny@404.com',
      password: '1234',
    });

    const users = await allUsers();

    expect(users.length).toBe(2);
  });
});
