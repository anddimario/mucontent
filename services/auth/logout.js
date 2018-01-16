'use strict';
const db = require('../../db');
const ObjectId = require('mongodb').ObjectID;

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection('sessions');
    const o_id = new ObjectId(req.session.sessionId);
    await collection.remove({ _id: o_id });
    const expires = new Date(new Date().getTime() - 3600000).toUTCString();
    res.setHeader('Set-Cookie', 'mucontent=; expires=' + expires);
    callback(null, 'done');
  } catch (e) {
    callback(e);
  }
};
