'use strict';
const db = require('../../../db');

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection(`uploads${req.routeInformations.md5Host}`);
    const value = req.body;
    value.filename = req.files.upload.path.replace(`${process.env.UPLOAD_DIR}/`, '');
    await collection.insertOne(value)
    callback(null, 'done');
  } catch (e) {
    callback(e);

  }
};
