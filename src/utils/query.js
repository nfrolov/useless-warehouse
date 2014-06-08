var pg = require('pg');

module.exports = function (query, params, cb) {
  pg.connect(process.env.DATABASE_URL, function (err, client, done) {
    if (err) return done(), cb(err);
    client.query(query, params, function (err, result) {
      done();
      cb(err, result && result.rows || [], result);
    });
  });
};
