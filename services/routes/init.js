'use strict';

const db = require('../../db');

async function init() {
  try {
    const collection = db.get().collection('routes');

    const services = [
      // get routes
      {
        path: '/admin/routes/list',
        method: 'get',
        host: process.argv[2],
        service: 'routes',
        permissions: ['admin', 'superadmin'],
        middlewares: ['cookie', 'authorize'],
        view: '{% for item in items %}<a href="/admin/routes?id={{ item._id }}">{{ item.method }} {{ item.host }}{{ item.path }}</a><br>{% endfor %}',
        headers: {
          'Content-Type': 'text/html',
        }
      },
      // get route
      {
        path: '/admin/routes',
        method: 'get',
        host: process.argv[2],
        service: 'routes',
        permissions: ['admin', 'superadmin'],
        middlewares: ['cookie', 'authorize', 'validation'],
        view: '<form method="POST" action="/admin/routes/update"><input type="hidden" value="{{ doc._id }}" name="id"><textarea name="view">{{ doc.view }}</textarea><input type="text" name="permissions" value="{{ doc.permissions }}"><input type="text" name="widgets" value="{{ doc.widgets }}"><input type="text" name="middlewares" value="{{ doc.middlewares }}"><textarea name="headers">{{ doc.headers | dump }}</textarea><textarea name="validators">{{ doc.validators | dump }}</textarea><input type="text" name="additionalHeader" value="{{ doc.additionalHeader }}"><input type="text" name="additionalFooter" value="{{ doc.additionalFooter }}"><input type="submit" value="Send"></form>',
        headers: {
          'Content-Type': 'text/html',
        },
        validators: {
          properties: {
            "id": { "type": "string" }
          }
        }
      },
      // update post
      {
        path: '/admin/routes/update',
        method: 'post',
        host: process.argv[2],
        service: 'routes',
        permissions: ['admin', 'superadmin'],
        middlewares: ['validation', 'cookie', 'authorize'],
        headers: {
          'Location': process.argv[2]
        },
        validators: {
          properties: {
            "id": { "type": "string" },
            "view": { "type": "string" },
            "method": { "type": "string" },
            "permissions": { "type": "string" },
            "widgets": { "type": "string" },
            "middlewares": { "type": "string" },
            "headers": { "type": "string" },
            "validators": { "type": "string" },
            "additionalHeader": { "type": "string" },
            "additionalFooter": { "type": "string" },
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
