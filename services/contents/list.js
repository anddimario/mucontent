'use strict';
const db = require('../../db');

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection(`${req.routeInformations.md5Host}_contents`);
    const filters = {} || req.params;
    filters.host = req.headers.host;
    const docs = await collection.find(filters, {}).toArray();
    const locals = {
      contents: docs
    };
    // Get user role, if userId exists
    if (req.session && req.session.userId) {
      const users = db.get().collection(`${req.routeInformations.md5Host}_users`);
      const user = await users.findOne({ _id: req.session.userId });
      locals.userRole = user.role;
    }
    callback(null, locals);
  } catch (e) {
    callback(e);
  }
};
