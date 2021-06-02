const schema = `
  type User {
    id: ID!
    name: String!
    number: String!
  }

  type Query {
    users: [User!]!
    one(id: Int!): User
  }
  
  type Mutation {
    createUser(name: String!, number: String!): User!
    updateUser(id: Int!, name: String!, number: String!): User!
    deleteUser(id: Int!): User
  }
`;

module.exports = schema;
