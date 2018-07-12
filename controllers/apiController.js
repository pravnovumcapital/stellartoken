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
        res.json({code: 200, message: 'You send successfully', transaction_id: transaction._id});
    });
}

function changeTrust() {

}

function buyTokens() {

}