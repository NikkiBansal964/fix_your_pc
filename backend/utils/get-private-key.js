const fs = require('fs')
const Cryptr = require('cryptr');
const cryptr = new Cryptr(fs.readFileSync('configs/key.txt', 'utf8'));

let str = process.argv.slice(-1)[0]
let dString = cryptr.decrypt(str)
console.log(`*******`)
console.log(dString)