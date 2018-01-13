exports.handler = (req, res, callback) => {
  process.stdout.write('Middleware hello world\r\n');
  callback(null, 'done')
};