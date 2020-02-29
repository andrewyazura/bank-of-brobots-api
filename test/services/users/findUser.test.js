import accountModel from '../../../src/models/accountModel.js';
import findUser from '../../../src/services/users/findUser';
import userModel from '../../../src/models/userModel.js';
import setupDB from '../../setupDatabase';

setupDB('find-user-test');

describe('findUser', () => {
  test('single user', async () => {
    const user = await userModel.create({
      name: 'John',
      telegram_id: '51314124',
    });

    const obj = await findUser(user._id);

    expect(obj.toObject()).toMatchObject(user.toObject());
  });

  test('multiple users', async () => {
    const user = await userModel.create({
      name: 'John',
      telegram_id: '51314124',
    });

    await userModel.create({
      name: 'Jonny',
      telegram_id: '51983124',
    });

    const obj = await findUser(user._id);

    expect(obj.toObject()).toMatchObject(user.toObject());
  });

  test('fake user', async () => {
    const user = await userModel.create({
      name: 'John',
      telegram_id: '51314124',
    });

    await userModel.findByIdAndDelete(user._id);

    const obj = await findUser(user._id);

    expect(obj).toBeNull();
  });
});
