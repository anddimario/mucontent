'use strict';

const db = require('../../db');

async function init() {
  try {
    const collection = db.get().collection('routes');

    const services = [
      // get content
      {
        path: '/contents',
        method: 'get',
        host: process.argv[2],
        service: 'contents',
        permissions: ['user'],
        middlewares: ['validation'],
        view: '{{ name }}',
        headers: {
          'Content-Type': 'text/html',
        },
        validators: {
          properties: {
            "name": { "type": "string" },
            "type": { "type": "string" }
          }
        }
      },
      // ADMIN
      // create user view
      {
        path: '/admin/contents/create',
        method: 'get',
        permissions: ['admin'],
        middlewares: ['cookie', 'authorize'],
        host: process.argv[2],
        view: '<form method="POST" action="/admin/contents/create"><input type="text" name="name"><input type="text" name="type"><input type="submit" value="Create"></form>',
        headers: {
          'Content-Type': 'text/html',
        }
      },
      // create user post
      {
        path: '/admin/contents/create',
        method: 'post',
        host: process.argv[2],
        permissions: ['admin'],
        middlewares: ['cookie', 'authorize', 'validation'],
        headers: {
          'Location': process.argv[2]
        },
        validators: {
          properties: {
            "name": { "type": "string" },
            "type": { "type": "string" }
          }
        }
      },

    ];


    for (let route of services) {
      await collection.insertOne(route);
      process.stdout.write(`Installed ${route.method} ${route.path}\r\n`);
    }

    process.exit();
  } catch (e) {
    process.stdout.write(e.toString());
    process.exit(1);
  }
}

// Connect to Mongo on start
db.connect(process.env.DATABASE, function (err) {
  if (err) {
    process.stdout.write('Unable to connect to Mongo.');
    process.exit(1);
  } else {
    init();
  }
});
