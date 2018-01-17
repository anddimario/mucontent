'use strict';

exports.handler = (req, res, callback) => {

  if (req.url === '/profile') {
    require('./get')(req, res, callback);
  } else if (req.url === '/profile/remove'){
    require('./remove')(req, res, callback);
  } else if (req.url === '/profile/update'){
    require('./update')(req, res, callback);
  } else if (req.url === '/profile/update/password'){
    require('./updatePassword')(req, res, callback);
  } else if (req.url === '/admin/users/create'){
    require('./admin/create')(req, res, callback);
  } else if (req.url === '/admin/users'){
    require('./admin/get')(req, res, callback);
  } else if (req.url === '/admin/users/list'){
    require('./admin/list')(req, res, callback);
  } else if (req.url === '/admin/users/update'){
    require('./admin/update')(req, res, callback);
  } else if (req.url === '/admin/users/remove'){
    require('./admin/remove')(req, res, callback);
  } else {
    callback('notFound');
  }

};
