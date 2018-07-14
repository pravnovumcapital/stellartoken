var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TransactionSchema = new Schema(
    {
        email: {type: String, max: 100},
        expect_xlm: {type: Number},
        real_xlm: {type: Number},
        real_wgp: {type: Number},
        secret_key: {type: String, max: 100},
        status: {type: String, max: 10}
    }
);

TransactionSchema.virtual('url').get(function(){
    return '/register/detail/' + this._id;
});

TransactionSchema.virtual('home').get(function() {
    return '/register/' + this.email;
});
module.exports = mongoose.model('Transaction', TransactionSchema);
