import userModel from '../../src/models/userModel.js';
import setupDB from '../setupDatabase';

setupDB('user-model-test');

describe('user model', () => {
  test('create', async () => {
    let name = 'x';
    let telegram_id = '01234567890';

    const obj = await userModel.create({
      name,
      telegram_id,
    });

    const expected = {
      name,
      telegram_id,
      isAdmin: false,
    };

    expect(obj.toObject()).toMatchObject(expected);
  });
});
