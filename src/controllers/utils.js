var pg = require('pg'),
    async = require('async');

exports.conninfo = function (req, res) {
  var client = new pg.Client(process.env.DATABASE_URL);
  async.waterfall([
    function (cb) {
      client.connect(cb);
    },
    function (client, cb) {
      client.query(
        " SELECT table_name as name " +
        "   FROM information_schema.tables " +
        "  WHERE table_schema = 'warehouse' ",
        cb
      );
    },
    function (result, cb) {
      async.map(result.rows, function (table, cb) {
        client.query(
          " SELECT * " +
          "   FROM information_schema.columns " +
          "  WHERE table_name = $1 " +
          "    AND table_schema = 'warehouse' ",
          [table.name],
          function (err, result) {
            if (err) return cb(err);
            table.columns = result.rows;
            cb(null, table);
          }
        );
      }, cb);
    }
  ], function (err, tables) {
    client.end();
    if (err) {
      return res.send(500, err.toString());
    }
    res.render('utils/conninfo', {
      tables: tables
    });
  });
};
