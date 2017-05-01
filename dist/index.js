'use strict';
require('./generator-runtime');

module.exports = require('./json-rules-engine');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var Engine = require('.').Engine;
var MongoClient = require('mongodb').MongoClient;
let apiClient = require('./database-data');
let facts = { accountId: 'result'};
var url = 'mongodb://10.0.8.62:27017/rocketchat_test';

app.post('/rules', jsonParser, function (req, res) {
    var current_response = req.body.current_response;
    var previous_response = req.body.previous_response;
    var another_response = getAnotherResponse();

    MongoClient.connect(url, function(err, db) {
        var engine = new Engine();
        var cursor = db.collection('rocketchat_livechat_Chatbot_Rules2').find().sort({"priority":-1});
        cursor.each(function(err, doc) {
            if (doc !== null)  {
                if (doc.type === "pathBased" && typeof previous_response != 'undefined') {
                    var event = doc.event;
                    var conditions = JSON.parse(JSON.stringify(doc.conditions));
                    var previousData = JSON.parse(JSON.stringify(previous_response));
                    var docProperty = doc.conditions.all[0].property;
                    var docProperty1 = doc.conditions.all[0].property1;
                    var docProperty2 = doc.conditions.all[0].property2;
                    var data;
                    for (var key in previousData) {
                        if (key.indexOf(docProperty) !== -1) {
                        data = previousData[key][docProperty1][docProperty2];
                        }
                    }
                    conditions.all[0].value = data;
                    engine.addRule({conditions : conditions,
                                    event : doc.event});
                    var docFact = doc.fact;
                    engine.addFact(docFact, function (params, almanac) {
                        return almanac.factValue('accountId')
                        .then(accountId => {
                        return apiClient.getCurrentData(accountId, current_response);
                    });
                    });
                    engine.run(facts)
                    .then(events => {
                    if (!events.length)
                        {}
                    else {
                        events.map(event => event.params);
                        res.json(event);
                    }}).catch(console.log);
                } else {    
                    var event = doc.event;
                    if (doc.event.isDynamism === true) {
                        event = setDynamicMessage(doc, current_response);
                    }
                    if (doc.context) {
                        var isContextTrue = checkForContextExistence(doc, current_response);
                        if (isContextTrue === false) {
                            return;
                        }
                    }
                    engine.addRule({conditions : doc.conditions, 
                                    event : event}); 
                    var docFact = doc.fact;
                    engine.addFact(docFact, function (params, almanac) {
                        return almanac.factValue('accountId')
                            .then(accountId => {
                            return apiClient.getCurrentData(accountId, current_response);
                    });
                    });
                    engine.run(facts)
                        .then(events => {
                        if (!events.length)  {
                        } else {
                            events.map(event => event.params);
                            res.json(event);
                        }
                }).catch(console.log);
            }
    }
      });
    });
});


function checkForContextExistence(doc, current_response) {
    console.log("in contexts//" + current_response);
    var contexts = current_response.result.contexts;
    for (var i = 0; i < contexts.length; i++) {
        var currentContext = contexts[i];
        var str = currentContext.name;
        var res = str.split("_");
        var contextName = res[res.length - 1];
        if (contextName === doc.context.contextName) {
            console.log("returning from context.."+contextName + "and true..");
            return true;
        }
    }
    return false;
}  

function setDynamicMessage(doc, current_response) {
    var events = JSON.parse(JSON.stringify(doc.event)); 
    var listOfDynamicKeys = events.params.dynamicKeys;
    var docProperty = listOfDynamicKeys[0];
    var docProperty1 = listOfDynamicKeys[1];
    var docProperty2 = listOfDynamicKeys[2];
    var data;
    for (var key in current_response) {
        if (key.indexOf(docProperty) !== -1) {
            data = current_response[key][docProperty1][docProperty2];
            
        }
    }
    console.log("set dynamic message..."+data);
    doc.event.params.dynamicMessage = data;
    console.log("set dynamic message..."+data);

    return doc.event;
}
  
function getUpdatedCurrentResponse(current_response, another_response) {
    var current_res = current_response.result;
    for (var key in another_response) {
        current_res[key] = another_response[key];
    }
    current_response['result'] = current_res;
    return current_response;
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
        "name": "quote-setidv_dialog_context",
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
