import findUser from '../services/users/findUser';
import findUserByTelegram from '../services/users/findUserByTelegram';

export default async (req, res, next) => {
  let headers = req.headers;
  console.log(headers['host'])

  let regexp = /localhost:\d+/;

  if (regexp.test(headers['host'])) {
    if (headers['telegram_id']) {
      req.user = await findUserByTelegram(headers['telegram_id']);
    } else if (headers['id']) {
      req.user = await findUser(headers['id']);
    }
  }

  next();
};
