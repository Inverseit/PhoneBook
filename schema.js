const schema = `
  type Contact {
    id: ID!
    name: String!
    number: String!
  }

  type Query {
    contacts: [Contact!]!
    one(id: Int!): Contact
  }
  
  type Mutation {
    createContact(name: String!, number: String!): Contact!
    updateContact(id: Int!, name: String!, number: String!): Contact!
    deleteContact(id: Int!): Contact
  }
`;

module.exports = schema;
