## Mucontent
Multi site, multi content, multi language, modular CMS. The idea is to use it from single server, to cloud, with mongodb, or cloud services (azure cosmodb, mlab etc).    
**Status** ALPHA

### Features
- pure nodejs, few dependencies
- expressjs style route
- multisite, multi content, multi language, modular
- views with nunjucks templates
- gzip responses
- cors (optional)
- custom headers (optional)
- middlewares (functions executed before the service)
- widgets (add templates render functions)
- built-in middlewares: cookie, authorize, validation
- auth and user services
- contents based on ajv schema
- single host and multi hosts routes manager
- error pages

### Todo
- services: image manager
- middlewares: rate limit
- embedded security
- improve routes and content manager
- services' doc
- ...

### Requirements
Nodejs (tested with v8.9.4) and mongodb (tested with v3.2)

### Installation
- clone the repo
- install: `npm install`
- run dev mode (require nodemon): `npm run dev`     
or: `DATABASE='mongodb://127.0.0.1:27017/mucontent' node app.js`
- (optional) initialize `auth` and `users` services, you must run the init script as describe below

### Init scripts
Run with: `DATABASE='<URL>' node <PATH>/<SCRIPT_NAME> <install/uninstall> <HOST>`   
**NOTE** Init scripts are usually in the service's directory and should have `install` and `uninstall` options.

### Docs
Read on [wiki](https://github.com/anddimario/mucontent/wiki)

### Extras
- [ansible-mucontent](https://github.com/anddimario/ansible-mucontent): ansible configuration for a mucontent system

License: **MIT**
