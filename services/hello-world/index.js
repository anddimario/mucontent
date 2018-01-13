exports.handler = (req, res, callback) => {
  process.stdout.write('Service hello world\r\n');
  callback(null, {service: 'All is done'});
};