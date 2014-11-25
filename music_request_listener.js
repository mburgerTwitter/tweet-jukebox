'use strict';

var config = require('./config');
var Stream = require('./libs/' + config.twitter.capture_strategy + '_strategy');
var TweetParser = require('./libs/tweet_parser');
var Music = require('./libs/mopidy');

Stream.init();

var currentTrack = 0;

Stream.onTweet(function(tweet) {
    var request = TweetParser.parse(tweet);

    console.log("Tweet: "+tweet.text);
    if (request) {
        console.log("Request from @"+ request.fromUser +": " + request.type + " " + JSON.stringify(request.param));
        if (request.type == "SEARCH") {
            var music = Music.search(request.param, function(m) {
                if (m) {
                    console.log("Music: " + m.name + "\n("+JSON.stringify(m)+")" );
                    Music.add(m.uri, function() {
                        Music.getPlayerState(function(state){
                            if (state != "playing") {
                                Music.play();
                            }
                        });
                    });
                } else {
                    console.log("Didn't find a music...");
                }
            });
        }
    }
});

Stream.onDM(function(dm) {
    // direct_message
    //  sender_screen_name
    //  text
    //  recipient_screen_name
    //  entities
    console.log(JSON.stringify(dm));
});

