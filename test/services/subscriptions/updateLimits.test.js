import transactionModel from '../../../src/models/transactionModel.js';
import userModel from '../../../src/models/userModel.js';
import setupDB from '../../setupDatabase';
import updateLimits from '../../../src/services/subscriptions/updateLimits';
import findUser from '../../../src/services/users/findUser';

setupDB('update-limits-test');

describe('updateLimits', () => {
  test('no changes', async () => {
    let user = await userModel.create({
      name: 'x',
      telegram_id: '01234567890',
    });

    await updateLimits();
    user = await findUser(user._id);

    expect(user.weekLeft).toBe(100);
  });

  test('changes needed', async () => {
    let user = await userModel.create({
      name: 'x',
      telegram_id: '01234567890',
      weekLeft: 10,
    });

    await updateLimits();
    user = await findUser(user._id);

    expect(user.weekLeft).toBe(100);
  });
});
