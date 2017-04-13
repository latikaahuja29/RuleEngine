'use strict';
let Engine = require('/home/pbadmin/2017/json-rules-engine/dist').Engine;
//let engine = new Engine();
let apiClient = require('./database-data');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
let facts = { accountId: 'result'};
var sync    = require('synchronize');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://10.0.8.62:27017/rocketchat_test';
var mongo = require('mongoskin');
var agentId = 1, actionId=1;
var current_response = getCurrentResponse();
var previous_response = getPreviousResponse();
var another_response = getAnotherResponse()

var callRules = function() {
      var returnValue;
     var db = mongo.db(url, {native_parser:true});
      returnValue = findRule(db, current_response, previous_response, another_response);
      console.log("returnvalueis:", returnValue);
      return returnValue;
};


module.exports = {
  callRules: callRules
};

var findRule = function(db, current_response, previous_response, another_response) {
   var count = 0;
   var returnValue;
   var cursor = db.collection('rocketchat_livechat_Chatbot_Rules2').find({"agentId":agentId,
                "actionId":actionId}).sort({"priority":-1});
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc !== null) {
             console.log("valuebased");
            let engine = new Engine();
            var event = doc.event;
            if (doc.event.isDynamism === true) {
                event = setDynamicMessage(doc);
            }
            if (doc.context) {
                var isContextTrue = checkForContextExistence(doc);
                if (isContextTrue === false) {
                    return;
                }
            }
            engine.addRule({conditions : doc.conditions, 
                            event : event}); 
            var docFact = doc.fact;
            console.log("added fact", docFact);
            engine.addFact(docFact, function (params, almanac) {
            return almanac.factValue('accountId')
            .then(accountId => {
            return apiClient.getCurrentData(accountId, getUpdatedCurrentResponse(current_response, another_response));
    });
      });
         engine.run(facts)
            .then(events => {
            if (!events.length)  {
               console.log("no evenst length", events.length);
                return;
            }
            else {
                 console.log("evenst length", events.length);
                count +=1;
                if (count>1) return;
                events.map(event => event.params);
                returnValue = event.params;
                return returnValue;
            }}).catch(console.log);
            
    }
    else {
         // callback();
        }
   });
   return returnValue;
};

function setDynamicMessage(doc) {
    var events = JSON.parse(JSON.stringify(doc.event)); 
    var listOfDynamicKeys = events.params.dynamicKeys;
    var currentResponse = getCurrentResponse();
    var docProperty = listOfDynamicKeys[0];
    var docProperty1 = listOfDynamicKeys[1];
    var docProperty2 = listOfDynamicKeys[2];
    var data;
    for (var key in currentResponse) {
        if (key.indexOf(docProperty) !== -1) {
            data = currentResponse[key][docProperty1][docProperty2];
            
        }
    }
    doc.event.params.dynamicMessage = data;
    return doc.event;
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
    "actionIncomplete": true,
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
        "name": "getquoteregistrationnumber_dialog_params_previousncb",
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
  
  
function checkForContextExistence(doc) {
    var current_response = getCurrentResponse();
    var contexts = current_response.result.contexts;
    for (var i = 0; i < contexts.length; i++) {
        var currentContext = contexts[i];
        var str = currentContext.name;
        var res = str.split("_");
        var contextName = res[res.length - 1];
        if (contextName === doc.context.contextName) {
            return true;
        }
    }
    return false;
}  

function getAnotherResponse() {
    let anotherResponse = {
        "isAllMandatoryIntentsDone" : false,
        "lastPendingIntent" : false
    };
    return anotherResponse;
}

function getUpdatedCurrentResponse(current_response, another_response) {
    var current_res = current_response.result;
    for (var key in another_response) {
        current_res[key] = another_response[key];
    }
    current_response['result'] = current_res;
    return current_response;
}