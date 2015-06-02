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
            //OK
            res.render('matches', { summonerName: summonerName, matchHistory: matches });
        }else if(err == 400){
            //Bad Request
            res.render('matches', { summonerName: summonerName, matchHistory: {} });
        }else if(err == 401){
            //Unauthorized
            res.render('matches', { summonerName: summonerName, matchHistory: {} });
        }else if(err == 404){
            //Game not found
            res.render('matches', { summonerName: summonerName, matchHistory: {} });
        }else if(err == 422){
            //Summoner hasn't played since start of 2013
            res.render('matches', { summonerName: summonerName, matchHistory: {} });
        }else if(err == 429){
            //Rate limit exceeded
            res.render('matches', { summonerName: summonerName, matchHistory: {} });
        }else if(err == 500){
            //Internal server error
            res.render('matches', { summonerName: summonerName, matchHistory: {} });
        }else if(err == 503){
            //Service unavailable
            res.render('matches', { summonerName: summonerName, matchHistory: {} });
        }else{
            //Should never be reached
            res.render('matches', { summonerName: summonerName, matchHistory: {} });
        }
    }
});

router.get('/match/?', function(req, res) {
    var parseMatch = require('../scripts/parseMatch'),
        matchId = req.query['matchId'];
    parseMatch(matchId, matchRender);
    function matchRender(err, matchInfo) {
        if(!err){
            res.render('match', { matchId: matchId, match: matchInfo });
        }
    }
});

module.exports = router;
