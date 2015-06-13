'use strict';

module.exports = {

    home: function (req, res) {
        res.render('splash');
    },

    about: function (req, res) {
        res.render('about');
    },

    matchHistory: function (req, res) {
        var parseMatchHistory = require('../includes/parseMatchHistory'),
            summonerName = req.query.summonerName;
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
    },

    match: function (req, res) {
        var matchFetcher = require('../includes/matchFetcher'),
            matchId = req.query.matchId;
        matchFetcher(matchId).then(function (match) {
            res.render('match', { matchId: matchId, match: match });
        }, function (err) {
            console.log(err);
            res.end();
        });
    }
};
