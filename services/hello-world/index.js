'use strict';

exports.handler = () => {
  process.stdout.write('Service hello world\r\n');
  return {service: 'All is done'};
};