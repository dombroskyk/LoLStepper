var http = require('http');
var config = require('../config');

function parseMatch( matchId ){
	//check if match is already in Mongo
	//if yes, fetch
	//if no, query for it, store in mongo
	
	var match = {};
	var matchReqOptions = {
		host: config.RIOT_API.API_HOST,
		path: config.RIOT_API.MATCH_PATH + matchId + "?includeTimeline=true&api_key=" + config.RIOT_API.API_KEY
	}
	http.get( matchReqOptions, function(res){
		//res.setEncoding("utf8"); i dont think the encoding is utf8
		res.on("data", function(chunk){
			//parse JSON, store match
		});
	});

	//parse match for desired information
	return match;
}

module.exports = parseMatchHistory;
