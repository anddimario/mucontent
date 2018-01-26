'use strict';
const db = require('../../../db');

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection('routes');
    let find;
    if (req.session.userRole === 'superadmin') {
      find = {};
    } else if (req.session.userRole === 'admin') {
      find = {host: req.headers.host};
    } else {
      return callback('notAllowed');
    }
    const docs = await collection.find(find, {host: 1, path: 1, method: 1}, {$sort: {host: -1}}).toArray();
    callback(null, {items: docs});
  } catch (e) {
    callback(e);
  }
};

