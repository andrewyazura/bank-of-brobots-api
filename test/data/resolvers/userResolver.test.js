import userResolver from '../../../src/data/resolvers/userResolver';
import userModel from '../../../src/models/userModel.js';
import accountModel from '../../../src/models/accountModel.js';
import { subscriptions } from '../../../src/config';
import findUser from '../../../src/services/users/findUser';
import findAccount from '../../../src/services/accounts/findAccount';
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

  test('changeSubscription endpoint', async () => {
    const owner = await userModel.create({
      name: 'John',
      email: 'john@404.com',
      password: '123',
    });

    const account = await accountModel.create({ money: 100, owner }),
      subs = subscriptions[1];

    const result = {
      weekLimit: subs.limit,
      weekLeft: subs.limit,
      planCost: subs.cost,
      planName: subs.name,
    };

    await userResolver.changeSubscription(
      {
        subscriptionId: 1,
        accountId: account._id,
      },
      { user: { id: owner._id } },
    );

    expect((await findUser(owner._id)).toObject()).toMatchObject(result);
  });

  test('changeSubscription endpoint #2', async () => {
    const owner = await userModel.create({
      name: 'John',
      email: 'john@404.com',
      password: '123',
    });

    const account = await accountModel.create({ money: 100, owner }),
      subs = subscriptions[1];

    await userResolver.changeSubscription(
      {
        subscriptionId: 1,
        accountId: account._id,
      },
      { user: { id: owner._id } },
    );

    expect((await findAccount(account._id)).money).toBe(100 - subs.cost);
  });
});
