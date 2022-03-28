const router = require('express').Router()
const sendResponse = require('../core/res-methods')
const authValidator = require('../validators/auth')
const complaintService = require('../services/complaint')
const fileUploader = require('../utils/fileuploader')
const upload = require('../utils/upload')
const jwt = require('../utils/jwt')

router.post('/create', jwt.tokenVerification, fileUploader.UploadComplaints.array('file'), upload.UploadImagesArray, async (req, res) => {
    const { name, complaintno, systemtype, serialno, modelno, issue, mobile, createdby, department, contactpersonmobile, contactpersonname, corporate } = JSON.parse(req.body.data) || {}
    try {
        let createdby = corporate || req.current_userId
        let complaint = { complaintno, systemtype, serialno, modelno, issue, mobile, createdby, name, createdby, department, contactpersonmobile, contactpersonname }

        if (req.file.length) complaint.pic = req.file || undefined
        console.log('complaint', complaint, corporate)
        let newComplaint = await complaintService.create(complaint)
        return sendResponse(res, { statusCode: 200, data: newComplaint })
    } catch (e) {
        return sendResponse(res, { statusCode: 500, message: e.message })
    }
})

router.post('/getcomplaints', jwt.tokenVerification, async (req, res) => {
    try {
        let { sDate, eDate } = req.body
        let userid = req.current_userId
        let complaint = await complaintService.getComplaints({ userid, sDate, eDate })
        return sendResponse(res, { statusCode: 200, data: complaint })
    } catch (e) {
        return sendResponse(res, { statusCode: 500, message: e.message })
    }
})

router.get('/complaintdetailsbyid', jwt.tokenVerification, async (req, res) => {
    try {
        let userid = req.current_userId
        let { complaintid } = req.query
        let complaintDetails = await complaintService.getComplaintDetailsById({ complaintid, userid })
        return sendResponse(res, { statusCode: 200, data: complaintDetails })
    } catch (e) {
        return sendResponse(res, { statusCode: 500, message: e.message })
    }
})

router.post('/allocate', jwt.tokenVerification, async (req, res) => {
    try {
        let { engineerid, id, status, remarks } = req.body
        let allocatedby = req.current_userId
        // let updatedby = req.current_userId
        let complaint = await complaintService.allocateComplaints({ engineerid, id, allocatedby, status, remarks })
        return sendResponse(res, { statusCode: 200, data: complaint })
    } catch (e) {
        return sendResponse(res, { statusCode: 500, message: e.message })
    }
})

router.post('/update', jwt.tokenVerification, async (req, res) => {
    try {
        let comp = req.body
        let updatedby = req.current_userId
        let complaint = await complaintService.updateComplaints({ ...comp, updatedby })
        return sendResponse(res, { statusCode: 200, data: complaint })
    } catch (e) {
        return sendResponse(res, { statusCode: 500, message: e.message })
    }
})

router.post('/insertcomplaintdetails', jwt.tokenVerification, async (req, res) => {
    const { compid, status, remarks } = req.body
    let createdby = req.current_userId

    try {
        let createdby = req.current_userId
        let complaint = await complaintService.insertComplaintDetails({ compid, status, remarks, createdby })
        return sendResponse(res, { statusCode: 200, data: complaint })
    } catch (e) {
        return sendResponse(res, { statusCode: 500, message: e.message })
    }
})

router.get('/getcomplaintdetailsbycompid', jwt.tokenVerification, async (req, res) => {
    const { compid } = req.query
    try {
        let complaint = await complaintService.getComplaintDetailsByCompid(compid)
        return sendResponse(res, { statusCode: 200, data: complaint })
    } catch (e) {
        return sendResponse(res, { statusCode: 500, message: e.message })
    }
})

router.get('/getcorporates', jwt.tokenVerification, async (req, res) => {

    try {
        let users = await complaintService.getCorporates()
        return sendResponse(res, { statusCode: 200, data: users })
    } catch (e) {
        return sendResponse(res, { statusCode: 500, message: e.message })
    }
})

module.exports = router