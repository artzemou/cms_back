const { gql } = require('apollo-server')

const Page = require('../db/Page')

// Typedefs
// --------
const typeDefs = gql`
  type Page {
    id: ID
    name: String!
    sort: Int
  }

  input PageInput {
    name: String!
    sort: Int
  }

  type DeletePage {
    id: ID!
  }

  input DeletePageInput {
    id: ID!
  }

  type UpdatePage {
    id: ID!
    name: String!
    sort: Int
  }

  input UpdatePageInput {
    id: ID!
    name: String!
    sort: Int
  }

  extend type Query {
    # posts: [Page]
    # GET Retrieve the resource from the server.
    # POST Create a resource on the server.
    # PUT Update the resource on the server.
    # DELETE Delete the resource from the server.
    allPages: [Page!]!
  }
  extend type Mutation {
    createPage(input: PageInput!): Page!
    deletePage(input: DeletePageInput!): DeletePage!
    updatePage(input: UpdatePageInput!): UpdatePage!
  }
`

// Resolvers
// ---------

const resolvers = {
  Mutation: { createPage, deletePage, updatePage },
  Query: {
    allPages,
  },
}

async function allPages(root) {
  const { pages } = await Page.getAll()
  return pages
}

function createPage(root, { input }) {
  return Page.create(input)
}

function deletePage(root, { input }) {
  return Page.deletePage(root, input)
}

// function updatePage(root, { input }) {
//   return Page.updatePage(root, input)
// }

async function updatePage(root, { input }) {
  const updatedPage = Page.findByIdAndUpdate(input.id, {
    name: input.name,
    sort: input.sort,
  })
  return await updatedPage
}

module.exports = { resolvers, typeDefs }
