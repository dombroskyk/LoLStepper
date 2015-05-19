var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('splash');
});

router.get('/about', function(req, res) {
    res.render('about');
});

router.get('/matches/:summonerName', function(req, res) {
    res.render('matches', { summonerName: req.params('summonerName') });
});

router.get('/match/:matchId', function(req, res) {
    res.render('match', { matchId: req.params('matchId') });
});

module.exports = router;
