const schema = `

  type User {
    user_id: ID!
    email: String!
    name: String!
    password: String!
  }

  type AuthData {
    user_id: ID!
    token: String!
    tokenExpiration: Int!
  }

  type Contact{
    contact_id: ID!
    name: String!
    number: String!
  }

  type Query {
    getAllContacts: [Contact!]!
    login(email: String!, password: String!): AuthData!
  }
  
  type Mutation {
    createContact(name: String!, number: String!): Contact!
    updateContact(id: Int!, name: String!, number: String!): Contact!
    deleteContact(id: Int!): Contact

    signup(email: String!, name: String!, password: String!, password2:String!): User
  }
`;

module.exports = schema;
