'use strict';
var bitcore_lib = require('bitcore-lib');
var PaymentProtocol = require('bitcore-payment-protocol');
var express = require('express');
var bodyParser = require('body-parser');
var URI = request('bitcore-lib/lib/uri');
var request = require('request');
const https = require('https');
var fs = require('fs');

var dcert = fs.readFileSync('./keys/cert.der');
var mcert = fs.readFileSync('./keys/cert.pem');
var mkey = fs.readFileSync('./keys/key.pem');

var credentials = {key: mkey, cert: mcert};
var app = express();
var os = require('os');
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfacese[k][k2];
        if (address.family  === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}


var IP = addresses[0];
var port = 8883;
var http_port = 3000;

app.get("/", function(req, res) {
    res.send('Bitcoin Payment protocol');
});

app.listen(http_port, function() {
    console.log("-http Server listening on :" +IP+ http_port);
});

https.createServer(credintials, app).listen(port, function() {
    console.log("-https Server listening on : " +IP+ ":"+ port );
});


bitcore_lib.Networks.defaultNetwork =
    bitcore_lib.Networks.testnet;
var Merchant_address = "2N622rLFgUar4BeLe5wfa7Acx3qCsLb1koC";

function conpose_uri(amount_to_pay) {
    var pay_url = "http://" + IP + ":" + http_port + "/request";
    var uriString = new URI({
        address : Merchant_address,
        amount : amount_to_pay,
        message : 'payment request'
    });

    var paymentUri = uriString+"&r="+pay_url;
    return paymentUri;
}