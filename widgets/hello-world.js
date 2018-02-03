'use strict';

exports.handler = (req, res, callback) => {
  process.stdout.write('Widgets hello world\r\n');
  callback(null, {helloWorldWidget: 'basic hello world'});
};