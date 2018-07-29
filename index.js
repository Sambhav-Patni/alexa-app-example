var express = require("express");
var alexa = require("alexa-app");
var request = require('request');

const BASE_URL = 'http://beatsapi.media.jio.com/v2_1/beats-api/jio/src/response/search2/';
const IMAGE_BASE = process.env.WEATHER_IMAGE_BASE;

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
	var stream = {
    "url": "https://www.wapbestwap.com/fastload/278781",
    "token": "aws-podcast-episode-139.mp3",    
    "offsetInMilliseconds": 0
  };
  response.audioPlayerPlayStream("REPLACE_ALL", stream);
  response.say("Hii Sambhav, The App is launched!");
});

alexaApp.dictionary = { "names": ["matt", "joe", "bob", "bill", "mary", "jane", "dawn"] };

alexaApp.intent("nameIntent", {
    "slots": { "NAME": "LITERAL" },
    "utterances": [
      "my {name is|name's} {names|NAME}", "set my name to {names|NAME}"
    ]
  },
  function(request, response) {
  var InputName = request.slot('NAME');
	
		return getTitle(InputName)
                .then(rc=> {
			if (rc.statusText >= 400) {
      			return response.fail();
    			} else {
                    	console.log('responding to weather request for ' + InputName + ' with ', rc);
                    	return response.say(rc.text);
			}
		});
	
  //response.say(getTitle(InputName).text);                
  console.log("#END#");
  //response.say("Sambhav ji ki jai jai kaar");  
  }
);


function buildResponse(session, speech, card, end) {
    return {
        version: '1.0',
        sessionAttributes: session,
        response: {
            outputSpeech: {
                type: 'SSML',
                ssml: speech
            },
            card: card,
            shouldEndSession: !!end
        }
    };
}

function getTitle(inputText) {
    return new Promise(function(resolve, reject) {
        
		console.log("Request: "+BASE_URL + inputText + "/english");
        request({
            url: BASE_URL + inputText + "/english",
            json: true
        }, function(err, res, body) {
            let data, text, card;                

            if (err || res.statusCode >= 400) {
                console.error(res.statusCode, err);
                return reject('Unable to get weather data!');
            }
			data = body.result.data["Best Match"][0].title;                      

            if (!data) {
                return reject('I have no data for that day!');
            }
			
			console.log(body.result.data["Best Match"][0].title);
            text = body.result.data["Best Match"][0].title;
			
            card = {
                type: 'Standard',
                title: 'Best Match for ' + inputText,
                text: text,
                image: {
                    smallImageUrl: IMAGE_BASE + data.icon + '.png',
                    largeImageUrl: IMAGE_BASE + data.icon + '.png'
                }
            };

            resolve( { text, card } );
        });
    });
}



app.listen(PORT, () => console.log("Listening on port " + PORT + "."));
