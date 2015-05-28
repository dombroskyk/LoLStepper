var http = require('http');
var API_HOST = "na.api.pvp.net";
var MATCH_PATH = "/api/lol/na/v2.2/match/";
var API_KEY = "";

function parseMatch( matchId ){
	//check if match is already in Mongo
	//if yes, fetch
	//if no, query for it, store in mongo
	
	var match = {};
	var matchReqOptions = {
		host: API_HOST,
		path: MATCH_PATH + matchId + "?includeTimeline=true&api_key=" + API_KEY
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
