'use strict';
const db = require('../../db');
const ObjectId = require('mongodb').ObjectID;

module.exports = async (req, res) => {
  try {
    const collection = db.get().collection(`users${req.routeInformations.md5Host}`);
    const o_id = new ObjectId(req.session.userId);
    const docs = await collection.findOne({ _id: o_id }, { password: 0 });
    return docs;
  } catch (e) {
    return {error: e};
  }
};
