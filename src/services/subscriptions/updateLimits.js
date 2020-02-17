import allUsers from '../users/allUsers';

export default async () => {
  const users = await allUsers();

  for (let user of users) {
    user.weekLeft = user.weekLimit;
    await user.save();
  }

  return true;
};
