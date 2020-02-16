import accountModel from '../../../src/models/accountModel.js';
import findUser from '../../../src/services/users/findUser';
import userModel from '../../../src/models/userModel.js';
import setupDB from '../../setupDatabase';

setupDB('find-user-test');

describe('findUser', () => {
  test('single user', async () => {
    const user = await userModel.create({
      name: 'John',
      email: 'john@404.com',
      password: '123',
    });

    const obj = await findUser(user._id);

    expect(user.toObject()).toMatchObject(obj.toObject());
  });

  test('multiple users', async () => {
    const user = await userModel.create({
      name: 'John',
      email: 'john@404.com',
      password: '123',
    });

    await userModel.create({
      name: 'Jonny',
      email: 'jonny@404.com',
      password: '1234',
    });

    const obj = await findUser(user._id);

    expect(user.toObject()).toMatchObject(obj.toObject());
  });

  test('fake user', async () => {
    const user = await userModel.create({
      name: 'John',
      email: 'john@404.com',
      password: '123',
    });

    await userModel.findByIdAndDelete(user._id);

    const obj = await findUser(user._id);

    expect(obj).toBeNull();
  });
});
