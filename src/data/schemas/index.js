import { buildSchema } from 'graphql';
import fs from 'fs';
import path from 'path';

const schema = buildSchema(
  fs.readFileSync(path.join(__dirname, './schema.graphql'), {
    encoding: 'utf8',
  }),
);

export default schema;
