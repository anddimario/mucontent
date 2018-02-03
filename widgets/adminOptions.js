'use strict';

exports.handler = (req, res, callback) => {
  const output = {
    adminOptions: ''
  };
  if (req.session && req.session.userRole) {
    output.adminOptions = 'remove'
  }
  callback(null, output);
};