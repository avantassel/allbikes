// Generated by CoffeeScript 1.8.0
(function() {
  var APIeasy, assert, async, city, code, codes, feeds, station, _i, _len;

  APIeasy = require("api-easy");

  async = require('async');

  assert = require("assert");

  feeds = require("../lib/feeds.json");

  station = APIeasy.describe("/bikeshare/stations");

  codes = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = feeds.length; _i < _len; _i++) {
      city = feeds[_i];
      _results.push(city.id);
    }
    return _results;
  })();

  station.use("localhost", 8080).setHeader("Content-Type", "application/json").followRedirect(false).discuss('Testing station').get('/bikeshare/stations').expect(200).undiscuss().discuss('Test bad endpoint').get('/bikeshare/spiderman').expect(404);

  for (_i = 0, _len = codes.length; _i < _len; _i++) {
    code = codes[_i];
    station.discuss("testing city " + code).get("/bikeshare/city/" + code).expect(200).undiscuss();
  }

  station["export"](module);

}).call(this);
