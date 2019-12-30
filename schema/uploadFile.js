const { gql } = require('apollo-server-express')
const { createWriteStream, existsSync, mkdirSync } = require('fs')
const path = require('path')
const cloudinary = require('cloudinary')
// set your env variable CLOUDINARY_URL or set the following configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})
var files = [],
  fileURL = null
const typeDefs = gql`
  extend type Query {
    files: [String]
    fileURL: String
  }

  extend type Mutation {
    uploadFile(file: Upload!): Boolean
  }
`

const resolvers = {
  Query: {
    files: () => files,
    fileURL: () => fileURL,
  },
  Mutation: {
    uploadFile: async (_, { file }) => {
      const { createReadStream, filename } = await file
      await new Promise(res =>
        createReadStream()
          .pipe(createWriteStream(path.join(__dirname, '../images', filename)))
          .on('close', res)
      )
      await cloudinary.uploader
        .upload(path.join(__dirname, '../images', filename), {
          tags: 'basic_sample',
        })
        .then(function(image) {
          console.log()
          console.log(
            "* public_id for the uploaded image is generated by Cloudinary's service."
          )
          console.log('* ' + image.public_id)
          console.log('* ' + image.url)
          console.log('* ' + image.secure_url)
          fileURL = image.secure_url
          console.log(fileURL)
        })
        .catch(function(err) {
          console.log()
          console.log('** File Upload (Promise)')
          if (err) {
            console.warn(err)
          }
        })

      return true
    },
  },
}

existsSync(path.join(__dirname, '../images')) ||
  mkdirSync(path.join(__dirname, '../images'))

module.exports = { resolvers, typeDefs }