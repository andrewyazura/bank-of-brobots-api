import transactionModel from '../../../src/models/transactionModel';
import findUser from '../../../src/services/users/findUser';
import userModel from '../../../src/models/userModel.js';
import setupDB from '../../setupDatabase';

setupDB('find-user-test');

describe('findUser', () => {
  test('single user', async () => {
    const user = await userModel.create({
      name: 'x',
      telegram_id: '01234567890',
    });

    const obj = await findUser(user._id);

    expect(obj.toObject()).toMatchObject(user.toObject());
  });

  test('multiple users', async () => {
    const user = await userModel.create({
      name: 'x',
      telegram_id: '01234567890',
    });

    await userModel.create({
      name: 'y',
      telegram_id: '11234567890',
    });

    const obj = await findUser(user._id);

    expect(obj.toObject()).toMatchObject(user.toObject());
  });

  test('fake user', async () => {
    const user = await userModel.create({
      name: 'x',
      telegram_id: '01234567890',
    });

    await userModel.findByIdAndDelete(user._id);

    const obj = await findUser(user._id);

    expect(obj).toBeNull();
  });
});
