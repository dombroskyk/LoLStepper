var https = require('https');
var config = require('../config');
var mongoclient = require('mongodb').MongoClient;

function parseMatch(matchId, renderCallback) {
    //check if match is already in Mongo
    //if yes, fetch
    var mongoUrl = 'mongodb://localhost:27017/lolstepper';
    mongoclient.connect(mongoUrl, function(err, db) {
        if(err){
            console.log('error: ' + err);    
        }
        var collection = db.collection('matches');
        collection.findOne({_id: parseInt(matchId)}, function(findErr, doc) {
            if(findErr){
                console.log('find err: ' + findErr);
            }else if(doc){
                //match found, render
                renderCallback(null, doc); 
                db.close();
            }else{
                //no match cached, fetch, store, and render
                var matchReqOptions = {
                    host: config.RIOT_API.API_HOST,
                    path: config.RIOT_API.MATCH_PATH + matchId + '?includeTimeline=true&api_key=' + config.RIOT_API.API_KEY
                };
                //fetch
                var matchData = "";
                var matchJson;
                https.get(matchReqOptions, function(matchRes) {
                    matchRes.setEncoding('utf8');
                    matchRes.on('data', function(matchChunk) {
                        //aggregate data
                        matchData += matchChunk;
                    });
                    matchRes.on('end', function() {
                        //parse match for desired information
                        matchJson = JSON.parse(matchData); 
                        matchJson._id = matchJson.matchId;
                        collection.insert(matchJson, function(insertErr, record) {
                            if(insertErr){
                                console.log("insert error: " + insertErr);
                            }
                            //render
                            renderCallback(null, matchJson);
                            db.close();
                        });
                    });
                });
            }
        });
    });
}

module.exports = parseMatch;
