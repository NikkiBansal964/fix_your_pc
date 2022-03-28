const  CryptoJS = require("crypto-js");
const fs =  require('fs')
const key = fs.readFileSync('configs/key.txt','utf8').replace('\n','')

const encrypt = (str) => {
    return CryptoJS.AES.encrypt(str, key).toString();
}



const decrypt = (str) => {
    let by = CryptoJS.AES.decrypt(str, key).toString();

    return by.toString(CryptoJS.enc.Utf8)
}



let str = process.argv.splice(0,2)[0]
console.log(str)
console.log(decrypt(str))