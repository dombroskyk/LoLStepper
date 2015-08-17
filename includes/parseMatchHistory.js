'use strict';

var https = require('https'),
    fs = require('fs'),
    config = require('../config');

function parseMatchHistory(summonerName, renderCallback) {
    var summonerReqOptions = {
        host: config.RIOT_API.API_HOST,
        path: config.RIOT_API.SUMMONER_PATH + encodeURIComponent(summonerName) + '?api_key=' + config.RIOT_API.API_KEY
    };
    var summonerData = '';
    var summonerId;
    var time = Math.floor(new Date().getTime() / 1000);
    https.get(summonerReqOptions, function(summonerRes) {
        //TODO: handle error codes, custom error pages?
        if(summonerRes.statusCode != 200){
            renderCallback(summonerRes.statusCode, {});
            return;
        }
        summonerRes.setEncoding('utf8');
        summonerRes.on('data', function(summonerChunk) {
            //gather data from response parts
            summonerData += summonerChunk;
        });
        summonerRes.on('end', function() {
            //parse JSON, get summoner id
            if(summonerRes !== ''){
                summonerData = JSON.parse(summonerData);
            }else{
                renderCallback(null, {});
            }
            summonerId = summonerData[summonerName.toLowerCase().replace(/ /g,'')].id;

            var matchHistoryReqOptions = {
                host: config.RIOT_API.API_HOST,
                path: config.RIOT_API.GAME_PATH + summonerId + '/recent?api_key=' + config.RIOT_API.API_KEY
            };
            var matchesData = '';
            var matchesJSON;
            https.get(matchHistoryReqOptions, function(gameRes) {
                if(gameRes.statusCode != 200){
                    renderCallback(gameRes.statusCode, {});
                    return;
                }
                //parse match history json
                gameRes.setEncoding('utf8');
                gameRes.on('data', function(gameChunk) {
                    matchesData += gameChunk;
                });
                gameRes.on('end', function() {
                    matchesJSON = JSON.parse(matchesData);
                    //pull out the information that we want
                    var parsedJSON = [];
                    for(var i = 0; i < matchesJSON.games.length; i++){
                        var curr = matchesJSON.games[i],
                            matchDurationStr = '',
                            remainingDuration = curr.stats.timePlayed,
                            matchCreationStr = '',
                            creationDiff = time - Math.floor(curr.createDate / 1000),
                            otherPlayers = {'playerTeam': [], 'enemyTeam': []};
                        
                        if(remainingDuration > 60){
                            var matchMinutes = Math.floor(remainingDuration / 60);
                            matchDurationStr += matchMinutes + 'm ';
                            remainingDuration -= matchMinutes * 60;
                        }
                        if(remainingDuration < 10){
                            remainingDuration = '0' + remainingDuration;
                        }
                        matchDurationStr += remainingDuration + 's';
                        
                        if(creationDiff >= 31536000){ //year
                            matchCreationStr = 'over a year';   
                        }else if(creationDiff >= 172800){ //>2 days
                            matchCreationStr =  '' + Math.floor(creationDiff / 86400) + ' days';
                        }else if(creationDiff >= 86400){ //1 day
                            matchCreationStr = '1 day';
                        }else if(creationDiff >= 3600){ //more than an hour
                            var creationDiffHour = Math.floor(creationDiff /  3600),
                                creationDiffMin = Math.floor((creationDiff - (creationDiffHour * 3600)) / 60);
                            if(creationDiffMin < 10){
                                creationDiffMin = '0' + creationDiffMin; //not sure what's going on here either with the warning
                            }
                            matchCreationStr = '' + creationDiffHour + 'h ' + creationDiffMin + 'm';
                        }else if(creationDiff >= 3600){ //min/sec
                            var creationDiffMin = Math.floor(creationDiff / 60),creationDiffSec = Math.floor(creationDiff - (creationDiffMin * 60));
                            // creationDiffMin = Math.floor(creationDiff / 60), //why does it say this is already defined? why does the above definition also apply down here?
                            // it ultimately appears to give the correct result, but its still weird... keeping just in case, not that the line is that complicated
                            //
                            // if I remove it jshint complains that I'm using an out of scope reference... this will need to be resolved later
                            matchCreationStr = '' + creationDiffMin + 'm ' + creationDiffSec + 's';
                        }
                        matchCreationStr += ' ago';
                        
                        for(var j = 0; j < curr.fellowPlayers.length; j++){
                               var currPlayer = curr.fellowPlayers[j];
                               if(currPlayer.teamId == curr.teamId){
                                   otherPlayers.playerTeam.push(currPlayer.championId);
                               }else if(currPlayer.teamId != curr.teamId){
                                   otherPlayers.enemyTeam.push(currPlayer.championId);
                               }
                        }

                        var newJSON = {
                            otherPlayers: otherPlayers,
                            mapId: curr.mapId,
                            matchDuration: matchDurationStr,
                            matchCreation: matchCreationStr,
                            matchId: curr.gameId,
                            items: {
                                item0: curr.stats.item0,
                                item1: curr.stats.item1,
                                item2: curr.stats.item2,
                                item3: curr.stats.item3,
                                item4: curr.stats.item4,
                                item5: curr.stats.item5,
                                item6: curr.stats.item6
                            },
                            stats: {
                                win: curr.stats.win,
                                largestMultiKill: typeof curr.stats.largestMultiKill != "undefined" ? curr.stats.largestMultiKill : 0,
                                kills: typeof curr.stats.championsKilled != "undefined" ? curr.stats.championsKilled : 0,
                                deaths: typeof curr.stats.numDeaths != "undefined" ? curr.stats.numDeaths : 0,
                                assists: typeof curr.stats.assists != "undefined" ? curr.stats.assists : 0,
                                minionsKilled: typeof curr.stats.minionsKilled != "undefined" ? curr.stats.minionsKilled : 0,
                                goldEarned: curr.stats.goldEarned
                            },
                            spell1Id: curr.spell1,
                            spell2Id: curr.spell2,
                            teamId: curr.teamId,
                            championId: curr.championId,
                            queueType: curr.subType,
                            matchType: curr.gameType,
                            matchMode: curr.gameMode,
                        };
                        
                        parsedJSON.push(newJSON);
                    }
                    renderCallback(null, parsedJSON);
                });
            }).on('error', function(e) {
                //leaving console log for development purposes
                console.log('Problem with match history request: ' + e.message);
                fs.appendFile('../error.log', 'MATCH HISTORY: ' + e.message, function(err){
                    if(err){
                        console.log('Error appending error to log file: ' + err.message);
                    }
                });
            });
        });
    }).on('error', function(e) {
        //leaving console log for development purposes
        console.log('Problem with summoner name request: ' + e.message);
        fs.appendFile('../error.log', 'MATCH HISTORY: ' + e.message, function(err){
            if(err){
                console.log('Error appending error to log file: ' + err.message);
            }
        });
    });
}

module.exports = parseMatchHistory;
