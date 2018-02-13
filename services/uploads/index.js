'use strict';

exports.handler = (req, res, callback) => {
  const path = req.routeInformations.path;
  if (path === '/admin/uploads/create'){
    require('./admin/create')(req, res, callback);
  } else if (path === '/admin/uploads/remove'){
    require('./admin/remove')(req, res, callback);
  } else if (path === '/admin/uploads') {
    require('./admin/list')(req, res, callback);
  } else {
    callback('notFound');
  }

};
