import userResolver from '../../../src/data/resolvers/userResolver';
import userModel from '../../../src/models/userModel.js';
import accountModel from '../../../src/models/accountModel.js';
import findAccount from '../../../src/services/findAccount';
import setupDB from '../../setupDatabase';

setupDB('user-resolver-test');

describe('user resolver', () => {
  test('user endpoint', async () => {
    let name = 'John Doe';
    let email = 'john@doe.com';

    const obj = await userModel.create({
      name,
      email,
      password: '1234',
    });

    const result = await userResolver.user(
      { id: obj._id },
      { user: { id: obj._id } },
    );

    expect(result.toObject()).toMatchObject(obj.toObject());
  });

  test('transfer endpoint', async () => {
    let owner = await userModel.create({
      name: 'John',
      email: 'john@404.com',
      password: '123',
    });

    let fromAccount = await accountModel.create({ money: 100, owner }),
      toAccount = await accountModel.create({});

    await userResolver.transfer(
      {
        from_account_id: fromAccount._id,
        to_account_id: toAccount._id,
        money: 40,
      },
      { user: { id: owner._id } },
    );

    fromAccount = await findAccount(fromAccount._id);

    expect(fromAccount.money).toBe(60);
  });
});
