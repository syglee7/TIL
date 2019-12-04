var bitcoin = require('bitcoinjs-lib');
var rp = require('request-promise');

var data = Buffer.from('Hello World', 'utf8');
var testnet = bitcoin.networks.testnet;
var privateKey = 'cPsc1MZ2ibVykBwubrbDeL2FKj1SPNrFESSWt9k7ZiEZe2CTKntH';
var SourceAddress = 'tb1qggfmef8e20a27fggex5v03j9r2249d0nssketj';

var url = "https://chain.so/api/v2/get_tx_unspent/BTCTEST/" + SourceAddress;
var DestionationAddress = '2MwfU9h9TZRpHWkG6aH1p2ao73itxYewMCB';
var options = {
    uri : url,
    json : true
};


rp(options).then(function (response) {
    var index = response.data.txs.length - 1;

    console.log(response.data.txs[index])
    var UtxoId =response.data.txs[index].txid;
    var vout = response.data.txs[index].output_no;
    var amount=Number(response.data.txs[index].value*100000000);
    var fee = 0.0005*100000000; // 0.0005 BTC

    const RawTransaction = new bitcoin.TransactionBuilder(testnet)
    RawTransaction.addInput(UtxoId, vout);
    RawTransaction.addOutput(DestionationAddress, parseInt(amount-fee));
    scrypt = bitcoin.script.compile([bitcoin.opcodes.OP_RETURN,data]);
    RawTransaction.addOutput(scrypt, 0);
    var keyPair = bitcoin.ECPair.fromWIF(privateKey, testnet);
    RawTransaction.sign(0, keyPair)

    /* For P2SH transaction use the following code instead the previous line. Make sure that the source address is a P2SH address
    const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.testnet })
    const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network: bitcoin.networks.testnet })
    RawTransaction.sign(0, keyPair, p2sh.redeem.output, null, parseInt(amount))
    */
    var Transaction=RawTransaction.build().toHex();



    var Sendingoptions = {
        method: 'POST',
        url: 'https://chain.so/api/v2/send_tx/BTCTEST',

        body: {tx_hex: Transaction},
        json: true
    };

    rp(Sendingoptions).then(function (response) {
        var Jresponse = JSON.stringify(response);
        console.log("Transaction ID:\n"+Jresponse);

    }).catch(function (err) {

        console.log("err");

    });

}).catch(function (err) {

    console.log(err);

});