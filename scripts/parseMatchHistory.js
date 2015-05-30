var https = require('https');
var config = require('../config');

function parseMatchHistory( summonerName, renderCallback ){
	var summonerId;
	var summonerNameReqOptions = {
		host: config.RIOT_API.API_HOST,
		path: config.RIOT_API.SUMMONER_PATH + encodeURIComponent(summonerName) + '?api_key=' + config.RIOT_API.API_KEY
	}

	https.get( summonerNameReqOptions, function(res){
		//gather data in case sent in multiple parts, make implementation specific variable names
		res.on('data', function(chunk){
			//parse JSON, get summoner id
			chunk = JSON.parse(chunk);
			summonerId = chunk[summonerName.toLowerCase().replace(/ /g,'')].id;
		});
		res.on('end', function(){
			var matchHistoryReqOptions = {
				host: config.RIOT_API.API_HOST,
				path: config.RIOT_API.MH_PATH + summonerId + '?api_key=' + config.RIOT_API.API_KEY
			}
			var matchesData = "";
			var matchesJSON;
			https.get( matchHistoryReqOptions, function(mhRes){
				//parse match history json
				mhRes.setEncoding('utf8');
				mhRes.on('data', function(mhChunk){
					matchesData += mhChunk;
				});
				mhRes.on('end', function(){
					matchesJSON = JSON.parse(matchesData);
					//render view
					renderCallback(null, matchesJSON.matches);
				});
			}).on('error', function(e){
				//implement file logging
				console.log('Problem with match history request: ' + e.message);
			});
		});
	}).on('error', function(e){
		//implement file logging
		console.log('Problem with summoner name request: ' + e.message);
	});
}

module.exports = parseMatchHistory;
