var accountController = require('./accountController');
if(process.env.NODE_ENV != 'production'){
    //development
    var icoToken = {
        DA: process.env.DA_DEV,
        GA: process.env.IA_DEV,
        code: process.env.CODE_DEV,
        price: process.env.PRICE,
        limit: process.env.LIMIT
    };
}
else{
    //production
	var icoToken = {
        DA: process.env.DA,
        GA: process.env.IA,
        code: process.env.CODE,
        price: process.env.PRICE,
        limit: process.env.LIMIT
    };
}

exports.register = function(req, res,next) {
    changeTrust(req, res,next);
}

function changeTrust(req, res,next) {
    caSecret = (req.body.secret_key).trim();
    amount = (req.body.coins)*(process.env.LUMENS);
    coins = req.body.coins;
    //console.log(icoToken.DA);
    if(!caSecret)
    {
        res.json({message: 'missing secret key', code: 400});  
        return next(new Error([error]));
    }
    if(!amount)
    {
        res.json({message: 'missing number of coins', code: 400}); 
        return next(new Error([error]));
    }
    console.log('coins',coins);
    console.log('amount',amount);
    console.log('here');
    //return false;
    accountController.addTrustline(icoToken,caSecret,amount,function(error,response){
        if(error)
        {
            res.json({message: error.message, code: 400}); 
            return next(new Error([error]));
            //return false;
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
            return next(new Error([error]));
        }
        else{
            console.log('Token purchased');
            res.json({message: 'success', code: 200});
        }
        
    })
}

