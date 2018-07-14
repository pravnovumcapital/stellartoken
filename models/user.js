var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        email: {type: String, max: 100},
        real_wgp: {type: Number}
    }
)