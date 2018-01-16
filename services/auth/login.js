'use strict';
const db = require('../../db');
const bcrypt = require('bcrypt');

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection('users');
    const user = await collection.findOne({ email: req.body.email }, { email: 1, password: 1 });
    if (!user) {
      return callback('userNotExists');
    }
    const compare = await bcrypt.compare(req.body.password, user.password);
    if (compare) {
      req.session.user = {
        _id: user._id
      };
      req.session.store(req.session.sessionId, {
        username: 'myUsername'
      }, callback);
    } else {
      callback('wrongLogin')
    }
  } catch (e) {
    callback(e);
  }
};
