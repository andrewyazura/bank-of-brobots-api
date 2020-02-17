import register from '../../src/services/register';
import setupDB from '../setupDatabase';

setupDB('register-test');

describe('registration', () => {
  test('new user', async () => {
    let name = 'John Doe';
    let email = 'john@doe.com';

    const result = await register(name, email, '123');

    expect(result).toMatchObject({
      name,
      email,
      isAdmin: false,
      accounts: [],
    });
  });

  test('duplicate', async () => {
    let name = 'John Doe';
    let email = 'john@doe.com';

    await register(name, email, '123');
    await expect(register(name, email, '123')).rejects.toThrow();
  });
});
