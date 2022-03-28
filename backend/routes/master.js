const router = require('express').Router()
const sendResponse = require('../core/res-methods')
const authValidator = require('../validators/auth')
const masterService = require('../services/master')
const jwt = require('../utils/jwt')


router.get('/getstates', jwt.tokenVerification, async (req, res) => {
    try {
        let resp = await masterService.states()
        return sendResponse(res, { statusCode: 200, data: resp })
    } catch (e) {
        return sendResponse(res, { statusCode: 500, message: e.message })
    }
})

router.get('/getcities', jwt.tokenVerification, async (req, res) => {
    try {
        let resp = await masterService.cities()
        return sendResponse(res, { statusCode: 200, data: resp })
    } catch (e) {
        return sendResponse(res, { statusCode: 500, message: e.message })
    }
})

router.get('/getpincodes', jwt.tokenVerification, async (req, res) => {
    try {
        let resp = await masterService.pincodes()
        return sendResponse(res, { statusCode: 200, data: resp })
    } catch (e) {
        return sendResponse(res, { statusCode: 500, message: e.message })
    }
})

router.get('/getdistricts', jwt.tokenVerification, async (req, res) => {
    try {
        let resp = await masterService.districts()
        return sendResponse(res, { statusCode: 200, data: resp })
    } catch (e) {
        return sendResponse(res, { statusCode: 500, message: e.message })
    }
})


// router.get('/getsystemtype', jwt.tokenVerification, async (req, res) => {
//     try {
//         let resp = await masterService.()
//         return sendResponse(res, { statusCode: 200, data: resp })
//     } catch (e) {
//         return sendResponse(res, { statusCode: 500, message: e.message })
//     }
// })


module.exports = router