const { gql } = require('apollo-server')
const stripeApi = require('stripe')(process.env.STRIPE_SECRET_KEY)
// Import SuccessResponse
const SuccessResponse = require('../common/SuccessResponse')
// Import ErrorResponse
const ErrorResponse = require('../common/ErrorResponse')
const ServerStatuses = require('../common/ServerStatusCodes')
// Typedefs
// --------
const typeDefs = gql`
  type Test {
    id: String
    tokenId: String
  }
  input TestInput {
    id: String
    tokenId: String
  }

  extend type Query {
    test(input: TestInput): Test
  }
`

// Resolvers
// ---------

const resolvers = {
  Query: { test },
}

function test(root, { input }) {
  console.log(input)
  return stripeApi.charges
    .create({
      amount: 300,
      currency: 'eur',
      source: input.id,
      description: ': )',
    })
    .then(result => {
      console.log('[FROM STRIPE]', result, ':::')
    })
    .catch(error => {
      console.error('[STRIPE ERROR]', error)
    })
}

module.exports = { resolvers, typeDefs }
