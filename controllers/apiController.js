var Transaction = require('../models/transaction');
var accountController = require('./accountController');
var transactionURL;
var icoToken = {
                DA: process.env.DA,
                GA: process.env.IA,
                code: process.env.CODE,
                price: process.env.PRICE,
                limit: process.env.LIMIT
            };
exports.register = function(req, res) {
    changeTrust(req, res);
}

function changeTrust(req, res) {
    caSecret = req.body.secret_key;
    amount = (req.body.coins)*(process.env.LUMENS);
    coins = req.body.coins;
    console.log('coins',coins);
    //return false;
    accountController.addTrustline(icoToken,caSecret,amount,function(error,response){
        if(error)
        {
            res.json({message: error.message, code: 400, transaction_id: transactionId}); 
            return false;
        }
        if(response){
            console.log('Trust line added!!!!!');
            setTimeout(function(){
                console.log('buying token');
                buyTokens(req, res,amount,caSecret);
             }, 6000);
        }
            
             
     })
}

function buyTokens(req, res,amount,caSecret) {
    accountController.addNewOffer(icoToken,caSecret,amount,function(error,response){
        
        if(error)
        {
            console.log('Error sending token');
            res.json({message: error.message, code: 400}); 
        }
        else{
            console.log('Token purchased');
            res.json({message: 'success', code: 200});
        }
        
    })
}

