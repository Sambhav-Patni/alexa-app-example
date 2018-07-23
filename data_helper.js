'use strict';
var rp = require('request-promise');
var ENDPOINT = 'http://beatsapi.media.jio.com/v2_1/beats-api/jio/src/response/search2/wicked+game+by+issak/english';

function FAADataHelper() {
}

FAADataHelper.prototype.requestAirportStatus = function(airportCode) {
  return this.getAirportStatus(airportCode).then(
    function(response) {
      console.log('success - received airport info for ' + airportCode);
      console.log(response.body);
      return response.body;
    }
  );
};

FAADataHelper.prototype.getAirportStatus = function(airportCode) {
  var options = {
    method: 'GET',
    uri: ENDPOINT,
    resolveWithFullResponse: true,
    json: true
  };
  return rp(options);
};


module.exports = FAADataHelper;
