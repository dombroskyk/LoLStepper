'use strict';

module.exports = {
    matchHistory: function (req, res) {
        var parseMatchHistory = require('../includes/parseMatchHistory'),
            summonerName = req.query.summonerName;
        parseMatchHistory(summonerName, matchHistoryDataRender);
        function matchHistoryDataRender(err, matches) {
            //TODO: handle error codes
            if(!err){
                //OK
                res.render('matchesData', { summonerName: summonerName, matchHistory: matches });
            }else if(err == 400){
                //Bad Request
                res.render('matchesData', { summonerName: summonerName, matchHistory: {} });
            }else if(err == 401){
                //Unauthorized
                res.render('matchesData', { summonerName: summonerName, matchHistory: {} });
            }else if(err == 404){
                //Game not found
                res.render('matchesData', { summonerName: summonerName, matchHistory: {} });
            }else if(err == 422){
                //Summoner hasn't played since start of 2013
                res.render('matchesData', { summonerName: summonerName, matchHistory: {} });
            }else if(err == 429){
                //Rate limit exceeded
                res.render('matchesData', { summonerName: summonerName, matchHistory: {} });
            }else if(err == 500){
                //Internal server error
                res.render('matchesData', { summonerName: summonerName, matchHistory: {} });
            }else if(err == 503){
                //Service unavailable
                res.render('matchesData', { summonerName: summonerName, matchHistory: {} });
            }else{
                //Should never be reached
                res.render('matchesData', { summonerName: summonerName, matchHistory: {} });
            }
        }
    }
};