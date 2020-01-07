import accountResolver from '../../../src/data/resolvers/accountResolver';
import userModel from '../../../src/models/userModel.js';
import accountModel from '../../../src/models/accountModel.js';
import transactionModel from '../../../src/models/transactionModel';
import findAccount from '../../../src/services/findAccount';
import setupDB from '../../setupDatabase';

setupDB('account-resolver-test');

describe('account resolver', () => {
  test('account endpoint', async () => {
    const user = await userModel.create({
      name: 'x',
      email: 'y',
      password: 'z',
    });

    const obj = await accountModel.create({
      owner: user,
    });

    const result = await accountResolver.account(
      { id: obj._id },
      { user: { id: user._id } },
    );

    expect(result.toObject()).toMatchObject(obj.toObject());
  });

  test('createAccount endpoint', async () => {
    let customName = 'primary';

    const user = await userModel.create({
      name: 'x',
      email: 'y',
      password: 'z',
    });

    const obj = {
      customName,
      money: 0,
      transactions: [],
    };

    const result = await accountResolver.createAccount(
      { customName },
      { user: { id: user._id } },
    );

    expect(result.toObject()).toMatchObject(obj);
  });

  test('changeAccountName endpoint', async () => {
    let customName = 'primary',
      newCustomName = 'secondary';

    const user = await userModel.create({
      name: 'x',
      email: 'y',
      password: 'z',
    });

    const obj = {
      customName: newCustomName,
      money: 0,
      transactions: [],
    };

    let account = await accountResolver.createAccount(
      { customName },
      { user: { id: user._id } },
    );

    await accountResolver.changeAccountName(
      {
        accountId: account.id,
        newCustomName,
      },
      { user: { id: user._id } },
    );

    account = await findAccount(account.id);

    expect(account.toObject()).toMatchObject(obj);
  });

  test('removeAccount endpoint', async () => {});
});
