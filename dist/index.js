'use strict';
require('./generator-runtime');
module.exports = require('./json-rules-engine');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var Engine = require('.').Engine;
var MongoClient = require('mongodb').MongoClient;
var cfg = require('./config');
let apiClient = require('./database-data');
let facts = { accountId: 'requestData'};
var url = cfg.mongo.url;


app.post('/rules', jsonParser, function (req, res) {
  console.log("url is:" + url);
    var requestdataValue= req.body;
    var counter = 0;
    MongoClient.connect(url, function(err, db) {
        var engine = new Engine();
        var cursor = db.collection('rocketchat_livechat_Chatbot_Rules3').find({"isActive":true}).sort({"priority":-1});
        var cursorCount = cursor.count(function(err, count) {
            cursor.each(function(err, doc) {
            if (doc !== null)  {
                    var event = doc.event;
                    // if (doc.keyToFind) {
                    //     var isContextTrue = checkForContextExistence(doc, requestdataValue.requestData.current_response);
                    //     console.log("iscontexttrue"+ isContextTrue);
                    //     if (isContextTrue === false) {
                    //         return;
                    //    }
                    // }
                   
                    engine.addRule({conditions : doc.conditions, 
                                    event : event}); 
                    var docFact = doc.fact;
                    console.log(docFact);
                    engine.addFact(docFact, function (params, almanac) {
                        return almanac.factValue('accountId')
                            .then(accountId => {
                            return apiClient.getCurrentData(accountId, requestdataValue);
                    });
                    });
                    engine.run(facts)
                        .then(events => {
                        if (!events.length)  {
                           console.log("no event length");
                            console.log(events.length);
                              counter = counter+1;
                              if (counter == count) {
                                  res.json(null);
                              }
                        } else {
                            events.map(event => event.params);
                            console.log("event length");
                            console.log(events.length);
                            count = 1;
                            res.json(event);
                        }
                }).catch(console.log);
            }
      });
        })
    });
});


function checkForContextExistence(doc, current_response) {
    console.log("in contexts//" + current_response);
    var result = current_response.result;
    var correctResult;
     for (var key in result) {
          if (key == doc.keyToFind) {
              correctResult = result[key];
          } 
    }
    for (var i = 0; i < correctResult.length; i++) {
        var currentContext = correctResult[i];
        if (currentContext.name === doc.valueToFind) {
            return true;
        }
    }
    return false;
}  


function getPreviousResponse() {
  let previous_response =  {
  "id": "5675ace6-9fce-48ce-bc03-b5678c9d6d96",
  "timestamp": "2017-03-31T09:34:51.886Z",
  "lang": "en",
  "result": {
    "source": "agent",
    "resolvedQuery": "idv\\n",
    "action": "Quote-SetIDV",
    "actionIncomplete": false,
    "parameters": {
      "TargetIDV": ""	
    },
    "contexts": [
      {
        "name": "quote-setidv_dialog_context",
        "parameters": {
          "TargetIDV.original": "",
          "TargetIDV": ""
        },
        "lifespan": 2
      },
      {
        "name": "70042433-9515-476b-bfd3-11a6aedcb5d3_id_dialog_context",
        "parameters": {
          "TargetIDV.original": "",
          "TargetIDV": ""
        },
        "lifespan": 2
      },
      {
        "name": "quote-setidv_dialog_params_targetidv",
        "parameters": {
          "TargetIDV.original": "",
          "TargetIDV": ""
        },
        "lifespan": 1
      }
    ],
    "metadata": {
      "intentId": "70042433-9515-476b-bfd3-11a6aedcb5d3",
      "webhookUsed": "false",
      "webhookForSlotFillingUsed": "false",
      "intentName": "Quote-SetIDV"
    },
    "fulfillment": {
      "speech": "What is the minimum IDV that you needcds",
      "messages": [
        {
          "type": 0,
          "speech": "What is the minimum IDV that you need"
        }
      ]
    },
    "score": 1
  },
  "status": {
    "code": 200,
    "errorType": "success"
  },
  "sessionId": "sBFerSww75YzfymQQ"
}
    return previous_response;
}

function getCurrentResponse() {
  let current_response =  {
  "id": "5675ace6-9fce-48ce-bc03-b5678c9d6d96",
  "timestamp": "2017-03-31T09:34:51.886Z",
  "lang": "en",
  "result": {
    "source": "agent",
    "resolvedQuery": "idv\\n",
    "lastPendingIntent" : false,
    "action": "Quote-SelectPlan",
    "actionIncomplete": false,
    "parameters": {
      "TargetIDV": "",
      "Claims" : "Yes"
    },
    "contexts": [
      {
        "name": "quote-getquoteregistrationnumber_dialog_params_make",
        "parameters": {
          "TargetIDV.original": "",
          "TargetIDV": ""
        },
        "lifespan": 2
      },
      {
        "name": "getquoteregistrationnumber_dialog_params_previousinsurer",
        "parameters": {
          "TargetIDV.original": "",
          "TargetIDV": ""
        },
        "lifespan": 2
      },
      {
        "name": "quote-setidv_dialog_params_targetidv",
        "parameters": {
          "TargetIDV.original": "",
          "TargetIDV": ""
        },
        "lifespan": 1
      }
    ],
    "metadata": {
      "intentId": "70042433-9515-476b-bfd3-11a6aedcb5d3",
      "webhookUsed": "false",
      "webhookForSlotFillingUsed": "false",
      "intentName": "Quote-SetIDV"
    },
    "fulfillment": {
      "speech": "What is the minimum IDV that you need",
      "messages": [
        {
          "type": 0,
          "speech": "What is the minimum IDV that you need"
        }
      ]
    },
    "score": 1
  },
  "status": {
    "code": 200,
    "errorType": "success"
  },
  "sessionId": "sBFerSww75YzfymQQ"
};
    return current_response;
}
  
function getAnotherResponse() {
    let anotherResponse = {
        "isAllMandatoryIntentsDone" : false,
        "lastPendingIntent" : false
    };
    return anotherResponse;
}

var server = app.listen(8081, function () {
    var host = "localhost";
    var port = 8081;
    console.log("Example app listening at http://%s:%s", host, port);

});
