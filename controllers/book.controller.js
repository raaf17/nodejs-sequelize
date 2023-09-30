// load model for table books
const bookModel = require('../models/index').book
// load Operation from Sequelize
const Op = require('sequelize').Op
// load library 'path' and 'filestream'
const path = require('path');
const fs = require('fs');
// load function from 'upload-cover' singgle('cover') means just upload one file with request name 'cover'
const upload = require('../cover').single('cover')

// create function to read all data
exports.getAllBooks = async(req, res) => {
  // call findAll() to get all data
  let books = await bookModel.findAll();
  return res.json({
    success: true,
    data: books,
    message: 'All Books have been loaded'
  })
}

// create function for filter
exports.findBook = async(req, res) => {
  // define keyword to find data
  let keyword = req.body.keyword;

  // call findAll() within where clause and operation
  let books = await bookModel.findAll({
    where: {
      [Op.or]: [
        { isbn: { [Op.substring]: keyword } },
        { title: { [Op.substring]: keyword } },
        { author: { [Op.substring]: keyword } },
        { category: { [Op.substring]: keyword } },
        { publisher: { [Op.substring]: keyword } },
      ]
    }
  })

  return res.json({
    success: true,
    data: books,
    message: 'All Books have been loaded'
  })
}

// create function to add new book
exports.addBook = (req, res) => {
  // run function upload
  upload(req, res, async error => {
    // check if there are errorwhen upload
    if(error) {
      return res.json({
        message: error
      })
    }

    // check if file is empty
    if(!req.file) {
      return res.json({
        message: 'Nothing to upload'
      })
    }

    // prepare data from request
    let newBook = {
      isbn: req.body.isbn,
      title: req.body.title,
      author : req.body.author ,
      publisher: req.body.publisher,
      category: req.body.category,
      stock: req.body.stock,
      cover: req.body.filename
    }

    // execute inserting data to book's table
    bookModel.create(newBook)
      .then(result => {
        // if insert's process success
        return res.json({
          success: true,
          data: result,
          message: 'New book has been inserted'
        })
      })
      .catch(err => {
        // if insert's process failed
        return res.json({
          success: false,
          message: err.message
        })
      })
  })
}

// create function to update book
exports.updatedBook = async(req, res) => {
  // run upload function
  upload(req, res, async error => {
    // check if there are error when upload
    if(error) {
      return res.json({
        message: error
      })
    }

    // storage selected book ID that wil update
    let id = request.params.id

    // prepare book's data that will update
    let book = {
      isbn: req.body.isbn,
      title: req.body.title,
      author : req.body.author ,
      publisher: req.body.publisher,
      category: req.body.category,
      stock: req.body.stock
    }

    // check if file is not empty, it means update data within reupload file
    if (req.file) {
      // get selected book's data
      const selectedBook = await bookModel.findOne({
        where: {
          id: id
        }
      })
      // get old filename
      const oldCoverBook = selectedBook.cover
      // prepare path of old cover to delete file
      const pathCover = path.join(__dirname, '../cover', oldCoverBook);
      // check file existence
      if (fs.existsSync(pathCover)) {
        // delete old cover file
        fs.unlink(pathCover, error => {
          console.log(error)
        })
      }
      // add new cover filename to book object
      book.cover = req.file.filename;
    }

    // execute update data based on defined id book
    bookModel.update(book, { where: { id: id } })
      .then(result => {
        // if update's process success
        return res.json({
          success: true,
          message: 'Data book has been updated'
        })
      })
      .catch(error => {
        // if update's process fail
        return res.json({
          message: error.message
        })
      })
  })
}

// create funcion to delete book
exports.deleteBook = async(req, res) => {
  // store selected book's ID that will be delete
  const id = req.params.id;

  // delete cover file
  // get selected book's data
  const book = await bookModel.findOne({
    where: {
      id: id
    }
  })
  // get old filename of cover file
  const oldCoverBook = book.cover

  // prepare path of old cover to delete file
  const pathCover = path.join(__dirname, '../cover', oldCoverBook);
  
  // check file existence
  if (fs.existsSync(pathCover)) {
    // delete old cover file
    fs.unlink(pathCover, error => console.log(error))
  }
  // end of delete cover file

  // execute delete data based on defined id book
  bookModel.destroy({ where: { id: id }})
    .then(result => {
      // if update's process success
      return res.json({
        success: true,
        message: 'Data book has been deleted'
      })
    })
    .catch(error => {
      // if update's process fail
      return res.json({
        success: false,
        message: error.message
      })
    })
}