
exports.register = function(req, res, next) {
    res.render('register', {title: 'Wpay tokens'});
}

exports.detail = function(req, res, next) {
    res.render('detail', {title: "Transaction detail"});
}