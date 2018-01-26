'use strict';

exports.handler = (req, res, callback) => {
  const path = req.routeInformations.path;
  if (path === '/admin/routes/list') {
    require('./admin/list')(req, res, callback);
  } else if (path === '/admin/routes') {
    require('./admin/get')(req, res, callback);
  } else if (path === '/admin/routes/update') {
    require('./admin/update')(req, res, callback);
  } else {
    callback('notFound');
  }

};

