var StellarSdk = require('stellar-sdk');
if(process.env.NODE_ENV != 'production'){
	StellarSdk.Network.useTestNetwork();
}
if(process.env.NODE_ENV == 'production')
var server = new StellarSdk.Server('https://horizon.stellar.org');
else
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');


exports.addTrustline = function (icoToken,caSecret,amount,callback) {
	 
	 var customerKey = StellarSdk.Keypair
	  .fromSecret(caSecret);
	  var transaction;
	  server.loadAccount(customerKey.publicKey())
	  // If the account is not found, surface a nicer error message for logging.
	  .catch(function(err) {
				console.log('An error has occured:');
				var err = {'message':'Invalid Acccount'};
				callback(err,null);
      })
	  // If there was no error, load up-to-date information on your account.
	  .then(function() {
	    return server.loadAccount(customerKey.publicKey());
	  })
	  .then(function(sourceAccount) {
			var accountBalance =  0;
			sourceAccount.balances.forEach(element => {
				if(element.asset_type=='native')
				{
					 accountBalance =  element.balance;
				}
				console.log('accountBalance',accountBalance);
			});
			if(accountBalance < amount)
			{
				var err = {'message':'You dont have enough balance to buy this number of token!'};
				callback(err,null);
			}else{
				transaction = new StellarSdk.TransactionBuilder(sourceAccount)
	      .addOperation(StellarSdk.Operation.changeTrust({
	        asset: new StellarSdk.Asset(icoToken.code, icoToken.GA),
	        limit: icoToken.limit
	      }))
	      .build();
	      transaction.sign(customerKey);
				// And finally, send it off to Stellar!
				server.submitTransaction(transaction);
				console.log(transaction);
	      callback(null,transaction);
			}
	    
	  }).catch(function(error) {
	      console.log('An error has occured:');
				var err = {'message':'Transaction failed'};
				callback(err,null);
	  });
}

exports.addNewOffer = function(icoToken,caSecret,amount,callback){
		var sourceKeys = StellarSdk.Keypair.fromSecret(caSecret);
		server.loadAccount(sourceKeys.publicKey())
		  // If the account is not found, surface a nicer error message for logging.
		  .catch(function(err) {
	        console.log('An error has occured:');
	        var err = {'message':'Invalid Acccount'};
			  	callback(err,null);
	        //return false;
	      })
	  		// If there was no error, load up-to-date information on your account.
		  .then(function(sourceAccount) {
				var accountBalance =  0;
				sourceAccount.balances.forEach(element => {
					if(element.asset_type=='native')
					{
						accountBalance =  element.balance;
					}
					console.log('accountBalance',accountBalance);
				});
				if(accountBalance < amount)
				{
					var err = {'message':'You dont have enough balance to buy this number of token!'};
					callback(err,null);
				}
		    //return server.loadAccount(sourceKeys.publicKey());
		    var transaction1 = new StellarSdk.TransactionBuilder(sourceAccount)
	        .addOperation(StellarSdk.Operation.manageOffer({
	            selling: new StellarSdk.Asset.native,
	            buying: new StellarSdk.Asset(icoToken.code, icoToken.GA),
	            amount: amount.toString(),
	            price: icoToken.price,
	            offerId: 0,
	        })).build();
	        //transaction1.sign(sourceKeys);
	        transaction1.sign(StellarSdk.Keypair.fromSecret(caSecret));
	         return server.submitTransaction(transaction1);
	        })
	        .then(function(result) {
			  	  console.log('Payment Success! token transfred to account:', result)
			  	  callback(null,result);
		      })
			  .catch(function(error) {
					console.error('Something went wrong!', error);
					var err = {'message':'Something went wrong!'};
					callback(err,null);
			  });
}