'use strict';

const db = require('../db');
const ObjectId = require('mongodb').ObjectID;

function parseCookies(request) {
  var list = {},
    rc = request.headers.cookie;

  rc && rc.split(';').forEach(function (cookie) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });

  return list;
}

// add session value
function store(sessionId, value, callback) {
  const collection = db.get().collection('sessions');
  const o_id = new ObjectId(sessionId);
  
  collection.updateOne({_id: o_id}, {$set: value}, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null, 'done');
    }
  });
}

exports.handler = (req, res, callback) => {
  // read the cookie
  var cookies = parseCookies(req);
  const collection = db.get().collection('sessions');

  // set a cookie, if not present
  if (!cookies.mucontent) {
    const expires = new Date(new Date().getTime() + 86409000).toUTCString();
    // init on db and use id as session
    collection.insertOne({ expires: expires }, (err, doc) => {
      if (err) {
        callback(err);
      } else {
        res.setHeader('Set-Cookie', 'mucontent=' + doc.insertedId + '; expires=' + expires);
        callback(null, 'done');
      }
    });
  } else {
    // get session info
    const o_id = new ObjectId(cookies.mucontent);
    collection.findOne({ _id: o_id }, (err, doc) => {
      if (err) {
        callback(err);
      } else {
        req.session = doc;
        req.session.sessionId = cookies.mucontent; // add session id
        req.session.store = store;
        callback(null, 'done');
      }
    });
  }
};