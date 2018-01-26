'use strict';

const db = require('../../db');

async function init() {
  try {
    const collection = db.get().collection('routes');

    const services = [
      // get user
      {
        path: '/profile',
        method: 'get',
        host: process.argv[2],
        service: 'users',
        permissions: ['user'],
        middlewares: ['cookie', 'authorize'],
        view: '{{ email }}',
        headers: {
          'Content-Type': 'text/html',
        }
      },
      // update view
      {
        path: '/profile/update',
        method: 'get',
        permissions: ['user'],
        middlewares: ['cookie', 'authorize'],
        host: process.argv[2],
        view: '<form method="POST" action="/profile/update"><input type="text" name="fullname"><input type="submit" value="Update"></form>',
        headers: {
          'Content-Type': 'text/html',
        }
      },
      // update password view
      {
        path: '/profile/update/password',
        method: 'get',
        permissions: ['user'],
        middlewares: ['cookie', 'authorize'],
        host: process.argv[2],
        view: '<form method="POST" action="/profile/update/password"><input type="password" name="npassword"><input type="submit" value="Update Password"></form>',
        headers: {
          'Content-Type': 'text/html',
        }
      },
      // update post
      {
        path: '/profile/update',
        method: 'post',
        host: process.argv[2],
        service: 'users',
        permissions: ['user'],
        middlewares: ['validation', 'cookie', 'authorize'],
        headers: {
          'Location': process.argv[2]
        },
        validators: {
          properties: {
            "fullname": { "type": "string" }
          }
        }
      },
      // update password post
      {
        path: '/profile/update/password',
        method: 'post',
        host: process.argv[2],
        service: 'users',
        permissions: ['user'],
        middlewares: ['validation', 'cookie', 'authorize'],
        headers: {
          'Location': process.argv[2]
        },
        validators: {
          properties: {
            "npassword": { "type": "string" }
          }
        }
      },
      // remove
      {
        path: '/profile/remove',
        method: 'get',
        host: process.argv[2],
        service: 'users',
        permissions: ['user'],
        middlewares: ['cookie', 'authorize'],
        headers: {
          'Location': process.argv[2]
        }
      },
      // ADMIN
      // create user view
      {
        path: '/admin/users/create',
        method: 'get',
        permissions: ['admin'],
        middlewares: ['cookie', 'authorize'],
        host: process.argv[2],
        view: '<form method="POST" action="/admin/users/create"><input type="text" name="email"><input type="password" name="password"><input type="submit" value="Create"></form>',
        headers: {
          'Content-Type': 'text/html',
        }
      },
      // create user post
      {
        path: '/admin/users/create',
        method: 'post',
        host: process.argv[2],
        permissions: ['admin'],
        middlewares: ['cookie', 'authorize', 'validation'],
        headers: {
          'Location': process.argv[2]
        },
        validators: {
          properties: {
            "email": { "format": "email" },
            "password": { "type": "string" }
          }
        }
      },
      // get user
      {
        path: '/admin/users',
        method: 'get',
        host: process.argv[2],
        service: 'users',
        permissions: ['admin'],
        middlewares: ['cookie', 'authorize', 'validation'],
        view: '{{ email }}',
        headers: {
          'Content-Type': 'text/html',
        },
        validators: {
          properties: {
            "id": { "type": "string" }
          }
        }
      },
      // get users
      {
        path: '/admin/users/list',
        method: 'get',
        host: process.argv[2],
        service: 'users',
        permissions: ['admin'],
        middlewares: ['cookie', 'authorize', 'validation'],
        view: '{% for user in users %}{{ user.email }}{% endfor %}',
        headers: {
          'Content-Type': 'text/html',
        }
      },
      // update view
      {
        path: '/admin/users/update',
        method: 'get',
        permissions: ['admin'],
        middlewares: ['cookie', 'authorize'],
        host: process.argv[2],
        view: '<form method="POST" action="/profile/update/password"><input type="password" name="npassword"><input type="submit" value="Update Password"></form>',
        headers: {
          'Content-Type': 'text/html',
        }
      },
      // update post
      {
        path: '/admin/users/update',
        method: 'post',
        host: process.argv[2],
        service: 'users',
        permissions: ['admin'],
        middlewares: ['validation', 'cookie', 'authorize'],
        headers: {
          'Location': process.argv[2]
        },
        validators: {
          properties: {
            "id": { "type": "string" },
            "role": { "type": "string" }
          }
        }
      },
      // remove
      {
        path: '/admin/users/remove',
        method: 'get',
        host: process.argv[2],
        service: 'users',
        permissions: ['admin'],
        middlewares: ['cookie', 'authorize', 'validation'],
        headers: {
          'Location': process.argv[2]
        },
        validators: {
          properties: {
            "id": { "type": "string" }
          }
        }
      }
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
