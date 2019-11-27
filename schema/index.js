const { createComplexityLimitRule } = require('graphql-validation-complexity')
const depthLimit = require('graphql-depth-limit')
const merge = require('lodash.merge')

const { auth } = require('../util/graphql-jwt')
const authSchema = { typeDefs: auth.typeDefs }
const customScalarsSchema = require('./custom-scalars')
const tunesSchema = require('./tunes')
const usersSchema = require('./users')
const itemsSchema = require('./items')
const pagesSchema = require('./pages')
const stripeSchema = require('./stripe')
const uploadFileSchema = require('./uploadFile')

const schema = {
  ...mergeSchemas(
    authSchema,
    customScalarsSchema,
    tunesSchema,
    usersSchema,
    itemsSchema,
    pagesSchema,
    stripeSchema,
    uploadFileSchema
  ),
  validationRules: [createComplexityLimitRule(1000), depthLimit(10)],
}

module.exports = schema

// Helper functions

function mergeSchemas(...schemas) {
  return schemas.reduce(
    (acc, { typeDefs = '', resolvers = {} }) => {
      acc.typeDefs.push(typeDefs)
      merge(acc.resolvers, resolvers)
      return acc
    },
    { typeDefs: [], resolvers: {} }
  )
}
