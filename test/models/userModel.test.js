import userModel from '../../src/models/userModel.js';
import setupDB from '../setupDatabase';

setupDB('user-model-test');

describe('user model', () => {
  test('create', async () => {
    let name = 'John Doe';
    let email = 'john@doe.com';

    const obj = await userModel.create({
      name,
      email,
      password: '1234',
    });

    const expected = {
      name,
      email,
      isAdmin: false,
      accounts: [],
    };

    expect(obj.toObject()).toMatchObject(expected);
  });
});
