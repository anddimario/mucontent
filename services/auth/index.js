'use strict';

exports.handler = (req, res, callback) => {
  const path = req.routeInformations.path;

  if (path === '/logout') {
    require('./logout')(req, res, callback);
  } else if (path === '/login'){
    require('./login')(req, res, callback);
  } else if (path === '/registration'){
    require('./registration')(req, res, callback);
  } else {
    callback('notFound');
  }

};
