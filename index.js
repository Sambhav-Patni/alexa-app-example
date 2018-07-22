var express = require("express");
var alexa = require("alexa-app");
var https = require('https');

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
    var endpoint = "http://beatsapi.media.jio.com/v2_1/beats-api/jio/src/response/search2/wicked+game+by+issak/english" // ENDPOINT GOES HERE
    var body = ""
    https.get(endpoint, (response) => {
      response.on('data', (chunk) => { body += chunk })
      response.on('end', () => {
        var data = JSON.parse(body)
        var title = data.result.data["Best Match"][0].title
      })
    });
    response.say(request.slot("NAME")+" G key jai jai car");
  }
);

app.listen(PORT, () => console.log("Listening on port " + PORT + "."));
