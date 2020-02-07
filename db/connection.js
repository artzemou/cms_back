const chalk = require('chalk')
const mongoose = require('mongoose')

const uri =
  'mongodb+srv://m_e:fs85aoMTY3Zj63Ju@cluster0-srska.gcp.mongodb.net/alias'
  // 'mongodb://localhost:27017/alias'
let url = process.env.MONGODB_URI || global.MONGODB_URI || uri

// url = 'mongodb://localhost:27017/alias'
console.log(url)
const connection = mongoose.createConnection(url, {
  connectTimeoutMS: 5000,
  reconnectInterval: 100,
  useCreateIndex: true,
  useNewUrlParser: true,
  // useUnifiedTopology: true 
})

mongoose.set('useFindAndModify', false)

if (process.env.NODE_ENV !== 'test') {
  connection.on('open', () => {
    console.log(
      chalk`{green ✅  Connected to mongoDB database ${connection.name}}`
    )
  })
}

connection.on('error', () => {
  console.error(
    chalk`{red 🔥  Could not connect to mongoDB database ${connection.name}}`
  )
})

module.exports = connection
