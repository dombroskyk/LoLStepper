var http = require('http');
var config = require('../config');

function parseMatchHistory( summonerName ){
	var summonerId = 22101250;
	var summonerNameReqOptions = {
		host: config.API_HOST,
		path: config.SUMMONER_PATH + summonerName + "?api_key=" + config.API_KEY
	}
	http.get( summonerNameReqOptions, function(res){
		//res.setEncoding("utf8"); i dont think the encoding is utf8
		res.on("data", function(chunk){
			//parseJSON, get summoner id
		});
	});

	var matchHistory = {};
	var matchHistoryReqOptions = {
		host: config.API_HOST,
		path: config.MH_PATH + summonerId + "?api_key=" + config.API_KEY;
	}
	http.get( matchHistoryReqOptions, function(res){
		//res.setEncoding("utf8");
		res.on("data", function(chunk){
			//parse JSON, get matches and extract information we care about
		});
	});
	return matchHistory;
}

module.exports = parseMatchHistory;
