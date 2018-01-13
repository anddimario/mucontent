const querystring = require('querystring');
const http = require('http');
const url = require('url');
const db = require('./db');
const async = require('async');
const fs = require('fs');
const ejs = require('ejs');
const zlib = require('zlib');

const templates = {};
const cachedRoute = {};

// read templates files
fs.readdir('./templates', function (err, files) {
  files.forEach(file => {
    fs.readFile(`./templates/${file}`, { encoding: 'utf8' }, (err, content) => {
      if (err) {
        process.stdout.write(err.toString());
        process.exit(1);
      } else {
        const name = file.split('.')[0];
        templates[name] = content;
      }
    });
  });
});

function response(req, res, data) {
  res.setHeader('Content-Encoding', 'gzip');
  zlib.gzip(data, (err, zipped) => {
    if (err) {
      const date = Date.now();
      process.stdout.write(`${date} ${err}`);
      res.statusCode = 500;
      res.end();
    } else {
      res.end(zipped);
    }
  });

}

function processRoute(req, res, route, parsedUrl) {
  // Set CORS headers
  if (route.cors) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, HEAD, DELETE, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since');
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
  }

  const body = [];
  req.on('error', function (err) {
    process.stdout.write(err.toString());
  }).on('data', function (chunk) {
    body.push(chunk);
  }).on('end', function () {
    let stringBody = Buffer.concat(body).toString();
    if (stringBody && (req.headers['content-type'] === 'application/x-www-form-urlencoded')) {
      stringBody = querystring.parse(stringBody);
      //stringBody = JSON.stringify(stringBody);
    }

    const event = {
      host: req.headers.host,
      httpMethod: req.method,
      body: stringBody,
      queryStringParameters: parsedUrl.query
    };
    if (stringBody) {
      req.body = stringBody;
    }
    if (parsedUrl.query) {
      req.params = parsedUrl.query
    }
    // use middlewares (waterfall)
    const middlewaresTasks = [];
    for (let i = 0; i < route.middlewares.length; i++) {
      // First task
      if (i === 0) {
        middlewaresTasks.push((callback) => {
          require(`./middlewares/${route.middlewares[i]}`).handler(req, res, (err, results) => {
            callback(err, results);
          })
        });
      } else {

        middlewaresTasks.push((previous, callback) => {
          event.previous = previous; // pass previous results to next, with previous
          require(`./middlewares/${route.middlewares[i]}`).handler(req, res, (err, results) => {
            callback(err, res);
          })
        });
      }
    }
    async.waterfall(middlewaresTasks, (err, resMiddlewares) => {
      if (err) {
        res.statusCode = 500;
        res.end(`Error ${err}`);
      } else {
        const lambda = require(`${__dirname}/services/${route.service}/index`);
        const lambdaTasks = [(callback) => {
          lambda.handler(req, res, (err, results) => {
            callback(err, results)
          });
        }];
        // add widgets
        for (let i = 0; i < route.widgets.length; i++) {

          lambdaTasks.push((callback) => {
            const widget = require(`./widgets/${route.middlewares[i]}`).handler(req, res, (err, results) => {
              callback(err, results);
            });
          });

        }
        async.parallel(lambdaTasks, (err, lambdasRes) => {
          if (err) {
            res.statusCode = 500;
            res.end(`Error ${err}`);
          } else {
            res.statusCode = 200;
            for (const header in route.headers) {
              res.setHeader(header, route.headers[header]);
            }
            // create render informations object
            const renderInfo = {};
            for (let i = 0; i < lambdasRes.length; i++) {
              const info = lambdasRes[i];
              for (let c in info) {
                renderInfo[c] = info[c];
              }
            }
            // see if render template (html)
            if (route.headers['Content-Type'] === 'text/html') {
              const templateHost = req.headers.host.split(':')[0];
              // create the template
              let template = '';
              if (templates[`${templateHost}-header`]) {
                template += templates[`${templateHost}-header`];
              }
              template += route.view;
              if (templates[`${templateHost}-footer`]) {
                template += templates[`${templateHost}-footer`];
              }
              const html = ejs.render(template, renderInfo);
              response(req, res, html);
            } else {
              res.end(result.body);
            }
          }
        });
      }
    });
  });
}

const requestHandler = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  // Check if in cache
  if (cachedRoute[req.headers.host + parsedUrl.pathname]) {
    processRoute(req, res, cachedRoute[req.headers.host + parsedUrl.pathname], parsedUrl);
  } else {
    const collection = db.get().collection('routes');
    collection.findOne({ path: parsedUrl.pathname, host: req.headers.host }, (err, route) => {

      if (route) {
        processRoute(req, res, route, parsedUrl);
      } else {
        res.statusCode = 500;
        res.end('Service not exists');
      }
    });
  }
};

const server = http.createServer(requestHandler);
// Connect to Mongo on start
db.connect(process.env.DATABASE, function (err) {
  if (err) {
    process.stdout.write('Unable to connect to Mongo.');
    process.exit(1);
  } else {
    const collection = db.get().collection('routes');
    collection.find({cached: true}).toArray((err, routes) => {

      if (routes) {
        routes.forEach((route) => {
          cachedRoute[route.host + route.path] = route;
        });
      }
    });

    server.listen(process.env.PORT || 3000, (err) => {
      if (err) {
        process.stdout.write(err.toString());
        process.exit(1);
      }
      process.stdout.write(`Started on ${process.env.PORT | 3000}\r\n`);
    })

  }
});