'use strict';
const db = require('../../../db');

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection(`users${req.routeInformations.md5Host}`);
    const docs = await collection.find({}, { password: 0 }).toArray();
    callback(null, {users: docs});
  } catch (e) {
    callback(e);
  }
};
