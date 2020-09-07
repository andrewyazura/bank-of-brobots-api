import { Router } from 'express';
import graphqlHTTP from 'express-graphql';

import register from '../../services/register';
import schema from '../../data/schemas';
import resolvers from '../../data/resolvers';

const router = Router();

router.use('/register', async (req, res) => {
  let body = req.body;

  if (!body.name || !body.telegram_id) {
    res.status(400).send({ message: 'Not enough arguments given' });
    return;
  }

  register(body.name, body.telegram_id)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      if (err.code == 11000) {
        let duplicatedKey = Object.keys(err.keyValue)[0];

        res.status(400).send({
          message: `User with such ${duplicatedKey} already exists`,
          duplicatedKey,
        });
      } else {
        res.status(500).send({
          message: 'Unknown error occurred',
        });
      }
    });
});

router.use(
  '/',
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  }),
);

export default router;
