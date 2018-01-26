'use strict';
const db = require('../../../db');
const ObjectId = require('mongodb').ObjectID;

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection('routes');
    const o_id = new ObjectId(req.body.id);
    delete req.body.id;
    if (req.body.headers) {
      req.body.headers = JSON.parse(req.body.headers);
    }
    if (req.body.validators) {
      req.body.validators = JSON.parse(req.body.validators);
    }
    if (req.body.middlewares) {
      req.body.middlewares = req.body.middlewares.split(',');
    }
    if (req.body.widgets) {
      req.body.widgets = req.body.widgets.split(',');
    }
    await collection.update({ _id: o_id }, { $set: req.body });
    callback(null, 'done');
  } catch (e) {
    callback(e);
  }
};