'use strict';
const db = require('../../db');
const ObjectId = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection(`${req.routeInformations.md5Host}_users`);
    const o_id = new ObjectId(req.session.userId);
    const value = {};
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(req.body.npassword, salt);
    value.password = hash;
    await collection.update({ _id: o_id }, { $set: value });
    callback(null, 'done');
  } catch (e) {
    callback(e);
  }
};
