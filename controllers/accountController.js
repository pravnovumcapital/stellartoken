var StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
//var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
exports.test = function (req,res) {
	var caSecret = req.params.secret;
	var amount = req.params.amount;
	var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
	var sourceKeys = StellarSdk.Keypair
	  .fromSecret(caSecret);
	var destinationId = process.env.DA;
	// Transaction will hold a built transaction we can resubmit if the result is unknown.
	var transaction;

	// First, check to make sure that the destination account exists.
	// You could skip this, but if the account does not exist, you will be charged
	// the transaction fee when the transaction fails.
	server.loadAccount(destinationId)
	  // If the account is not found, surface a nicer error message for logging.
	  .catch(function(err) {
        console.log('An error has occured:');
        console.log(err);
        res.send('invalid distribution id!');
        //return false;
      })
	  // If there was no error, load up-to-date information on your account.
	  .then(function() {
	    return server.loadAccount(sourceKeys.publicKey());
	  })
	  .catch(function(err) {
        console.log('An error has occured:');
        console.log(err);
        res.send('invalid sender id!');
        //return false;
      })
	  .then(function(sourceAccount) {
	    // Start building the transaction.
	    transaction = new StellarSdk.TransactionBuilder(sourceAccount)
	      .addOperation(StellarSdk.Operation.payment({
	        destination: destinationId,
	        // Because Stellar allows transaction in many currencies, you must
	        // specify the asset type. The special "native" asset represents Lumens.
	        asset: StellarSdk.Asset.native(),
	        amount: amount
	      }))
	      // A memo allows you to add your own metadata to a transaction. It's
	      // optional and does not affect how Stellar treats the transaction.
	      .addMemo(StellarSdk.Memo.text('Test Transaction'))
	      .build();
	    // Sign the transaction to prove you are actually the person sending it.
	    transaction.sign(sourceKeys);
	    // And finally, send it off to Stellar!
	    return server.submitTransaction(transaction);
	  })
	  .then(function(result) {
	  	console.log('Payment Success!!! Lumens transfred to account:', result);
  		var icoToken = {
  		        DA: process.env.DA,
  		        GA: process.env.IA,
  		        code: process.env.CODE,
  		        limit: process.env.LIMIT
  	    	};
  	    var customerSecret = caSecret;
  		console.log('process trust line');
  		module.exports.addTrustline(icoToken,customerSecret,function(response){
  			console.log('Trust line added!!!!!');
  			//console.log(response);

  			console.log('sending token to customer!!');
  			var sourceSecret = process.env.DS;
  			module.exports.transfer(sourceKeys.publicKey(),sourceSecret,icoToken,amount,function(response){
				console.log('payment success!! coint sent');
				//console.log(response);
				res.send('Coin sent successfully!');
			})
  		})
	    
	  })
	  .catch(function(error) {
	    console.error('Something went wrong!', error);
	    // If the result is unknown (no response body, timeout etc.) we simply resubmit
	    // already built transaction:
	    // server.submitTransaction(transaction);
	  });
}

exports.addTrustline = function (icoToken,caSecret,callback) {
	//console.log('2222');
	 var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
	 var customerKey = StellarSdk.Keypair
	  .fromSecret(caSecret);
	  var transaction;
	  server.loadAccount(customerKey.publicKey())
	  // If the account is not found, surface a nicer error message for logging.
	  .catch(function(err) {
        console.log('An error has occured:');
        console.log(err);
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

exports.transfer = function(destinationId,sourceSecret,icoToken,amount,callback){
	var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
	var sourceKeys = StellarSdk.Keypair
	  .fromSecret(sourceSecret);
	//var destinationId = destination;
	// Transaction will hold a built transaction we can resubmit if the result is unknown.
	var transaction;

	// First, check to make sure that the destination account exists.
	// You could skip this, but if the account does not exist, you will be charged
	// the transaction fee when the transaction fails.
	server.loadAccount(destinationId)
	  // If the account is not found, surface a nicer error message for logging.
	  .catch(StellarSdk.NotFoundError, function (error) {
	    throw new Error('The destination account does not exist!');
	  })
	  // If there was no error, load up-to-date information on your account.
	  .then(function() {
	    return server.loadAccount(sourceKeys.publicKey());
	  })
	  .then(function(sourceAccount) {
	    // Start building the transaction.
	    transaction = new StellarSdk.TransactionBuilder(sourceAccount)
	      .addOperation(StellarSdk.Operation.payment({
	        destination: destinationId,
	        // Because Stellar allows transaction in many currencies, you must
	        // specify the asset type. The special "native" asset represents Lumens.
	        asset: new StellarSdk.Asset(icoToken.code, icoToken.GA),
	        amount: amount
	      }))
	      // A memo allows you to add your own metadata to a transaction. It's
	      // optional and does not affect how Stellar treats the transaction.
	      .addMemo(StellarSdk.Memo.text('Test Transaction'))
	      .build();
	    // Sign the transaction to prove you are actually the person sending it.
	    transaction.sign(sourceKeys);
	    // And finally, send it off to Stellar!
	    return server.submitTransaction(transaction);
	  })
	  .then(function(result) {
	  	//console.log('Payment Success! token transfred to account:', result)
	  	callback(result);
	    
	  })
	  .catch(function(error) {
	    console.error('Something went wrong!', error);
	    // If the result is unknown (no response body, timeout etc.) we simply resubmit
	    // already built transaction:
	    // server.submitTransaction(transaction);
	  });
}
exports.manageOffer = function(req,res){
	var icoToken = {
  		        DA: process.env.DA,
  		        GA: process.env.IA,
  		        code: process.env.CODE,
  		        limit: process.env.LIMIT
  	    	};
  	//var caSecret = req.params.secret;
  	var caSecret = 'SAW24ODMBN5PA7JBX7OEZ2NIVMIKP62N7X2N5SSXMQYQXOOPUVSP47BK';
  	var amount = req.params.amount;
  	var sourceKeys = StellarSdk.Keypair
	  .fromSecret(caSecret);

	// module.exports.addTrustline(icoToken,caSecret,function(response){
 //  			console.log('Trust line added!!!!!');
 //  			console.log(caSecret);
  			

  			
			  
 //  	})
  	setTimeout(function(){
  			  module.exports.addNewOffer(icoToken,caSecret,amount,function(response){
  				console.log('successs');
  				res.send(response);
  			  })
  			}, 3000);
}
exports.addNewOffer = function(icoToken,caSecret,amount,callback){
		var sourceKeys = StellarSdk.Keypair.fromSecret(caSecret);
		var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
		var account = server.loadAccount(sourceKeys.publicKey())
		  // If the account is not found, surface a nicer error message for logging.
		  .catch(function(err) {
	        console.log('An error has occured:');
	        console.log(err);
	        res.send('invalid customer!');
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
exports.generateAccount = function () {
	//console.log('here');
    var pair = StellarSdk.Keypair.random();
    return {
        publicKey: pair.publicKey(),
        secretKey: pair.secret()
    }
}