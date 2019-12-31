import { Router } from 'express';
import graphqlHTTP from 'express-graphql';

import register from '../../services/register';
import login from '../../services/login';
import schema from '../../data/schemas';
import resolvers from '../../data/resolvers';

const router = Router();

router.use('/register', async (req, res) => {
  let body = req.body;

  if (!body.name || !body.email || !body.password)
    res.status(400).send({ message: 'Not enough arguments given' });

  register(body.name, body.email, body.password)
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      let message =
        err.code == 11000
          ? 'Such user already exists'
          : 'Unknown error occurred';

      res.status(500).send({
        message,
      });
    });
});

router.use('/login', async (req, res) => {
  let body = req.body;

  if (!body.email || !body.password)
    res.status(400).send({ message: 'Not enough args' });

  login(body.email, body.password)
    .then((token) => {
      res.json({ token });
    })
    .catch((err) => {
      res.status(400).send({ message: 'Invalid credentials' });
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
