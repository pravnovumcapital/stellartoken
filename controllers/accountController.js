var StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
if(process.env.NODE_ENV == 'production')
var server = new StellarSdk.Server('https://horizon.stellar.org');
else
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
//var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');


exports.addTrustline = function (icoToken,caSecret,callback) {
	 
	 var customerKey = StellarSdk.Keypair
	  .fromSecret(caSecret);
	  var transaction;
	  server.loadAccount(customerKey.publicKey())
	  // If the account is not found, surface a nicer error message for logging.
	  .catch(function(err) {
        console.log('An error has occured:');
        console.log(err);
        res.json({message: 'invalid secret key', code: 400});
      })
	  // If there was no error, load up-to-date information on your account.
	  .then(function() {
	    return server.loadAccount(customerKey.publicKey());
	  })
	  .then(function(sourceAccount) {
	  	//console.log('sourceAccount:',sourceAccount);
	    // Start building the transaction.
	    transaction = new StellarSdk.TransactionBuilder(sourceAccount)
	      .addOperation(StellarSdk.Operation.changeTrust({
	        asset: new StellarSdk.Asset(icoToken.code, icoToken.GA),
	        limit: icoToken.limit
	      }))
	      // A memo allows you to add your own metadata to a transaction. It's
	      // optional and does not affect how Stellar treats the transaction.
	      //.addMemo(StellarSdk.Memo.text('Test Transaction'))
	      .build();
	      transaction.sign(customerKey);
	      // And finally, send it off to Stellar!
	      //console.log('44444');
	      callback(transaction);
	      return server.submitTransaction(transaction);
	  }).catch(function(error) {
	    console.error('Something went wrong!', error);
	    // If the result is unknown (no response body, timeout etc.) we simply resubmit
	    // already built transaction:
	    // server.submitTransaction(transaction);
	  });
    
    
}



exports.addNewOffer = function(icoToken,caSecret,amount,callback){
		var sourceKeys = StellarSdk.Keypair.fromSecret(caSecret);
		var account = server.loadAccount(sourceKeys.publicKey())
		  // If the account is not found, surface a nicer error message for logging.
		  .catch(function(err) {
	        console.log('An error has occured:');
	        console.log(err);
	        res.json({message: 'invalid secret key', code: 400});
	        //return false;
	      })
	  		// If there was no error, load up-to-date information on your account.
		  .then(function(sourceAccount) {
		  	console.log(sourceAccount.sequenceNumber());
		  	//res.send(account);
		    //console.log('accountdata',result);
		    //return server.loadAccount(sourceKeys.publicKey());
		    var transaction1 = new StellarSdk.TransactionBuilder(sourceAccount)
	        .addOperation(StellarSdk.Operation.manageOffer({
	            selling: new StellarSdk.Asset.native,
	            buying: new StellarSdk.Asset(icoToken.code, icoToken.GA),
	            amount: amount,
	            price: 0.1,
	            offerId: 0,
	        })).build();
		        
	        //transaction1.sign(sourceKeys);
	        transaction1.sign(StellarSdk.Keypair.fromSecret(caSecret));


	        
	         return server.submitTransaction(transaction1);
	          })
	         .then(function(result) {
			  	//res.send(result);
			  	console.log('Payment Success! token transfred to account:', result)
			  	//callback(result);
			  	callback(result);
		    
		      })
			  .catch(function(error) {
			  	//res.send('dasdsad');
			    console.error('Something went wrong!', error);
			    // If the result is unknown (no response body, timeout etc.) we simply resubmit
			    // already built transaction:
			    // server.submitTransaction(transaction);
			  });
}
