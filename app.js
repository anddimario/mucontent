'use strict';

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
      res.end(err);
    } else {
      res.end(zipped);
    }
  });

}

function renderError(req, res, route, err) {
  // see if render template (html)
  if (route.headers['Content-Type'] === 'text/html') {

    const templateHost = req.headers.host.split(':')[0];
    // create the template
    let template = '';
    if (templates[`${templateHost}-header`]) {
      template += templates[`${templateHost}-error-header`];
    }
    template += err.toString();
    if (templates[`${templateHost}-footer`]) {
      template += templates[`${templateHost}-error-footer`];
    }
    const html = ejs.render(template, renderInfo);
    response(req, res, html);
  } else {
    response(req, res, {error: err.toString()});
  }
}

function renderResults(req, res, route, renderInfo) {
  res.statusCode = 200;
  // see if render template (html)
  if (route.headers['Content-Type'] === 'text/html') {
    // check if language is setted
    if (req.session && req.session.language) {
      // Check if locales exists for the language
      if (route.locales && route.locales[req.session.language]) {
        const locale = route.locales[req.session.language];
        for (let c in locale) {
          renderInfo[c] = locale[c];
        }
      }
    }
    // Check if there are additional injectable header and footer
    if (route.additionalHeader) {
      renderInfo.additionalHeader = route.additionalHeader;
    }
    if (route.additionalFooter) {
      renderInfo.additionalFooter = route.additionalFooter;
    }
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
    response(req, res, result.body);
  }
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

    if (stringBody) {
      req.body = stringBody;
    }
    if (parsedUrl.query) {
      req.params = parsedUrl.query
    }
    // add useful route informations to req
    req.routeInformations = {};
    if (route.permissions) {
      req.routeInformations.permissions = route.permissions;
    }
    if (route.validators) {
      req.routeInformations.validators = route.validators;
    }
    // use middlewares (waterfall)
    const middlewaresTasks = [];
    if (route.middlewares) {
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
            req.previousMiddleware = previous; // pass previous results to next, with previousMiddleware
            require(`./middlewares/${route.middlewares[i]}`).handler(req, res, (err, results) => {
              callback(err, results);
            })
          });
        }
      }
    }
    async.waterfall(middlewaresTasks, (err, resMiddlewares) => {
      if (err) {
        renderError(req, res, route, err);
      } else {
        const lambdaTasks = [];
        // add service, if it's defined
        if (route.service) {
          const lambda = require(`${__dirname}/services/${route.service}/index`);
          lambdaTasks.push((callback) => {
            lambda.handler(req, res, (err, results) => {
              callback(err, results)
            });
          });
        }
        // add widgets, if they exists
        if (route.widgets) {
          for (let i = 0; i < route.widgets.length; i++) {

            lambdaTasks.push((callback) => {
              const widget = require(`./widgets/${route.middlewares[i]}`).handler(req, res, (err, results) => {
                callback(err, results);
              });
            });

          }
        }
        if (!route.headers['Location']) {
          for (const header in route.headers) {
            res.setHeader(header, route.headers[header]);
          }
        }
        // Check if it's a redirection, change the status code
        if (lambdaTasks.length > 0) {
          async.parallel(lambdaTasks, (err, lambdasRes) => {
            if (err) {
              renderError(req, res, route, err);             
            } else {
              if (route.headers['Location']) {
                res.writeHead(302, { 'Location': `http://${route.headers['Location']}` });
                res.end();
              } else {
                // create render informations object
                const renderInfo = {};
                for (let i = 0; i < lambdasRes.length; i++) {
                  const info = lambdasRes[i];
                  for (let c in info) {
                    renderInfo[c] = info[c];
                  }
                }
                renderResults(req, res, route, renderInfo);
              }
            }
          });
        } else {
          const renderInfo = {};
          renderResults(req, res, route, renderInfo);
        }
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
    collection.findOne({ path: parsedUrl.pathname, host: req.headers.host, method: req.method.toLowerCase() }, (err, route) => {
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
    collection.find({ cached: true }).toArray((err, routes) => {

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
