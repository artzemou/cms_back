const mongoose = require('mongoose')
const urlRegex = require('url-regex')

const connection = require('./connection')

const pageSchema = new mongoose.Schema(
  {
    name: { type: String },
    sort: { type: Number },
  },
  {
    collation: { locale: 'en_US', strength: 1 },
    strict: 'throw',
    strictQuery: true,
    timestamps: true,
    useNestedStrict: true,
  }
)
pageSchema.index({ name: 'text' })
pageSchema.statics.getAll = getAll
pageSchema.statics.deletePage = deletePage
pageSchema.statics.updatePage = updatePage

const Page = connection.model('Page', pageSchema)

async function getAll() {
  let scope = this.find().sort({ sort: 1 })
  return {
    pages: await scope,
  }
}

async function deletePage(root, input) {
  const removedPage = this.findByIdAndRemove(input.id)
  return await removedPage
}

async function updatePage(root, input) {
  // const updatedPage = this.findByIdAndUpdate(input.id, input.name)
  // return await updatedItem
}

module.exports = Page
