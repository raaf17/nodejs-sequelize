// load express library
const express = require('express');
// load md5 library
const md5 = require('md5');
// load library jsonwebtoken
const jwt = require('jsonwebtoken');
// load model of admin
const adminModel = require('../models/index').admin

// create function to handle authenticating process
const authenticate = async(req, res) => {
  let dataLogin = {
    username: req.body.username,
    password: md5(req.body.password)
  }

  // check data username and password on admin's table
  let dataAdmin = await adminModel.findOne({
    where: dataLogin
  })

  // if data admin exists
  if(dataAdmin) {
    // set payload for generate token
    // payload is must be string
    // dataAdmin is object, so we must convert to string
    let payload = JSON.stringify(dataAdmin);
    // define secret key as signature
    let secret = `rahasia`;
    // generate token
    let token = jwt.sign(payload, secret);

    // define response
    return res.json({
      success: true,
      logged: true,
      message: 'Authentication Successes',
      token: token,
      data: dataAdmin
    })
  }

  // if data admin is not exists
  return res.json({
    success: false,
    logged: false,
    message: 'Authentication Failed. Invalid username or password'
  })
}

// create function authorize
const authorize = (req, res, next) => {
  // get 'Authorization' value from request's header
  let headers = req.headers.authorization

  // when using Bearer Token for authorization
  // we have to split 'headers' to get token key
  // values of headers = 'Bearers tokenKey'
  let tokenKey = headers && headers.split(' ')[1]

  // check nullable token
  if (tokenKey == null) {
    return res.json({
      success: false,
      message: 'Unauthorized User'
    })
  }

  // define secret Key (equeals with secret key in authentication function)
  let secret = 'rahasia';

  // verify token using jwt
  jwt.verify(tokenKey, secret, (error, user) => {
    // check if there is error
    if (error) {
      return res.json({
        success: false,
        message: 'Invalid token'
      })
    }
  })

  // if there is no problem, go on to controller
  next();
}

// export function to another file
module.exports = {
  authenticate, authorize
}