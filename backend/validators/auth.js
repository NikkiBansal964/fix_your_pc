const sendResponse = require('../core/res-methods')
const emailRegex = require('../utils/regex').email

module.exports = (req , res , next ) => {
    const {email} =   req.method === 'GET' ? req.query : req.body
    
    if(!email || email.length > 150 || !email.match(emailRegex)){
        return sendResponse(res,{statusCode:401,message:`Invalid Email`})
    }
    next()
}