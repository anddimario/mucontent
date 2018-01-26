'use strict';

exports.handler = (req, res, callback) => {
  const path = req.routeInformations.path;

  if (path === '/profile') {
    require('./get')(req, res, callback);
  } else if (path === '/profile/remove'){
    require('./remove')(req, res, callback);
  } else if (path === '/profile/update'){
    require('./update')(req, res, callback);
  } else if (path === '/profile/update/password'){
    require('./updatePassword')(req, res, callback);
  } else if (path === '/admin/users/create'){
    require('./admin/create')(req, res, callback);
  } else if (path === '/admin/users'){
    require('./admin/get')(req, res, callback);
  } else if (path === '/admin/users/list'){
    require('./admin/list')(req, res, callback);
  } else if (path === '/admin/users/update'){
    require('./admin/update')(req, res, callback);
  } else if (path === '/admin/users/remove'){
    require('./admin/remove')(req, res, callback);
  } else {
    callback('notFound');
  }

};
