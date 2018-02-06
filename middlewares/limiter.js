'use strict';
const db = require('../db');

exports.handler = async (req, res, callback) => {
  try {
    const ttl = 60 * 1000;
    let ip = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    // this check is necessary for some clients that set an array of IP addresses
    ip = (ip || '').split(',')[0];
    const collection = db.get().collection('limiters');


    const limit = await collection.findOne({ ip: ip, host: req.headers.host });
    let hits = 0;
    let createdAt = new Date();
    if (!limit) {
      await collection.insert({ 
        ip: ip,
        host: req.headers.host,
        hits: 1,
        createdAt: createdAt
      });
      hits = 1;
    } else {
      await collection.updateOne({ ip: ip }, { $inc: { hits: 1 } });
      hits = limit.hits + 1;
      createdAt = limit.createdAt;
    }

    const timeUntilReset = ttl - (new Date().getTime() - createdAt.getTime());
    const remaining = Math.max(0, (req.routeInformations.rateLimit - hits));

    res.setHeader('X-Rate-Limit-Limit', req.routeInformations.rateLimit);
    res.setHeader('X-Rate-Limit-Remaining', remaining);
    res.setHeader('X-Rate-Limit-Reset', timeUntilReset);

    if (hits < req.routeInformations.rateLimit) {
      callback(null, 'done');
    } else {
      res.statusCode = 429;
      callback('rateLimitExceeded');
    }

  } catch (e) {
    callback(e);
  }
};
