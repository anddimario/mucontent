'use strict';
const db = require('../../../db');

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection('contents');
    const value = req.body;
    value.host = req.headers.host;
    await collection.insertOne(value);
    callback(null, 'done');
  } catch (e) {
    callback(e);
  }
};
