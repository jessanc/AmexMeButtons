var express = require('express');
var mongoose = require('mongoose');
var Promise = require('promise');
//var mongodbUri = 'mongodb://admin:password@ds149144.mlab.com:49144/amexmebuttons';
var mongodbUri = 'mongodb://localhost/transactionsDB'
var bodyParser = require('body-Parser');
var firebase = require('firebase');
var routes = require('router');
var port = 8888;


var app = express();
app.use(express.static('public'));
app.use(routes);

var server =app.listen(port,function(){
	console.log("app listening on port " + port);
});
var options = { useMongoClient : true};  

mongoose.connect(mongodbUri ,{ useMongoClient: true, promiseLibrary: global.Promise });
//Define a schema
var Schema = mongoose.schema;
var Transaction = mongoose.model('Transaction', { 
	name: String 

});
var sampleTransaction = new Transaction({ 
	name: 'Zildjian' 

});
/*sampleTransaction.save(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Trnsaction added');
  }
});*/

Transaction.find(function(err,transaction){
	if(err)
		console.log(err);
	console.log(transaction);
});



