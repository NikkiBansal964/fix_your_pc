
const fs = require('fs')
const async = require('async')

let changeStatusFileUploader = (fileBuffer, filename) => {
    let path = "./ComplaintPics/" + filename

    return new Promise((resolve, reject) => {
        fs.writeFile(path, fileBuffer, (err) => {
            if (err) reject(err)
            else resolve(path)
        })
    })
}


let UploadImagesArray = (req, res, next) => {
    let fileNames = []
    if (req.files.length) {
        let count = 0;
        async.eachSeries(req.files, (file, cb) => {
            let str = file['originalname'].split('.')
            let fileName = new Date().getTime() + count + '.' + str[str.length - 1];
            count++
            changeStatusFileUploader(file.buffer, fileName)
                .then(fileSavePath => {
                    fileNames.push(fileSavePath)
                    cb()
                })
                .catch(err => cb(err))
        }, (err) => {
            if (err) {
                res.statusMessage = 'Error While Uploading Image.'
                res.status(500).send()
            } else {
                req.file = fileNames.join(',')
                next()
            }
        })
    } else {
        req.file = []
        next()
    }
}


module.exports = { UploadImagesArray }