'use strict';

const db = require('../db');

async function init() {
  try {
    const collection = db.get().collection('routes');

    // add logout
    await collection.insertOne({
      path: '/logout',
      method: 'get',
      host: process.argv[2],
      service: 'auth',
      middlewares: ['cookie'],
      headers: {
        'Location': process.argv[2]
      }
    });
    // login view
    await collection.insertOne({ 
      path: '/login',
      method: 'get',
      host: process.argv[2],
      view: '<form method="POST" action="/login"><input type="text" name="email"><input type="password" name="password"><input type="submit" value="Login"></form>',
      headers: {
        'Content-Type': 'text/html',
      }
    });
    // login post
    await collection.insertOne({
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
    });
    // registration view
    await collection.insertOne({ 
      path: '/registration',
      method: 'get',
      host: process.argv[2],
      view: '<form method="POST" action="/registration"><input type="text" name="email"><input type="password" name="password"><input type="submit" value="Login"></form>',
      headers: {
        'Content-Type': 'text/html',
      }
    });
    // registration post
    await collection.insertOne({
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
    });


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
