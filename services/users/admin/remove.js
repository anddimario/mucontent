'use strict';
const db = require('../../../db');
const ObjectId = require('mongodb').ObjectID;

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection(`${req.routeInformations.md5Host}_users`);
    const o_id = new ObjectId(req.params.id);
    await collection.remove({ _id: o_id });
    callback(null, 'done');
  } catch (e) {
    callback(e);
  }
};
