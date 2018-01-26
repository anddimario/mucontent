'use strict';
const db = require('../../../db');
const ObjectId = require('mongodb').ObjectID;

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection('routes');
    const o_id = new ObjectId(req.params.id);
    const docs = await collection.findOne({ _id: o_id }, {path: 0, host: 0});
    if (docs) {
      callback(null, {doc: docs});
    } else {
      callback('notFound');
    }
  } catch (e) {
    callback(e);
  }
};
