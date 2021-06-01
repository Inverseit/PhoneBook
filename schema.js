const schema = `
  type User {
    id: ID!
    name: String!
    number: String!
  }

  type Query {
    users: [User!]!
  }
  
  type Mutation {
    createUser(name: String, number: String): User
  }
`;

module.exports = schema;
