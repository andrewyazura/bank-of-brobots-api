import subscriptionResolver from '../../../src/data/resolvers/subscriptionResolver';
import { subscriptions } from '../../../src/config';
import setupDB from '../../setupDatabase';

setupDB('subscription-resolver-test');

describe('subscription resolver', () => {
  test('subscription endpoint', async () => {
    let subs = await subscriptionResolver.subscriptions();

    expect(subs).toEqual(subscriptions.slice(0, -1));
  });
});
