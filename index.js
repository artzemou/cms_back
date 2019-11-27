const { ApolloServer } = require('apollo-server')

const chalk = require('chalk')

require('dotenv').config()

const PORT = process.env.PORT || 4000

const connection = require('./db/connection')
const { auth, getUserFromReq } = require('./util/graphql-jwt')
const { DEFAULT_CORS_OPTIONS: cors } = require('./util/middlewares')

// const { filesUpload } = require('./util/filesUpload')
// const copyFile = require('./util/copyFile')
// filesUpload.dbGet()
// const { filesUpload } = require('./util/filesUpload')
// const copyFile = requserver.applyMiddleware({ app })ire('./util/copyFile')
// filesUpload.dbGet()
// copyFile()

let { resolvers, typeDefs, validationRules } = require('./schema')

const options = {
  cors,
  resolvers,
  typeDefs,
}

connection.on('open', initServer)

function cleanUp(server) {
  console.log(chalk`{cyan ${server.name} REST server shutting down…}`)
  server.close(async () => {
    await connection.close()
    console.log(chalk`{green ${server.name} REST server shutdown complete}`)
  })
}

async function initServer() {
  const server = new ApolloServer(options)

  const { url } = await server.listen(PORT)
  console.log(
    chalk`🚀  {green Server is running on localhost:} {cyan.underline ${url}}`
  )

  process.on('SIGTERM', () => cleanUp(server))
}
