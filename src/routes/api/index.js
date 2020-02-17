import { Router } from 'express';
import graphqlHTTP from 'express-graphql';

import register from '../../services/register';
import login from '../../services/login';
import schema from '../../data/schemas';
import resolvers from '../../data/resolvers';
import validateEmail from '../../services/validateEmail';

const router = Router();

router.use('/register', async (req, res) => {
  let body = req.body;

  if (!body.name || !body.email || !body.password) {
    res.status(400).send({ message: 'Not enough arguments given' });
    return;
  }

  if (!validateEmail(body.email)) {
    res.status(400).send({ message: 'Invalid email' });
    return;
  }

  register(body.name, body.email, body.password)
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
