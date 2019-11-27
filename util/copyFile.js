let fs = require('fs')

const copyFile = () =>
  fs.readFile('db.json', (err, data) => {
    if (err) throw err
    fs.writeFile('bs.txt', data, err => {
      if (err) throw err
      console.log("File's correctly copyed")
    })
  })

module.exports = copyFile
