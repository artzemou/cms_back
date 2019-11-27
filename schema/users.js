const { gql } = require('apollo-server')

const User = require('../db/User')

// TypeDefs
// --------

const typeDefs = gql`
  type User {
    id: ID
    createdAt: DateTime!
    email: EmailAddress!
    firstName: String!
    lastName: String!
    roles: [Role!]!
  }

  enum Role {
    ADMIN
    MANAGER
  }

  input SignUpInput {
    email: EmailAddress!
    firstName: String!
    lastName: String!
    password: String!
  }

  input LogInInput {
    email: EmailAddress!
    password: String!
  }

  type ToggleMFAPayload {
    enabled: Boolean!
    url: URL
  }

  extend type Mutation {
    logIn(input: LogInInput!): String
    signUp(input: SignUpInput!): String!
    toggleMFA(enabled: Boolean!): ToggleMFAPayload! @auth
  }
`

const resolvers = {
  Mutation: { logIn, signUp, toggleMFA },
}

// Resolvers
// ---------

async function logIn(root, { input: { email, password } }) {
  const { token } = await User.logIn(email, password)
  return token
}

async function signUp(
  root,
  { input: { email, firstName, lastName, password } }
) {
  const { token } = await User.signUp({ email, firstName, lastName, password })
  return token
}

async function toggleMFA(root, { enabled }, { user: { email } }) {
  const user = await User.findOne({ email })
  return user.toggleMFA(enabled)
}

module.exports = { resolvers, typeDefs }
