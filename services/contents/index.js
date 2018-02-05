'use strict';

exports.handler = (req, res, callback) => {
  const path = req.routeInformations.path;
  if (path === '/contents') {
    require('./get')(req, res, callback);
  } else if (path === '/contents/list'){
    require('./list')(req, res, callback);
  } else if (path === '/admin/contents/create'){
    require('./admin/create')(req, res, callback);
  } else if (path === '/admin/contents/remove'){
    require('./admin/remove')(req, res, callback);
  } else if ((path === '/admin/contents/update') && (req.method.toLowerCase() === 'post')) {
    require('./admin/update')(req, res, callback);
  } else if ((path === '/admin/contents/update') && (req.method.toLowerCase() === 'get')) {
    require('./get')(req, res, callback);
  } else {
    callback('notFound');
  }

};
