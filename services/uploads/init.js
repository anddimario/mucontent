'use strict';

const db = require('../../db');
const config = require('../../config');

const services = [
  // ADMIN
  // get list
  {
    path: '/admin/uploads',
    method: 'get',
    host: process.argv[3],
    middlewares: ['cookie'],
    service: 'uploads',
    view: '{% for upload in uploads %}{{ upload.name }} <a href="/admin/uploads/remove?id={{ upload._id }}">remove</a>{% endfor %}',
    headers: {
      'Content-Type': 'text/html',
    },
    projection: {'name': 1, 'type': 1}    
  },
  // upload view
  {
    path: '/admin/uploads/create',
    method: 'get',
    permissions: ['admin'],
    middlewares: ['cookie', 'authorize'],
    host: process.argv[3],
    view: '<form method="POST" enctype="multipart/form-data" action="/admin/uploads/create"><input type="text" name="name"><input type="file" name="upload" multiple="multiple"><input type="submit" value="Upload"></form>',
    headers: {
      'Content-Type': 'text/html',
    }
  },
  // upload post
  {
    path: '/admin/uploads/create',
    method: 'post',
    host: process.argv[3],
    service: 'uploads',
    permissions: ['admin'],
    middlewares: ['cookie', 'authorize', 'validation'],
    headers: {
      'Location': `${process.argv[3]}/admin/uploads`
    },
    validators: {
      properties: {
        "name": { "type": "string" },
      }
    }
  },
  // remove upload
  {
    path: '/admin/uploads/remove',
    method: 'get',
    host: process.argv[3],
    service: 'uploads',
    permissions: ['admin'],
    middlewares: ['cookie', 'authorize', 'validation'],
    headers: {
      'Location': `${process.argv[3]}/admin/uploads`
    },
    validators: {
      properties: {
        "id": { "type": "string" },
      }
    }
  },
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
