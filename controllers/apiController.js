var Transaction = require('../models/transaction');
var accountController = require('./accountController');
var transactionId;
var icoToken = {
                DA: process.env.DA,
                GA: process.env.IA,
                code: process.env.CODE,
                limit: process.env.LIMIT
            };
exports.register = function(req, res) {
    var transaction = new Transaction({
        email: req.body.email,
        name: req.body.name,
        date_of_birth: req.body.date_of_birth,
        phone_number: req.body.phone_number,
        xlm: req.body.xlm,
        secret_key: req.body.secret_key
    });
    transaction.save(function(err) {
        if (err) {return next(err);}
        transactionId = transaction._id;
        changeTrust(req, res);
        // buyTokens(req, res);
    });
}

function changeTrust(req, res) {
    caSecret = req.body.secret_key;
    accountController.addTrustline(icoToken,caSecret,function(response){
             console.log('Trust line added!!!!!');
             buyTokens(req, res);
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

