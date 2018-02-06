'use strict';
const db = require('../db');
const ObjectId = require('mongodb').ObjectID;

exports.handler = (req, res, callback) => {
  if (req.session && req.session.userId) { // check if userId is in session
    // get user informations for role
    const collection = db.get().collection(`${req.routeInformations.md5Host}_users`);

    const o_id = new ObjectId(req.session.userId);
    collection.findOne({ _id: o_id }, (err, doc) => {
      if (err) {
        callback(err);
      } else {
        // check permission
        if (doc.role && (req.routeInformations.permissions.indexOf(doc.role) !== -1)) {
          // Add informations to session
          const addUserInfo = {
            userRole: doc.role
          };
          req.session.store(req.session.sessionId, addUserInfo, (err, stored) => {
            if (err) {
              callback(err);
            } else {
              callback(null, 'done');
            }
          });
        } else {
          callback('notAuthorized');
        }
      }
    });
  } else {
    callback('notAuthorized');
  }
};