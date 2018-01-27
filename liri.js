require ("dotenv").config();

//code to grab data from keys.js file
var keys = require("./keys.js");

//  npm packages
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
var fs = require('fs');



var spotify = new Spotify({
  id: 0e7f3c419a7944698b95139af6f84d0f,
  secret: a4752121b54d4e44877d8c4abfc94680
});
let client = new Twitter(keys.twitter)

//Grab the userInput which will always be the third node arg.
var userInput = process.argv.slice(3).join("+");

//command line argument will always be liri 
var command = process.argv[2];

// commands for liri to take in 
switch (command) {


    case "my-tweets":
        tweet();
        break;

    case "movie-this":
        movie();
        break;

    case 'do-what-it-says':
        whatItSays();
        break;

    case "spotify-this-song":
        spotifyThis();
        break;
    default:
        console.log("Liri wants you to try again!");
}

// twitter - shows last 20 tweets

function tweet() {
    var params = { screen_name: 'pebbles3408', count: 20 };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                //console.log(response); // Show the full response in the terminal
                var twitterTweets =
                    "@" + tweets[i].user.screen_name + ": " +
                    tweets[i].text + "\r\n" +
                    "created: " + tweets[i].created_at
                console.log("\r\n" + "========================= Your Tweets =========================" + "\r\n");
                console.log(twitterTweets);
                //log to log.txt file      
                Log(twitterTweets);
            }
        }
    });
  }

    // spotify setup shows song name, preview link of song, and if applicable the album the song is from


    function spotifyThis() {
        if (!userInput) {
            userInput = "I want it That Way";
        }
        spotify.search({ type: "track", query: userInput, },
            function(err, data) {
                if (err) {
                    console.log('Error occurred: ' + err);
                    return;
                } else {
                    console.log("\r\n" + "========================= Your Song =========================" + "\r\n");
                    console.log("Artist: " + data.tracks.items[0].artists[0].name);
                    console.log("Song: " + data.tracks.items[0].name);
                    console.log("Album: " + data.tracks.items[0].album.name);
                    console.log("Preview Here: " + data.tracks.items[0].preview_url);
                    //log to log.txt file
                    Log(data.tracks.items[0].artists[0].name + "\r\n" + data.tracks.items[0].name + "\r\n" +
                        data.tracks.items[0].album.name + "\r\n" + data.tracks.items[0].preview_url);
                }
            });
    };


    //run a request to the OMDB API with the movie specified and returns the following-
    // ```
    //   * Title of the movie.
    //   * Year the movie came out.
    //   * IMDB Rating of the movie.
    //   * Rotten Tomatoes Rating of the movie.
    //   * Country where the movie was produced.
    //   * Language of the movie.
    //   * Plot of the movie.
    //   * Actors in the movie.
    // ```
    function movie() {
        if (!userInput) {
            userInput = "Mr Nobody";
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=1f13cdfe";

        request(queryUrl, function(error, response, body) {
            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {
                // Parse the body of the site and recover indivually  
                console.log("\r\n" + "========================= Your Movie =========================" + "\r\n");
                console.log("Title of Movie: " + JSON.parse(body).Title);
                console.log("Year Released: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language used: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
                console.log("==============================================================");
                //log to log.txt file
                Log(JSON.parse(body).Title + JSON.parse(body).Year + JSON.parse(body).Ratings[0].Value +
                    JSON.parse(body).Ratings[1].Value + JSON.parse(body).Country + JSON.parse(body).Language +
                    JSON.parse(body).Plot + JSON.parse(body).Actors);
            }
        });
    }
    // whatItSays
    function whatItSays() {
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
                return console.log(error);
            }
            //console.log(data);
            var dataArr = data.split(',');
            command = dataArr[0];
            userInput = dataArr[1];
            spotifyThis()
      });
    }