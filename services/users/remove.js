'use strict';
const db = require('../../db');
const ObjectId = require('mongodb').ObjectID;

module.exports = async (req, res, callback) => {
  try {
    const users = db.get().collection('users');
    const o_id = new ObjectId(req.session.userId);
    await users.remove({ _id: o_id });
    // remove session
    const sessions = db.get().collection('sessions');
    const s_id = new ObjectId(req.session.sessionId);
    await sessions.remove({ _id: s_id });
    const expires = new Date(new Date().getTime() - 3600000).toUTCString();
    res.setHeader('Set-Cookie', 'mucontent=; expires=' + expires);
    callback(null, 'done');
  } catch (e) {
    callback(e);
  }
};
