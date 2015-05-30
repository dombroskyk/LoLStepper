var https = require('https');
var config = require('../config');

function parseMatch( matchId, renderCallback ) {
	//check if match is already in Mongo
	//if yes, fetch
	//if no, query for it, store in mongo
	
	var match = {};
	var matchReqOptions = {
		host: config.RIOT_API.API_HOST,
		path: config.RIOT_API.MATCH_PATH + matchId + "?includeTimeline=true&api_key=" + config.RIOT_API.API_KEY
	}
	https.get(matchReqOptions, function(res) {
		//res.setEncoding("utf8"); i dont think the encoding is utf8
		res.on("data", function(chunk) {
			//parse JSON, store match
		});
		res.on("end", function() {
			//parse match for desired information
			renderCallback(match);
		});
	});
}

module.exports = parseMatch;
