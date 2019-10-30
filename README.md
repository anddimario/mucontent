## Mucontent

Multi site, multi content, multi language, modular CMS. The idea is to use it from single server, to cloud, with mongodb, or cloud services (azure cosmodb, mlab etc).    

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
- built-in middlewares: cookie, authorize, validation, rate limit
- auth and user services
- contents based on ajv schema
- uploads on disk
- single host and multi hosts routes manager
- error pages

### Todo

- improve services
- embedded security
- services' doc
- ...

### Requirements

Nodejs (tested with v8.9.4) and mongodb (tested with v3.2)

### Installation

- clone the repo
- install: `npm install`
- run dev mode (require nodemon): `npm run dev`
- (optional) services are not enabled, you must run the init script as describe below
- (optional) `UPLOAD_DIR` is used by uploads service

### Init scripts

Run with: `DATABASE_URL='<url>' DATABASE='<dbname>' node <PATH>/<SCRIPT_NAME> <install/uninstall> <HOST>`
**NOTE** Init scripts are usually in the service's directory and should have `install` and `uninstall` options.

### Docs

Read on [wiki](https://github.com/anddimario/mucontent/wiki)

### Extras

- [ansible-mucontent](https://github.com/anddimario/ansible-mucontent): ansible configuration for a mucontent system

License: **MIT**
