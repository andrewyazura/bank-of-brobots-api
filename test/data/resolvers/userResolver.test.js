import userResolver from '../../../src/data/resolvers/userResolver';
import userModel from '../../../src/models/userModel.js';
import { subscriptions } from '../../../src/config';
import findUser from '../../../src/services/users/findUser';
import setupDB from '../../setupDatabase';

setupDB('user-resolver-test');

describe('user resolver', () => {
  test('user endpoint', async () => {
    let name = 'x';
    let telegram_id = '01234567890';
    let username = 'xxx';

    const obj = await userModel.create({
      name,
      telegram_id,
      username,
    });

    const result = await userResolver.user(
      { id: obj._id },
      { user: { id: obj._id } },
    );

    expect(result.toObject()).toMatchObject(obj.toObject());
  });

  test('transfer endpoint', async () => {
    let fromUser = await userModel.create({
        name: 'x',
        telegram_id: '01234567890',
        username: 'xxxx',
        money: 10,
      }),
      toUser = await userModel.create({
        name: 'y',
        telegram_id: '11234567890',
        username: 'yyyy',
      });

    await userResolver.transfer(
      {
        from_user_id: fromUser._id,
        to_user_id: toUser._id,
        money: 10,
      },
      { user: { id: fromUser._id } },
    );

    fromUser = await findUser(fromUser._id);

    expect(fromUser.money).toBe(0);
  });
});
