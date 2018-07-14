var Transaction = require('../models/transaction');
var accountController = require('./accountController');
var transactionURL;
var icoToken = {
                DA: process.env.DA,
                GA: process.env.IA,
                code: process.env.CODE,
                limit: process.env.LIMIT
            };
exports.register = function(req, res) {
    var transaction = new Transaction({
        email: req.body.email,
        expect_xlm: req.body.xlm,
        real_xlm: 0,
        real_wgp: 0,
        secret_key: req.body.secret_key,
        status: 'Pending'
    });
    transaction.save(function(err) {
        if (err) {return next(err);}
        transactionURL = transaction.url;
        console.log(transactionURL);
        res.json({message: 'success', code: 200, transaction_url: transactionURL});
        // changeTrust(req, res);
    });
}

function changeTrust(req, res) {
    caSecret = req.body.secret_key;
    accountController.addTrustline(icoToken,caSecret,function(response){
             console.log('Trust line added!!!!!');
             setTimeout(function(){
                 console.log('buying token');
                 buyTokens(req, res);
                //your express code here
              }, 6000);
             
     })
}

function buyTokens(req, res) {
    caSecret = req.body.secret_key;
    amount = req.body.xlm;
    
    accountController.addNewOffer(icoToken,caSecret,amount,function(response){
        console.log('Token purchased');
        res.json({message: 'success', code: 200, transaction_id: transactionId});
    })
}

