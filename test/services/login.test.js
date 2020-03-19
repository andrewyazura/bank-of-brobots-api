import register from '../../src/services/register';
import login from '../../src/services/login';
import setupDB from '../setupDatabase';

setupDB('login-test');

describe('login', () => {
  test('existing user', async () => {
    let name = 'x';
    let telegram_id = '01234567890';

    await register(name, telegram_id);

    const result = await login(telegram_id);

    expect(typeof result).toBe('string');
  });

  test('fake user', async () => {
    let telegram_id = '01234567890';

    await expect(login(telegram_id)).rejects.toThrow();
  });
});
