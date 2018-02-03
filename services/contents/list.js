'use strict';
const db = require('../../db');

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection('contents');
    const filters = {} || req.params;
    filters.host = req.headers.host;
    const docs = await collection.find(filters, {}).toArray();
    callback(null, {contents: docs});
  } catch (e) {
    callback(e);
  }
};
