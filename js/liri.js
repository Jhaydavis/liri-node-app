//Load required packages and assignment of global variable

var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var spotify = require("spotify");
var Twitter = require("twitter");
var client = new Twitter(keys.twitterKeys);
var myCommand = process.argv[2];
var theArtist = process.argv[3];

//Start Functions to capture user input and do something based on Switch options

beginCode(myCommand, theArtist);

function beginCode(mCom, theArtist) {
	switch (mCom) {
		case 'my-tweets':
			runTwitter();
			break;

		case "spotify-this-song":
			runSpotify(theArtist);
			break;

		case "movie-this":
			runOMDB(theArtist);
			break;

		case "do-what-it-says":
			runRandom();
			break;

		default:
			break;
	}
}

function runTwitter() {

	//From twitter's NPM documentation, grab the most recent tweets
	var params = {
		screen_name: "jhayfullstack",
		count: 20
	};
	var tweetsLength;

	

	client.get('statuses/user_timeline', params, function (error, tweets, response) {
		if (error) throw error;
		tweetsLength = 0;
		console.log("made it this far");

		for (var i = 0; i < tweets.length; i++) {
			tweetsLength++;
		}
		if (tweetsLength > 20) {
			tweetsLength = 20;
		}
		for (var i = 0; i < tweetsLength; i++) {
			console.log("Tweet " + (i + 1) + " created on: " + tweets[i].created_at);
			console.log("Tweet " + (i + 1) + " text: " + tweets[i].text);
			console.log("******************************************************");

			appendFile("Tweet " + (i + 1) + " created on: " + tweets[i].created_at);
			appendFile("Tweet " + (i + 1) + " text: " + tweets[i].text);
			appendFile("******************************************************");
			
		}
	});
}

function upperCase(string) {
	return string.toUpperCase();
}

function titleCase(string) {
	var firstLetter = /(^|\s)[a-z]/g;
	return string.replace(firstLetter, upperCase);
}

function runSpotify(song) {
	var songName;

	if (song != null) {
		songName = titleCase(song);
	} else {
		//If a song was not typed it, default to the song The Sign
		songName = "The Sign";
	}
	console.log("Searching for: " + songName);
	console.log("******************************************************");
	console.log("");

	appendFile("Searching for: " + songName);
	appendFile("******************************************************");

	var Spotify = require('node-spotify-api');

	var spotify = new Spotify({
		id: 'c8a05ac256924c0788d87146d19d45ae',
		secret: '44fbc98a08cd475a8bb0ab6c9c1d2b59'
	});

	spotify.search({
		type: 'track',
		query: songName
	}, function (err, data) {
		if (err) {
			console.log('Error occurred: ' + err);
			return;
		}

		var matchedTracks = [];
		var dataItems = data.tracks.items;

		for (var i = 0; i < 20; i++) {
			if (data.tracks.items[i].name == songName) {
				matchedTracks.push(i);
			}
		}

		console.log(matchedTracks.length + " tracks found that match your query.");
		appendFile(matchedTracks.length + " tracks found that match your query.");

		if (matchedTracks.length > 0) {
			console.log("Track: " + dataItems[matchedTracks[0]].name);
			console.log("Artist: " + dataItems[matchedTracks[0]].artists[0].name);
			console.log("Album: " + dataItems[matchedTracks[0]].album.name);
			console.log("Spotify link: " + dataItems[matchedTracks[0]].external_urls.spotify);
			console.log("");
			console.log("***************** End of File ******************")
			console.log("");
			console.log("");

			appendFile("Track: " + dataItems[matchedTracks[0]].name);
			appendFile("Artist: " + dataItems[matchedTracks[0]].artists[0].name);
			appendFile("Album: " + dataItems[matchedTracks[0]].album.name);
			appendFile("Spotify link: " + dataItems[matchedTracks[0]].external_urls.spotify);
		} else if (matchedTracks.length == 0) {
			console.log("Sorry, but spotify does not contain that song in their database :(");
			appendFile("Sorry, but spotify does not contain that song in their database :(");
		}

	});
}

function runOMDB(movieName) {
	//If no movie entered, set default to Mr. Nobody
	if (theArtist == null) {
		movieName = "Mr. Nobody";
	}

	var requestURL = "http://www.omdbapi.com/?t=" + movieName + "&tomatoes=true&y=&plot=short&r=json&apikey=40e9cece";

	request(requestURL, function (error, response, data) {

		if (!error && response.statusCode == 200) {
			console.log("Everything working fine.");
		}
		console.log("");
		console.log("");
		console.log("******************************************************");
		console.log("Title of movie: " + JSON.parse(data)["Title"]);
		console.log("The release year was: " + JSON.parse(data)["Year"]);
		console.log("The rating was: " + JSON.parse(data)["imdbRating"]);
		console.log("Country of origin: " + JSON.parse(data)["Country"]);
		console.log("Original language: " + JSON.parse(data)["Language"]);
		console.log("Plot: " + JSON.parse(data)["Plot"]);
		console.log("Actors: " + JSON.parse(data)["Actors"]);
		console.log("Rotten Tomatoes Rating: " + JSON.parse(data)["tomatoRating"]);
		console.log("Rotten Tomatoes URL: " + JSON.parse(data)["tomatoURL"]);
		console.log("******************************************************");
		console.log("");
		console.log("");

		appendFile("******************************************************");
		appendFile("Title of movie:" + JSON.parse(data)["Title"]);
		appendFile("The release year was: " + JSON.parse(data)["Year"]);
		appendFile("The rating was: " + JSON.parse(data)["imdbRating"]);
		appendFile("Country of origin: " + JSON.parse(data)["Country"]);
		appendFile("Original language:: " + JSON.parse(data)["Language"]);
		appendFile("Plot: " + JSON.parse(data)["Plot"]);
		appendFile("Actors: " + JSON.parse(data)["Actors"]);
		appendFile("Rotten Tomatoes Rating: " + JSON.parse(data)["tomatoRating"]);
		appendFile("Rotten Tomatoes URL: " + JSON.parse(data)["tomatoURL"]);
	});
}

function runRandom() {
	//take the text inside of random.txt and then use it to call a LIRI's commands

	fs.readFile("random.txt", 'utf8', function (err, data) {

		var dataArr = data.split(',');
		var randomUserCommand = dataArr[0];
		var randomArtName = dataArr[1];

		console.log("You requested to " + "<" + randomUserCommand + "> with " + randomArtName);
		appendFile("You requested to " + "<" + randomUserCommand + "> with " + randomArtName);

		randomArtName = randomArtName.replace(/^"(.*)"$/, '$1');

		doNext(randomUserCommand, randomArtName);
	});
}

function appendFile(dataToAppend) {

	fs.appendFile("log.txt", dataToAppend, function (err) {
		if (err) {
			return console.log(err);
		}
	});
}