'use strict';
const Ajv = require('ajv');
const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true
});

exports.handler = (req, res, callback) => {
  let data;
  if (req.body) {
    data = req.body;
  } else if (Object.keys(req.params).length > 0) {
    data = req.params;
  } else {
    return callback('wrongRequest');
  }
  if (!req.routeInformations.validators) {
    callback('missingValidators');
  } else {
    const valid = ajv.validate(req.routeInformations.validators, data);
    if (!valid) {
      req.validationErrors = ajv.errors;
      callback(null, 'done');
    } else {
      callback(null, 'done');
    }
  }
};
