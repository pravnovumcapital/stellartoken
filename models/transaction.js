var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TransactionSchema = new Schema(
    {
        email: {type: String, max: 100},
        name: {type: String, max: 100},
        date_of_birth: {type: Date},
        phone_number: {type: Number},
        xlm: {type: Number},
        secret_key: {type: String, max: 100}
    }
);

TransactionSchema.virtual('url').get(function(){
    return '/register/' + this._id;
});

module.exports = mongoose.model('Transaction', TransactionSchema);