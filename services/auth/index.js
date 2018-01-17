'use strict';

exports.handler = (req, res, callback) => {

  if (req.url === '/logout') {
    require('./logout')(req, res, callback);
  } else if (req.url === '/login'){
    require('./login')(req, res, callback);
  } else if (req.url === '/registration'){
    require('./registration')(req, res, callback);
  } else {
    callback('notFound');
  }

};
