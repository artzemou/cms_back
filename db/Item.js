const mongoose = require('mongoose')
const urlRegex = require('url-regex')

const connection = require('./connection')

const itemSchema = new mongoose.Schema(
  {
    content: { type: String },
    sort: { type: Number },
    img: { type: String },
    imgPath: { type: String },
  },
  {
    collation: { locale: 'en_US', strength: 1 },
    strict: 'throw',
    strictQuery: true,
    timestamps: true,
    useNestedStrict: true,
  }
)
itemSchema.index({ content: 'text' })
itemSchema.statics.getAll = getAll
itemSchema.statics.deleteItem = deleteItem

const Item = connection.model('Item', itemSchema)

async function getAll() {
  let scope = this.find().sort({ sort: 1 })
  return {
    items: await scope,
  }
}

async function deleteItem(root, input) {
  const removedItem = this.findByIdAndRemove(input.id)
  return await removedItem
}

module.exports = Item
