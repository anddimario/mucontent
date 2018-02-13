'use strict';
const db = require('../../../db');

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection(`uploads${req.routeInformations.md5Host}`);
    const locals = {};
    const filters = req.params || {};
    let projection = req.routeInformations.projection || {};
    const docs = await collection.find(filters, projection).toArray();
    locals.uploads = docs;
    callback(null, locals);
  } catch (e) {
    callback(e);
  }
};
