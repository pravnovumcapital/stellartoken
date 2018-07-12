var Transaction = require('../models/transaction');

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
        res.json({message: 'success', code: 200});
    });
    
}

function changeTrust() {

}

function buyTokens() {

}