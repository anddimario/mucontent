'use strict';
const db = require('../../../db');
const bcrypt = require('bcrypt');

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection(`users${req.routeInformations.md5Host}`);
    const value = req.body;
    value.registrationDate = new Date();
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(req.body.password, salt);
    value.password = hash;
    await collection.insertOne(value);
    callback(null, 'done');
  } catch (e) {
    callback(e);
  }
};
