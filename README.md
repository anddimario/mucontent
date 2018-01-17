## Mucontent
Multi site, multi content, multi language, modular CMS. The idea is to use it on single machine, or on a distribuite env, with mongodb, or cloud services (azure cosmodb, mlab etc).    
**Status** ALPHA

### Features
- pure nodejs, few dependencies
- expressjs route style
- multisite, multi content, multi language, modular
- views with ejs templates
- gzip responses
- cors (optional)
- custom headers (optional)
- middlewares (functions executed before the service)
- widgets (add templates render functions)
- built-in middlewares: cookie, authorize, validation
- auth and user services
- error pages

### Todo
- single host routes manager
- ....

### Requirements
Nodejs (tested with v8.9.4) and mongodb (tested with v3.2)

### Installation
- clone the repo
- install: `npm install`
- Run dev mode (require nodemon): `npm run dev`     
or: `DATABASE='mongodb://127.0.0.1:27017/mucontent' node app.js`

### Init scripts
Run with: `DATABASE='<URL>' node <PATH>/<SCRIPT_NAME> <HOST>`   
**NOTE** Init scripts are usually in the service's directory

### Route example payload
```
{ 
  path: '/example',
  host: 'www.example.com',
  method: '<HTTP_METHOD>',
  permissions: ['roleA'], // optional, roles' allowed list
  service: 'example', // optional, directory in services/ used to execute response
  widgets: ['my-widget'], // optional, widgets list
  middlewares: ['my-middleware'], // optional, middlewares list
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
  method: 'get',
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
In `templates` directory there are header and footer for each site (`<SITE_HOST>-header.ejs` and `<SITE_HOST>-footer.ejs`), and for errors (`<SITE_HOST>-error-header.ejs` and `<SITE_HOST>-error-footer.ejs`) . Views are stored in each route saved on mongodb.

### Additional header and footer
You can add additional header and footer for every route, for example for javascript or css. Add in your header template: `<%= additionalHeader %>` of in footer: `<%= additionalHeader %>`    
Then in your route object in mongodb add the fields.   
**NOTE** This fields must be strings.

### Add a service
Simple add a directory in `services` with `index.js` in expressjs route style. You can see an example with hello world and users.

### Route caching
Routes could be cached on memory on app startup, to do this, add `cached: true` in route's database record. Try to update the previous record:
```
db.routes.update({"_id" : ObjectId("YOUR_ROUTE_ID")},{$set: {cached:true}})
```

### Cookies
Add to middlewares array `cookie`, then in `req.session` you can get all the session informations, included `sessionId`. You can simply add informations to session using mongodb in every service, for example add the username in session:
```
  req.session.store(req.session.sessionId, {
    username: 'myUsername'
  }, (err, done) => {
    ....
  })
```

### Authorize
Use hello-world example, with this route:
```
db.routes.insert({ 
  path: '/hello-world',
  host: 'localhost:3000',
  method: 'get',
  permissions: ['user'],
  service: 'hello-world',
  widgets: ['hello-world'],
  middlewares: ['hello-world', 'cookie', 'authorize'],
  view: 'This is a <b><%= helloWorldWidget %></b><br><%= service %>',
  headers: {
    'Content-Type': 'text/html',
  }
})
```
**NOTE** In this example is added the `permissions` attribute (an array of allowed roles) and the `authorize` middleware.     
**IMP** Authorize middleware must be added after `cookie`, because it use `req.session.userId` to get user role attribute and check with route permissions. So you must store the `userId` on session and the user must have an attribute called `role`.

### Multi language
An example route for multilanguage:
```
db.routes.insert({ 
  path: '/lang-example',
  host: 'localhost:3000',
  method: 'get',
  middlewares: ['cookie'],
  view: '<%= myText %>',
  headers: {
    'Content-Type': 'text/html',
  },
  locales: {
    it: {
			myText: 'mio testo in ita'
		}, en: {
			myText: 'my text in english'
		}
  }
})
```
**IMP** `cookie` middleware must be used to read the language selected that must be stored in session as `language`.    
**NOTE IMP** As you can see, in this route, widgets and services are not defined, you can in this way simply render a page. Middlewares are optional too.

### Validation
To use validation, you must define a route with:
```
db.routes.insert({ 
  path: '/hello-world',
  host: 'localhost:3000',
  method: 'get',
  service: 'hello-world',
  widgets: ['hello-world'],
  middlewares: ['hello-world', 'validation'],
  view: 'This is a <b><%= helloWorldWidget %></b><br><%= service %>',
  headers: {
    'Content-Type': 'text/html',
  },
  validators: {
    properties: {
      "test": { "type": "number" }
    }
  }
})
```
**NOTE** If method is `GET`, validators works for querystring params.    
**NOTE** It's used validation middleware and a `validators` value is defined in the route with schema (supported by [ajv](https://github.com/epoberezkin/ajv/))    
**IMP** Validation middleware doesn't response with an error, but add a variable in `req` useful to use on your service. So the variable `req.validationErrors` contains the error array in ajv format.

### Redirection
If you need a redirection, set the header in `headers` values as:    
`'Location': <YOUR_ADDRESS>`

License: **MIT**
