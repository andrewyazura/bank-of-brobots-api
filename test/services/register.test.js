import register from '../../src/services/register';
import setupDB from '../setupDatabase';

setupDB('register-test');

describe('registration', () => {
  test('new user', async () => {
    let name = 'John Doe';
    let telegram_id = '51314124';

    const result = await register(name, telegram_id);

    expect(result).toMatchObject({
      name,
      telegram_id,
      isAdmin: false,
      accounts: [],
    });
  });

  test('duplicate', async () => {
    let name = 'John Doe';
    let telegram_id = '51314124';

    await register(name, telegram_id);
    await expect(register(name, telegram_id)).rejects.toThrow();
  });
});
