'use strict';
const db = require('../../db');
const ObjectId = require('mongodb').ObjectID;

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection('users');
    const o_id = new ObjectId(req.session.userId);
    await collection.update({ _id: o_id }, { $set: req.body });
    callback(null, 'done');
  } catch (e) {
    callback(e);
  }
};
