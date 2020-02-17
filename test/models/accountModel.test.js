import accountModel from '../../src/models/accountModel.js';
import setupDB from '../setupDatabase';

setupDB('account-model-test');

describe('account model', () => {
  test('create', async () => {
    let customName = 'Primary';

    const obj = await accountModel.create({
      customName,
    });

    const expected = {
      customName,
      money: 0,
      transactions: [],
    };

    expect(obj.toObject()).toMatchObject(expected);
  });
});
