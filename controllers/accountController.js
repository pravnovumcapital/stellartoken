var StellarSdk = require('stellar-sdk');
var winston = require('winston');
if(process.env.NODE_ENV != 'production'){
	StellarSdk.Network.useTestNetwork();
}
else{
	StellarSdk.Network.usePublicNetwork();
}
if(process.env.NODE_ENV == 'production')
var server = new StellarSdk.Server('https://horizon.stellar.org');
else
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

function initLogger(custPublic)
{
	var d = new Date().toISOString().split('T')[0];
		//console.log(d);
		//return false;
		var fs = require( 'fs' );
		var logDir = 'transaction_logs/'+process.env.NODE_ENV+'/'+d; // directory path you want to set
		if ( !fs.existsSync( logDir ) ) {
				// Create the directory if it does not exist
				fs.mkdirSync( logDir );
		}
		const logger = winston.createLogger({
			transports: [
				new winston.transports.Console(),
				new winston.transports.File({ filename: logDir+'/'+custPublic+'.log' })
			]
		});
		return logger;
}

exports.addTrustline = function (icoToken,caSecret,amount,callback) {
	 
	 var customerKey = StellarSdk.Keypair
	  .fromSecret(caSecret);
		var transaction;
		logger = initLogger(customerKey.publicKey());
	  server.loadAccount(customerKey.publicKey())
	  // If the account is not found, surface a nicer error message for logging.
	  .catch(function(err) {
				logger.log({
					level: 'error',
					message: err
				});
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
				console.log('issuer public', icoToken.GA);
				console.log('code',icoToken.code);
				//return false;
				transaction = new StellarSdk.TransactionBuilder(sourceAccount)
	      .addOperation(StellarSdk.Operation.changeTrust({
	        asset: new StellarSdk.Asset(icoToken.code, icoToken.GA),
	        limit: icoToken.limit
	      }))
				.build();
				
	      transaction.sign(customerKey);
				// And finally, send it off to Stellar!
				
				server.submitTransaction(transaction);
				logger.log({
					level: 'info',
					message: transaction
				});
				console.log(transaction);
	      callback(null,transaction);
			}
	    
	  }).catch(function(error) {
				logger.log({
					level: 'error',
					message: error
				});
			  console.log(error);
	      console.log('An error has occured:');
				var err = {'message':'Transaction failed'};
				callback(err,null);
	  });
}

exports.addNewOffer = function(icoToken,caSecret,amount,callback){
		var sourceKeys = StellarSdk.Keypair.fromSecret(caSecret);
		logger = initLogger(sourceKeys.publicKey());
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
						logger.log({
							level: 'info',
							message: result
						});
			  	  console.log('Payment Success! token transfred to account:', result)
			  	  callback(null,result);
		      })
			  .catch(function(error) {
					logger.log({
						level: 'error',
						message: error
					});
					console.error('Something went wrong!', error);
					var err = {'message':'Something went wrong!'};
					callback(err,null);
			  });
}