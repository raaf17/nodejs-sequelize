// load model for 'members' table
const memberModel = require('../models/index').member
// load operation from sequelize
const Op = require('sequelize').Op

// create function for read all data
exports.getAllMember = async (req, res) => {
  // call findAll() to get all data
  let members = await memberModel.findAll();
  return res.json({
    success: true,
    data: members,
    message: 'All members have been loaded'
  });
}

// create function for filter
exports.findMember = async (req, res) => {
  // define keyword to find data
  let keyword = req.body.keyword;
  // call findAll() within clause and operation to find data based on keyword
  let members = await memberModel.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.substring]: keyword } },
        { gender: { [Op.substring]: keyword } },
        { address: { [Op.substring]: keyword } }
      ]
    }
  });

  return res.json({
    success: true,
    data: members,
    message: 'All member have been loaded'
  });
}

// create function for add new member
exports.addMember = (req, res) => {
  // prepare data from req
  let newMember = {
    name: req.body.name,
    address: req.body.address,
    gender: req.body.gender,
    contact: req.body.contact
  }

  // execute inserting data to member's table
  memberModel.create(newMember)
    .then(result => {
      // if insert's process success
      return res.json({
        success: true,
        data: result,
        message: 'New member has been inserted'
      })
    })
    .catch(err => {
      // if inserts's process fail
      return res.json({
        success: false,
        message: err.message
      })
    })
}

// create function for update member
exports.updateMember = async (req, res) => {
  // prepare data that has been changed
  let dataMember = {
    name: req.body.name,
    address: req.body.address,
    gender: req.body.gender,
    contact: req.body.contact
  }

  // define id member that will be update
  let idMember = req.params.id

  // execute update data based on defined id member
  memberModel.update(dataMember, { where: { id: idMember } })
    .then(result => {
      // if update's process success
      return res.json({
        success: true,
        message: 'Data member has been updated'
      })
    })
    .catch(err => {
      // if update's process fail
      return res.json({
        success: false,
        message: err.message
      })
    })
}

// create function for delete data
exports.deleteMember = async(req, res) => {
  // define id member that will be update
  let idMember = req.params.id

  // execute delete data based on defined id member
  memberModel.destroy({ where: {id: idMember} })
    .then(result => {
      // if update's process success
      return res.json({
        success: true,
        message: 'Data member has been updated'
      })
    })
    .catch(err => {
      // if update's process fail
      return res.json({
        success: false,
        message: err.message
      })
    })
}