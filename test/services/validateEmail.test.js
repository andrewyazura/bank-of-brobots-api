import validateEmail from '../../src/services/validateEmail';

describe('validateEmail', () => {
  test('valid email', async () => {
    expect(validateEmail('andrew@gmail.com')).toBe(true);
  });

  test('invalid email', async () => {
    await expect(validateEmail('andrew404@com')).toBe(false);
  });
});
