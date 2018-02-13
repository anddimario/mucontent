'use strict';
const db = require('../../../db');

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection(`contents${req.routeInformations.md5Host}`);
    const value = req.body;
    await collection.insertOne(value);
    callback(null, 'done');
  } catch (e) {
    callback(e);
  }
};
