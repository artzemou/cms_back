const {
  DateTimeScalar,
  DateTime,
  EmailAddress,
  EmailAddressScalar,
  URLScalar,
  URL,
} = require('@saeris/graphql-scalars')

const customScalarsSchema = {
  typeDefs: [DateTimeScalar, EmailAddressScalar, URLScalar].join('\n'),
  resolvers: { DateTime, EmailAddress, URL },
}

module.exports = customScalarsSchema
