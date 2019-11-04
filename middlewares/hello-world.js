'use strict';
exports.handler = (req, res) => {
  process.stdout.write('Middleware hello world\r\n');
  return 'done';
};
