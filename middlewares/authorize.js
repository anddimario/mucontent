'use strict';
const db = require('../db');
const ObjectId = require('mongodb').ObjectID;

exports.handler = (req, res, callback) => {
  if (req.session.userId) { // check if userId is in session
    // get user informations for role
    const collection = db.get().collection('users');

    const o_id = new ObjectId(req.session.userId);
    collection.findOne({ _id: o_id }, (err, doc) => {
      if (err) {
        callback(err);
      } else {
        // check permission
        if (doc.role && (req.routeInformations.permissions.indexOf(doc.role) !== -1)) {
          callback(null, 'done');
        } else {
          callback('notAuthorized');
        }
      }
    });
  } else {
    callback('notAuthorized');
  }
};