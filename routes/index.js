var express = require('express');
var router = express.Router();
//var parseMatchHistory = require('../scripts/parseMatchHistory');
//var parseMatch = require('../scripts/parseMatch');

router.get('/', function(req, res) {
    res.render('splash');
});

router.get('/about', function(req, res) {
    res.render('about');
});

router.get('/matches/:summonerName', function(req, res) {
	//TODO: require('parseMatchHistory'); future external js file to parse match history of a summoner name
    res.render('matches', { summonerName: req.params['summonerName'], matchHistory: null });
});

router.get('/match/:matchId', function(req, res) {
	//TODO: require('parseMatch'); future external js file to parse a single match
    res.render('match', { matchId: req.params['matchId'], match: null });
});

module.exports = router;
