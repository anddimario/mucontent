'use strict';

exports.handler = (req, res) => {
  process.stdout.write('Widgets hello world\r\n');
  return {helloWorldWidget: 'basic hello world'};
};