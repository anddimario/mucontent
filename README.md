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
- run dev mode (require nodemon): `npm run dev`     
or: `DATABASE='mongodb://127.0.0.1:27017/mucontent' node app.js`
- (optional) initialize `auth` and `users` services, you must run the init script as describe below

### Init scripts
Run with: `DATABASE='<URL>' node <PATH>/<SCRIPT_NAME> <HOST>`   
**NOTE** Init scripts are usually in the service's directory

### Docs
Read on [wiki](https://github.com/anddimario/mucontent/wiki)

### Extras
- [ansible-mucontent](https://github.com/anddimario/ansible-mucontent): ansible configuration for a mucontent sistem

License: **MIT**
