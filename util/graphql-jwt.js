const { defaultFieldResolver } = require('graphql')
const errors = require('restify-errors')
const jwt = require('jsonwebtoken')
const { gql, SchemaDirectiveVisitor } = require('apollo-server')

const { checkMFAUser } = require('./totp')

require('dotenv').config()

async function getUserFromReq({ req }) {
  const header = req.headers.authorization || ''
  const token = (header.match(/^JWT (.+)$/) || [])[1]
  if (!token) {
    return {}
  }

  const user = jwt.verify(token, process.env.JWT_SECRET)
  if (user) {
    const error = await checkMFAUser({
      email: user.email,
      token: req.headers['x-totp-token'],
    })
    if (error) {
      throw error
    }
  }
  return { user }
}

// For some reason `getDirectiveDeclaration` is gloriously
// ignored here, no idea why. We get "unknown directive"
// errors. So I had to revert to schema declarations in
// `typeDefs` :'-(
const authTypeDefs = gql`
  """
  Ensures there is an authenticated used, possibly with a given role,
  before accessing a field.
  """
  directive @auth(role: Role) on FIELD_DEFINITION
`

class AuthDirective extends SchemaDirectiveVisitor {
  ensureFieldsWrapped(objectType) {
    if (objectType.__authFieldsWrapped) {
      return
    }

    for (const [fieldName, field] of Object.entries(objectType.getFields())) {
      const { resolve: origResolver = defaultFieldResolver } = field
      field.resolve = function authenticatedResolve(...args) {
        const context = args[2]

        if (!field.hasOwnProperty('__requiredAuthRole')) {
          return origResolver.apply(this, args)
        }

        if (!context.user) {
          throw new errors.NotAuthorizedError(
            `${fieldName} requires authentication`
          )
        }

        const role = (field.__requiredAuthRole || '').toLowerCase()
        if (role && !context.user[role]) {
          throw new errors.NotAuthorizedError(
            `${fieldName} requires the authenticated user to have role ${
              field.__requiredAuthRole
            }`
          )
        }

        // WARNING! THIS IS NOT GOING TO WORK FOR MUTATIONS/QUERIES
        return origResolver.apply(this, args)
      }
    }

    objectType.__authFieldsWrapped = true
  }

  visitFieldDefinition(field, details) {
    this.ensureFieldsWrapped(details.objectType)
    field.__requiredAuthRole = this.args.role
  }
}

module.exports = {
  auth: {
    directive: AuthDirective,
    typeDefs: authTypeDefs,
  },
  getUserFromReq,
}
