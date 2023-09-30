// load model for 'borrow' table
const borrowModel = require('../models/index').borrow
// load model for 'details_of_borrow' table
const detailBorrowModel = require('../models/index').details_of_borrow

// load Opertaor from Sequelize
const Op = require('sequelize').Op

// create function for add book borrowing
exports.addBorrowing = async(req, res) => {
  // prepare data for borrow's table
  let newData = {
    memberID: req.body.memberID,
    adminID: req.body.adminID,
    date_of_borrow: req.body.date_of_borrow,
    date_of_return: req.body.date_of_return,
    status: req.body.status,
  }

  // execute for inserting to borrow's table
  borrowModel.create(newData)
    .then(result => {
      // get the lates id of book borrowing
      let borrowID = result.id

      // store details of book borrowing from request (type: array object)
      let detailsOfBorrow = request.body.details_of_borrow

      // inserting all data of detailsOfBorrow
      for (let i = 0; i < detailsOfBorrow.length; i++) {
        detailsOfBorrow[i].borrowID = borrowID
      }

      // insert all data of detailsOfBorrow
      detailsOfBorrowModel.bulkCreate(detailsOfBorrow)
        .then(result => {
          return res.json({
            success: true,
            message: 'New Book Borrowed has been inserted'
          })
        })
        .catch(error => {
          return res.json({
            success: false,
            message: error.message
          })
        })
    })
    .catch(error => {
      return res.json({
        success: false,
        message: error.message
      })
    })
}

// create function for update book borrowing
exports.updateBorrowing = async(req, res) => {
  // prepare data for borrow's table
  let newData = {
    memberID: req.body.memberID,
    adminID: req.body.adminID,
    date_of_borrow: req.body.date_of_borrow,
    date_of_return: req.body.date_of_return,
    status: req.body.status,
  }

  // prepare parameter Borrow ID
  let borrowID = req.params.id;

  // execute for inserting to borrow's table
  borrowModel.update(newData, { where: { id: borrowID } })
    .then(async result => {
      // delete all detailsOfBorrows based on borrowID
      await detailBorrowModel.destroy(
        { where: { borrowID: borrowID } }
      )

      // store details of book borrowing from request (type: array object)
      let detailsOfBorrow = req.body.details_of_borrow

      // insert borrowID to each item of detailsOfBorrow
      for (let i = 0; i < detailsOfBorrow.length; i++) {
        detailsOfBorrow[i].borrowID = borrowID
      }

      // re-insert all data of detailsOfBorrow
      detailsOfBorrowModel.bulkCreate(detailsOfBorrow)
        .then(result => {
          return res.json({
            success: true,
            message: 'Book Borrowed has been'
          })
        })
        .catch(error => {
          return res.json({
            success: false,
            message: error.message
          })
        })
    })
    .catch(error => {
      return res.json({
        success: false,
        message: error.message
      })
    })
}

// create function for delete book borrowing's data
exports.deleteBorrowing = async(req, res) => {
  // prepare borrowID that as parameter to delete
  let borrowID = request.params.id

  // delete detailsOfBorrow using model
  detailBorrowModel.destroy( { where: { borrowID } })
    .then(result => {
      // delete borrow's data using model
      borrowModel.destroy({ where: { id: borrowID } })
        .then(result => {
          return res.json({
            success: true,
            message: `Borrowing Book's has deleted`
          })
        })
        .catch(error => {
          return res.json({
            success: false,
            message: error.message
          })
        })
    })
    .catch(error => {
      return res.json({
        success: true,
        message: error.message
      })
    })
}

// create function for return borrowed book
exports.returnBook = async(req, res) => {
  // prepare borrowID taht will be return
  let borrowID = req.params.id

  // prepare current time for return's time
  let today = new Date();
  let currentDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate}`;

  // update status and date_of_return from borrow's data
  borrowModel.update(
    {
      date_of_return: currentDate,
      status: true
    },
    {
      where: {
        id: borrowID
      }
    }
  )
    .then(result => {
      return res.json({
        success: true,
        message: 'Book has been returned'
      })
    })
    .catch(error => {
      return res.json({
        success: false,
        message: error.message
      })
    })
}

// create function for get all borrowing data
exports.getBorrow = async(req, res) => {
  let data = await borrowModel.findAll(
    {
      include: [
        `member`, `admin`,
        {
          model: detailsOfBorrowModel,
          as: `details_of_borrow`,
          include: ["book"]
        }
      ]
    }
  )

  return res.json({
    success: true,
    data: data,
    message: 'All borrowing book have been loaded'
  })
}