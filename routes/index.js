var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('splash');
});

router.get('/about', function(req, res) {
    res.render('about');
});

router.get('/matches/?', function(req, res) {
	var parseMatchHistory = require('../scripts/parseMatchHistory'),
        summonerName = req.query['summonerName'];
	parseMatchHistory(summonerName, matchHistoryRender);
	function matchHistoryRender(err, matches) {
		//TODO: handle error codes
		if(!err){
    		res.render('matches', { summonerName: summonerName, matchHistory: matches });
    	}else{
    		res.render('matches', { summonerName: summonerName, matchHistory: {} });
    	}
    }
});

router.get('/match/:matchId', function(req, res) {
	var parseMatch = require('../scripts/parseMatch');
	parseMatch( req.params['matchId'], matchRender);
	function matchRender(err, matchInfo) {
		if(!err){
    		res.render('match', { matchId: req.params['matchId'], match: matchInfo });
    	}
    }
});

module.exports = router;
