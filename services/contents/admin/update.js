'use strict';
const db = require('../../../db');
const ObjectId = require('mongodb').ObjectID;

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection(`${req.routeInformations.md5Host}_contents`);
    const o_id = new ObjectId(req.body.id);
    delete req.body.id;
    await collection.update({ _id: o_id }, { $set: req.body });
    callback(null, 'done');
  } catch (e) {
    callback(e);
  }
};
