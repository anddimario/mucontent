'use strict';
const db = require('../../../db');
const ObjectId = require('mongodb').ObjectID;
const fs = require('fs');
const promisify = require('util').promisify;

const removeFile = promisify(fs.unlink);

module.exports = async (req, res, callback) => {
  try {
    const collection = db.get().collection(`uploads${req.routeInformations.md5Host}`);
    const o_id = new ObjectId(req.params.id);
    const file = await collection.findOne({ _id: o_id });
    // remove file
    await removeFile(`${process.env.UPLOAD_DIR}/${file.filename}`);
    await collection.remove({ _id: o_id });
    callback(null, 'done');
  } catch (e) {
    callback(e);
  }
};
