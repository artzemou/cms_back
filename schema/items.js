const { gql } = require('apollo-server-express')

const Item = require('../db/Item')

// Typedefs
// --------
const typeDefs = gql`
  type Item {
    id: ID
    content: String
    sort: Int
    imgPath: String
  }

  input ItemInput {
    content: String
    sort: Int
    imgPath: String
  }

  type DeleteItem {
    id: ID!
  }

  input DeleteItemInput {
    id: ID!
  }

  type UpdateItem {
    id: ID!
    content: String
    sort: Int
    imgPath: String
  }
  input UpdateItemInput {
    id: ID!
    content: String
    sort: Int
    imgPath: String
  }

  extend type Query {
    # posts: [Item]
    # GET Retrieve the resource from the server.
    # POST Create a resource on the server.
    # PUT Update the resource on the server.
    # DELETE Delete the resource from the server.
    allItems: [Item!]!
  }
  extend type Mutation {
    createItem(input: ItemInput!): Item!
    deleteItem(input: DeleteItemInput!): DeleteItem!
    updateItem(input: UpdateItemInput!): UpdateItem!
  }
`

// Resolvers
// ---------

const resolvers = {
  Mutation: { createItem, deleteItem, updateItem },
  Query: {
    allItems,
  },
}

async function allItems(root) {
  const { items } = await Item.getAll()
  return items
}

function createItem(root, { input }) {
  return Item.create(input)
}

function deleteItem(root, { input }) {
  return Item.deleteItem(root, input)
}

async function updateItem(root, { input }) {
  const updatedItem = Item.findByIdAndUpdate(input.id, {
    content: input.content,
    sort: input.sort,
    imgPath: input.imgPath,
  })
  return await updatedItem
}

module.exports = { resolvers, typeDefs }
