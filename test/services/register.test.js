import register from '../../src/services/register';
import setupDB from '../setupDatabase';

setupDB('register-test');

describe('registration', () => {
  test('new user', async () => {
    let name = 'x';
    let telegram_id = '01234567890';

    const result = await register(name, telegram_id);

    expect(result).toMatchObject({
      name,
      telegram_id,
      is_admin: false,
      money: 0,
    });
  });

  test('duplicate', async () => {
    let name = 'x';
    let telegram_id = '01234567890';

    await register(name, telegram_id);
    await expect(register(name, telegram_id)).rejects.toThrow();
  });
});
