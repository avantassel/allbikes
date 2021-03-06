// Generated by CoffeeScript 1.10.0
(function() {
  var async, parser, request, xml2js;

  async = require('async');

  request = require('request');

  xml2js = require('xml2js');

  parser = new xml2js.Parser({
    explicitArray: false
  });

  module.exports = {
    allowCrossDomain: function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      if ('OPTIONS' === req.method) {
        return res.send(200);
      } else {
        return next();
      }
    },
    calcDistance: function(coord1, coord2) {
      var dist, distance, lat1, lat2, lon1, lon2, radlat1, radlat2, radlon1, radlon2, radtheta, ref, ref1, theta;
      ref = [coord1.lat, coord1.long], lat1 = ref[0], lon1 = ref[1];
      ref1 = [coord2.lat, coord2.long], lat2 = ref1[0], lon2 = ref1[1];
      radlat1 = Math.PI * lat1 / 180;
      radlat2 = Math.PI * lat2 / 180;
      radlon1 = Math.PI * lon1 / 180;
      radlon2 = Math.PI * lon2 / 180;
      theta = lon1 - lon2;
      radtheta = Math.PI * theta / 180;
      dist = Math.sin(radlat1) * Math.sin(radlat2);
      dist += Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist);
      dist *= 180 / Math.PI;
      dist *= 60 * 1.1515;
      return distance = {
        'mi': Math.floor(dist),
        'km': Math.floor(dist * 1.609344)
      };
    },
    get: function(resource, done) {
      var id, url;
      url = resource.url, id = resource.id;
      return async.waterfall([
        function(next) {
          return request({
            method: 'GET',
            url: url
          }, next);
        }, function(resp, body, next) {
          var addCity, parseJSON, parseXML;
          if (!resp) {
            return next('resp is undefined. uh oh.');
          }
          if (resp.statusCode < 200 || resp.statusCode > 302) {
            return next("bad " + body);
          }
          addCity = function() {
            return body.map(function(station) {
              station.city_id = id;
              return station;
            });
          };
          parseJSON = function() {
            var err, error;
            try {
              body = JSON.parse(body);
              body = body.stationBeanList || body.stations || body;
              body = addCity();
              return next(null, body);
            } catch (error) {
              err = error;
              return next(err);
            }
          };
          parseXML = function() {
            return parser.parseString(body, function(err, result) {
              if (result.stations && result.stations.station) {
                body = result.stations.station;
              } else if (result.locations && result.locations.location) {
                body = result.locations.location;
              }
              body = addCity();
              return next(null, body);
            });
          };
          switch (resp.headers['content-type']) {
            case 'application/json':
            case 'application/json; charset=utf-8':
              return parseJSON();
            case 'text/html; charset=UTF-8':
            case 'text/html':
              return parseJSON();
            case 'application/xml':
            case 'text/xml':
              return parseXML();
            case 'text/javascript; charset=utf-8':
              body = body.replace(/\\/g, '');
              return parseJSON();
            default:
              return next("Unknown content type | " + url);
          }
        }
      ], function(err, body) {
        return done(err, body);
      });
    },
    unused_fields: ['altitude', 'city', 'installDate', 'installed', 'landMark', 'lastCommunicationTime', 'lastCommWithServer', 'latestUpdateTime', 'postalCode', 'public', 'removalDate', 'stAddress1', 'stAddress2', 'testStation', 'terminalName', 'temporary', 'Address', 'Id', 'Distance', 'StationAdList', 's', 'n', 'st', 'b', 'su', 'm', 'lu', 'lc', 'bk', 'bl', 'lo', 'dx', 'bx']
  };

}).call(this);
