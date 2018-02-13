'use strict';
const db = require('../../db');
const bcrypt = require('bcrypt');

module.exports = async (req, res, callback) => {
  try {
    req.body.role = 'user';
    const collection = db.get().collection(`users${req.routeInformations.md5Host}`);
    const userExists = await collection.findOne({ email: req.body.email }, { email: 1 });
    if (userExists) {
      return callback('userExists');
    }
    const value = req.body;
    value.registrationDate = new Date();
    value.host = req.headers.host;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(req.body.password, salt);
    value.password = hash;
    const inserted = await collection.insertOne(value);
    callback(null, 'done');
  } catch (e) {
    callback(e);
  }
};
