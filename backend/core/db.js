const createConnection = require('typeorm').createConnection

const connectToDb = async () => {
      // console.log(`connecting db...`)
      return await createConnection(require('../configs/ormconfig.json'))
}

module.exports = connectToDb()