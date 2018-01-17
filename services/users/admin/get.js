'use strict';
const db = require('../../../db');
const ObjectId = require('mongodb').ObjectID;

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection('users');
    const o_id = new ObjectId(req.params.id);
    const docs = await collection.findOne({ _id: o_id }, { password: 0 });
    callback(null, docs);
  } catch (e) {
    callback(e);
  }
};
