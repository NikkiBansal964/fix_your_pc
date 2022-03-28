const jwt = require('jsonwebtoken');
const fs = require('fs')
const moment = require('moment')
const privateKey = fs.readFileSync('./configs/key.txt');


module.exports = {
    async generateJWT(payload) {
        return await jwt.sign({
            exp: moment().add(1, 'day').toDate().getTime(),
            data: payload
        }, privateKey)
    },

    tokenVerification(req, res, next) {
        // console.log(req)
        const token = req.headers.authtoken
        if (!token)
            res.status(401).send()
        else {
            jwt.verify(token, privateKey, (err, result) => {
                if (err) {
                    res.status(401).send()
                }
                else {
                    req.current_userId = result.data.userId
                    next()
                }
            })
        }
    }
}
