'use strict';

exports.handler = (req, res, callback) => {
  const path = req.routeInformations.path;
  if (path === '/contents') {
    require('./get')(req, res, callback);
  } else if (path === '/admin/contents/create'){
    require('./admin/create')(req, res, callback);
  } else {
    callback('notFound');
  }

};
