const schema = `
  type User {
    _id: ID!
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
