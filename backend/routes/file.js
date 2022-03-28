const router = require('express').Router()
// const allowedDestination = ['Visits', 'attendance', 'video']
// const imgEditer = require('../Helpers/imageEditer')
const fs = require('fs')

const path = (p) => '/file' + p;

router.get(path('/:dest/:filename'), (req, res) => {
    if (!req.params.filename) {
        return res.send(`Invalid Path`)
    } else {
        let filePath = './' + req.params.dest + '/' + req.params.filename;
        res.sendfile(filePath)
    }
})

module.exports = router