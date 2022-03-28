const bcrypt = require('bcrypt');
const saltRounds = 10;

const generateHash = async (text) => {
    let salt = bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(text, salt)
}

const compareText = async (text, hash) => {
    return await bcrypt.compareSync(text, hash)
}

module.exports = { generateHash, compareText }