'use strict';

const db = require('../../db');


const services = [
  // get content
  {
    path: '/contents',
    method: 'get',
    host: process.argv[3],
    service: 'contents',
    view: '{{ name }}',
    headers: {
      'Content-Type': 'text/html',
    }
  },
  // get list
  {
    path: '/contents/list',
    method: 'get',
    host: process.argv[3],
    middlewares: ['cookie'],
    widgets: ['adminOptions'],
    service: 'contents',
    view: '{% for content in contents %}<a href="/contents?id={{ content._id }}">{{ content.name }}</a> {{ adminOptions }}{% endfor %}',
    headers: {
      'Content-Type': 'text/html',
    }
  },
  // ADMIN
  // create user view
  {
    path: '/admin/contents/create',
    method: 'get',
    permissions: ['admin'],
    middlewares: ['cookie', 'authorize'],
    host: process.argv[3],
    view: '<form method="POST" action="/admin/contents/create"><input type="text" name="name"><input type="text" name="type"><input type="submit" value="Create"></form>',
    headers: {
      'Content-Type': 'text/html',
    }
  },
  // create content post
  {
    path: '/admin/contents/create',
    method: 'post',
    host: process.argv[3],
    service: 'contents',
    permissions: ['admin'],
    middlewares: ['cookie', 'authorize', 'validation'],
    headers: {
      'Location': process.argv[3]
    },
    validators: {
      properties: {
        "name": { "type": "string" },
        "type": { "type": "string" }
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
db.connect(process.env.DATABASE, function (err) {
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
