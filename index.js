var express = require("express");
var alexa = require("alexa-app");
var https = require('https');
var FAADataHelper = require('./data_helper');

var PORT = process.env.PORT || 8080;
var app = express();

// ALWAYS setup the alexa app and attach it to express before anything else.
var alexaApp = new alexa.app("sam");

alexaApp.express({
  expressApp: app,
  //router: express.Router(),

  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  checkCert: false,

  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  debug: true
});

// now POST calls to /test in express will be handled by the app.request() function

// from here on you can setup any other express routes or middlewares as normal
app.set("view engine", "ejs");

alexaApp.launch(function(request, response) {
  response.say("Hi Sambhav, You launched the app!");
});

alexaApp.dictionary = { "names": ["matt", "joe", "bob", "bill", "mary", "jane", "dawn"] };

alexaApp.intent("nameIntent", {
    "slots": { "NAME": "LITERAL" },
    "utterances": [
      "my {name is|name's} {names|NAME}", "set my name to {names|NAME}"
    ]
  },
  function(request, response) {
  var airportCode = request.slot('NAME');
    var reprompt = 'Tell me an airport code to get delay information.';
    if (airportCode=="") {
      var prompt = 'I didn\'t hear an airport code. Tell me an airport code.';
      response.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var faaHelper = new FAADataHelper();
      faaHelper.requestAirportStatus(airportCode).then(function(airportStatus) {
        var data = JSON.parse(airportStatus)
        var title = data.result.data["Best Match"][0].title
        console.log(title);
        response.say(title).send();
      }).catch(function(err) {
        console.log(err.statusCode);
        var prompt = 'I didn\'t have data for an airport code of ' + airportCode;
         //https://github.com/matt-kruse/alexa-app/blob/master/index.js#L171
        response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      return false;
    }  
  }
);

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));
