const router = require('express').Router()
const sendResponse = require('../core/res-methods')
const authValidator = require('../validators/auth')
const dashService = require('../services/dashboard')
const jwt = require('../utils/jwt')

router.post('/complaintrecords', jwt.tokenVerification, async (req, res) => {
    try {
        let { sDate, eDate } = req.body
        let userid = req.current_userId

        // let type = req.current_usertype
        // console.log('type', type)
        let resp = await dashService.complaintRecord({ sDate, eDate, userid })
        return sendResponse(res, { statusCode: 200, data: resp })
    } catch (e) {
        return sendResponse(res, { statusCode: 500, message: e.message })
    }
})

router.post('/monthlecomplaintchart', jwt.tokenVerification, async (req, res) => {
    try {
        let { sDate, eDate } = req.body
        let userid = req.current_userId

        let resp = await dashService.monthlyComplaintRecord({ sDate, eDate, userid })
        return sendResponse(res, { statusCode: 200, data: resp })
    } catch (e) {
        return sendResponse(res, { statusCode: 500, message: e.message })
    }
})

module.exports = router