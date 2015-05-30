var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('splash');
});

router.get('/about', function(req, res) {
    res.render('about');
});

router.get('/matches/:summonerName', function(req, res) {
	var parseMatchHistory = require('../scripts/parseMatchHistory');
	parseMatchHistory(req.params['summonerName'], matchHistoryRender );
	function matchHistoryRender( err, matches ){
		//console.log( matches );
    	res.render('matches', { summonerName: req.params['summonerName'], matchHistory: matches });
    }
});

router.get('/match/:matchId', function(req, res) {
	//var parseMatch = require('../scripts/parseMatch');
	//TODO: require('parseMatch'); future external js file to parse a single match
    res.render('match', { matchId: req.params['matchId'], match: null });
});

module.exports = router;
