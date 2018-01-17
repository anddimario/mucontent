'use strict';
const db = require('../../db');
const bcrypt = require('bcrypt');

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection('users');
    const user = await collection.findOne({ email: req.body.email, host: req.headers.host }, { email: 1, password: 1 });
    if (!user) {
      return callback('userNotExists');
    }
    const compare = await bcrypt.compare(req.body.password, user.password);
    if (compare) {
      req.session.store(req.session.sessionId, {
        userId: user._id
      }, callback);
    } else {
      callback('wrongLogin')
    }
  } catch (e) {
    callback(e);
  }
};
