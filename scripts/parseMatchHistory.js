var http = require('http');
var API_HOST = "na.api.pvp.net";
var SUMMONER_PATH = "/api/lol/na/v1.4/summoner/by-name/";
var MH_PATH = "/api/lol/na/v2.2/matchhistory/";
var API_KEY = "";

function parseMatchHistory( summonerName ){
	var summonerId = 22101250;
	var summonerNameReqOptions = {
		host: API_HOST,
		path: SUMMONER_PATH + summonerName + "?api_key=" + API_KEY
	}
	http.get( summonerNameReqOptions, function(res){
		//res.setEncoding("utf8"); i dont think the encoding is utf8
		res.on("data", function(chunk){
			//parseJSON, get summoner id
		});
	});

	var matchHistory = {};
	var matchHistoryReqOptions = {
		host: API_HOST,
		path: MH_PATH + summonerId + "?api_key=" + API_KEY;
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
