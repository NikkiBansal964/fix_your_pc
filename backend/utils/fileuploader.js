const multer = require('multer');

let Filename = (req, file, cb) => {
    console.log("File d===>", file)
    let date = new Date();
    let str = file.originalname.split('.')
    let name = date.getTime() + Math.floor(Math.random() * 10) + "." + str[str.length - 1];
    console.log(`file is ${name}`)
    cb(null, name);
}

let complaintImage = multer.diskStorage({
    destination: './ComplaintPics',
    filename: Filename
})

module.exports.UploadComplaints = multer(complaintImage)