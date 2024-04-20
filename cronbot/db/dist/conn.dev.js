"use strict";

var _require = require('mongodb'),
    MongoClient = _require.MongoClient;

var uri = 'mongodb+srv://defibizzylos:aaf0NKQ5yZKy9Z8Z@cluster0.p9e2zcv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
var client = new MongoClient(uri);
var db;

connectToDatabase = function connectToDatabase() {
  return regeneratorRuntime.async(function connectToDatabase$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(client.connect());

        case 3:
          db = client.db("uniswap");
          console.log("Connected to MongoDB");
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

getDb = function getDb() {
  return db;
};

module.exports = {
  getDb: getDb,
  connectToDatabase: connectToDatabase
};