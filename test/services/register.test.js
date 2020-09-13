import register from '../../src/services/register';
import setupDB from '../setupDatabase';

setupDB('register-test');

describe('registration', () => {
  test('new user', async () => {
    let name = 'x';
    let telegram_id = '01234567890';
    let username = 'xxx';

    const result = await register(name, telegram_id, username);

    expect(result).toMatchObject({
      name,
      telegram_id,
      username,
      is_admin: false,
      money: 0,
    });
  });

  test('duplicate', async () => {
    let name = 'x';
    let telegram_id = '01234567890';
    let username = 'xxx';

    await register(name, telegram_id, username);
    await expect(register(name, telegram_id, username)).rejects.toThrow();
  });
});
