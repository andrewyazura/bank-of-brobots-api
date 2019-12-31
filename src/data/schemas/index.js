import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type User {
    id: ID!
    isAdmin: Boolean
    name: String!
    email: String!
    accounts: [Account]
  }

  type Account {
    id: ID!
    customName: String
    money: Int
    owner: User!
    transactions: [Transaction]
  }

  type Transaction {
    id: ID!
    fromAccount: Account!
    toAccount: Account!
    money: Int!
  }

  type Query {
    user(id: ID!): User!

    account(id: ID!): Account!
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!
    transfer(from_account_id: ID!, to_account_id: ID!, money: Int!): Transaction!

    createAccount(customName: String): Account!
  }
`);

export default schema;
