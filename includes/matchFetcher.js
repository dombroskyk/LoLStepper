'use strict';

var mongoClient = require('mongodb').MongoClient,
    Q = require('q'),
    https = require('https'),
    config = require('../config');

var dbPromise = Q.defer();

var mongoUrl = 'mongodb://' + config.MONGODB.MONGO_HOST + ':' + config.MONGODB.PORT + '/lolstepper';
mongoClient.connect(mongoUrl, function (err, db) {
    if (err) {
        dbPromise.reject(err)
    } else {
        dbPromise.resolve(db)
    }
});

function fetchMatch(matchId) {
    var responsePromise = Q.defer(),
        matchReqOptions = {
            host: config.RIOT_API.API_HOST,
            path: config.RIOT_API.MATCH_PATH + matchId + '?includeTimeline=true&api_key=' + config.RIOT_API.API_KEY
        };
    //fetch
    var matchData = '',
        matchJson,
        matchReq = https.get(matchReqOptions, function(matchRes) {
            if (matchRes.statusCode != 200) {
                responsePromise.reject({ statusCode: matchRes.statusCode });
                return;
            }
            matchRes.setEncoding('utf8');
            matchRes.on('data', function(matchChunk) {
                //aggregate data
                matchData += matchChunk;
            });
            matchRes.on('end', function() {
                //parse match for desired information
                matchJson = JSON.parse(matchData);
                responsePromise.resolve(matchJson);
            });
        });
    matchReq.end();
    matchReq.on('error', function (e) {
        responsePromise.reject(e);
    });
    return responsePromise.promise;
}

module.exports = function (matchId) {
    var matchPromise = Q.defer();
    dbPromise.promise.then(function (db) {
        var collection = db.collection('matches');
        collection.findOne({_id: parseInt(matchId, 10)}, function(err, doc) {
            if (err) { // error fetching match
                matchPromise.reject(err);
            } else if (doc) { // match found
                matchPromise.resolve(doc);
            } else { //no match cached, fetch and store
                fetchMatch(matchId).then(function (match) {
                    match._id = match.matchId;
                    console.log('inserting...');
                    collection.insert(match, function(insertErr, record) {
                        console.log('inserted');
                        if (insertErr) {
                            matchPromise.reject(insertErr);
                        } else {
                            matchPromise.resolve(matchJson);
                        }
                    });
                }, function (error) {
                    matchPromise.reject(error);
                });
            }
        });
    }, function () {
        fetchMatch(matchId).then(function (match) {
            matchPromise.resolve(match);
        }, function (err) {
            matchPromise.reject(err);
        });
    });
    return matchPromise.promise;
}
