'use strict';

const db = require('../../db');

const services = [
  // add logout
  {
    path: '/logout',
    method: 'get',
    host: process.argv[2],
    service: 'auth',
    middlewares: ['cookie'],
    headers: {
      'Location': process.argv[2]
    }
  },
  // login view
  {
    path: '/login',
    method: 'get',
    middlewares: ['cookie'],
    host: process.argv[2],
    view: '<form method="POST" action="/login"><input type="text" name="email"><input type="password" name="password"><input type="submit" value="Login"></form>',
    headers: {
      'Content-Type': 'text/html',
    }
  },
  // login post
  {
    path: '/login',
    method: 'post',
    host: process.argv[2],
    service: 'auth',
    middlewares: ['validation', 'cookie'],
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
  // registration view
  {
    path: '/registration',
    method: 'get',
    host: process.argv[2],
    view: '<form method="POST" action="/registration"><input type="text" name="email"><input type="password" name="password"><input type="submit" value="Login"></form>',
    headers: {
      'Content-Type': 'text/html',
    }
  },
  // registration post
  {
    path: '/registration',
    method: 'post',
    host: process.argv[2],
    service: 'auth',
    middlewares: ['validation'],
    headers: {
      'Location': process.argv[2]
    },
    validators: {
      properties: {
        "email": { "format": "email" },
        "password": { "type": "string" }
      }
    }
  }
];

async function install() {
  try {
    const collection = db.get().collection('routes');
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

async function uninstall() {
  try {
    const collection = db.get().collection('routes');
    for (let route of services) {
      await collection.remove({path: route.path, host: process.argv[3]});
      process.stdout.write(`Uninstalled ${route.method} ${route.path}\r\n`);
    }

    process.exit();
  } catch (e) {
    process.stdout.write(e.toString());
    process.exit(1);
  }
}

// Connect to Mongo on start
db.connect(config.DATABASE, function (err) {
  if (err) {
    process.stdout.write('Unable to connect to Mongo.');
    process.exit(1);
  } else {
    switch (process.argv[2]) {
      case 'install':
        install();
        break;
      case 'uninstall':
        uninstall();
        break;
      default:
        process.stdout.write('Wrong action');
        process.exit();
        break;
    }
  }
});
