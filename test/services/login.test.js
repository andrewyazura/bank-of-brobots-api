import register from '../../src/services/register';
import login from '../../src/services/login';
import setupDB from '../setupDatabase';

setupDB('login-test');

describe('login', () => {
  test('existing user', async () => {
    let name = 'John Doe';
    let email = 'john@doe.com';

    await register(name, email, '123');

    const result = await login(email, '123');

    expect(typeof result).toBe('string');
  });

  test('fake user', async () => {
    let email = 'andrew@404.com';

    await expect(login(email, '123')).rejects.toThrow();
  });
});
