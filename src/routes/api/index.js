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
    res.status(400).send({ message: 'Not enough args' });

  const user = await register(body.name, body.email, body.password);
  res.json(user);
});

router.use('/login', async (req, res) => {
  let body = req.body;

  if (!body.email || !body.password)
    res.status(400).send({ message: 'Not enough args' });

  const token = await login(body.email, body.password);
  res.json({ token });
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
