// load library 'multer' and 'path'
const multer = require('multer');
const path = require('path');

// storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../cover')
  },

  // define filename for upload file
  filename: (req, file, cb) => {
    cb(null, `cover-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  // storage configuration
  storage: storage,
  // filter uploaded file
  fileFilter: (req, file, cb) => {
    // filter type of file
    const acceptedType = ['image/jpg', 'image/jpeg', 'image/png']
    if (!acceptedType.includes(file.mimetype)) {
      cb(null, false) // refuse upload
      return cb('File size is too large')
    }

    cb(null, true) // accept upload
  }
})

module.exports = upload