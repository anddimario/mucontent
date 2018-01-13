## Mucontent
Multisite, multi content, modular CMS. The idea is to use it on single machine, or on a distribuite env, with mongodb, or cloud services (azure cosmodb, mlab etc).    
**Status** ALPHA

### Features and informations
- pure nodejs, few dependencies
- expressjs route style
- multisite, multi content, modular
- ejs templates
- gzip responses
- cors (optional)
- custom headers (optional)
- middlewares (functions executed before the service)
- widgets (add templates render functions)

### Todo
- cookie and jwt manager
- validation and authorization middleware
- user manager
- error pages
- ....

### Requirements
Nodejs (tested with v8.9.4) and mongodb (tested with v3.2)

### Installation
- clone the repo
- install: `npm install`
- Run dev mode (require nodemon): `npm run dev`     
or: `DATABASE='mongodb://localhost:27017/mucontent' node app.js`

### Route example payload
```
{ 
  path: '/example',
  host: 'www.example.com',
  service: 'example', // directory in services/ used to execute response
  widgets: ['my-widget'], // widgets list
  middlewares: ['my-middleware'], // middlewares list
  view: 'here my html' // html to add to layout,
  cors: true, // optional, if true, enable cors
  headers: {}, // optional, header object
  cached: true, // optional, if set and true, routes are export in memory on app startup
}
```

### How use "hello world" example
Run app in your localhost, add this payload for routes in routes' mongodb collection:
```
db.routes.insert({ 
  path: '/hello-world',
  host: 'localhost:3000',
  service: 'hello-world',
  widgets: ['hello-world'],
  middlewares: ['hello-world'],
  view: 'This is a <b><%= helloWorldWidget %></b><br><%= service %>',
  headers: {
    'Content-Type': 'text/html',
  }
})
```
**NOTE** Middlewares are executed in the defined order and before the service, widgets are executed in parallel with service.

### Templates and views
In `templates` directory there are header and footer for each site (`<SITE_NAME>-header.ejs` and `<SITE_NAME>-footer.ejs`), views are stored in each route saved on mongodb.

### Add a service
Simple add a directory in `services` with `index.js` in expressjs route style. You can see an example with hello world and users.

### Route caching
Routes could be cached on memory on app startup, to do this, add `cached: true` in route's database record. Try to update the previous record:
```
db.routes.update({"_id" : ObjectId("YOUR_ROUTE_ID")},{$set: {cached:true}})
```

License: **MIT**