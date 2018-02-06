'use strict';
const db = require('../../../db');

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection(`${req.routeInformations.md5Host}_users`);
    const docs = await collection.find({host: req.headers.host}, { password: 0 }).toArray();
    callback(null, {users: docs});
  } catch (e) {
    callback(e);
  }
};
