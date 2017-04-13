'use strict';

require('./generator-runtime');

module.exports = require('./json-rules-engine');
module.exports = require('../src/chatbot-rules/common_rules');

var express = require('express');
var app = express();

app.get('/rules', function (req, res) {
    var anc = module.exports.callRules();
    console.log("anc is" + anc);
    res.end(anc);
});

var server = app.listen(8081, function () {

  //var host = server.address().address;
  //var port = server.address().port;
    var host = "localhost";
    var port = 8081;
    console.log("Example app listening at http://%s:%s", host, port);

});