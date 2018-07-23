'use strict';
var rp = require('request-promise');
var ENDPOINT = 'http://beatsapi.media.jio.com/v2_1/beats-api/jio/src/response/search2/wicked+game+by+issak/english';

function FAADataHelper() {
}

FAADataHelper.prototype.requestAirportStatus = function(airportCode) {
  return this.getAirportStatus(airportCode).then(
    function(response) {
      console.log('success - received airport info for ' + airportCode);
      //console.log(response.body);
      var data = JSON.parse(response.body);
      var title = data.result.data["Best Match"][0].title;
      console.log("title: "+title);
      return title;
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
