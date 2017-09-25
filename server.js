var express = require('express');
var mongoose = require('mongoose');
var Promise = require('promise');
//var mongodbUri = 'mongodb://admin:password@ds149144.mlab.com:49144/amexmebuttons';
var mongodbUri = 'mongodb://localhost/transactionsDB'
var bodyParser = require('body-Parser');
//var firebase = require('firebase');
var routes = require('./routes/routes.js');
var port = 8888;


var app = express();
//app.use(express.static('public'));
app.use(routes);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var server =app.listen(port,function(){
	console.log("app listening on port " + port);
});
var options = { useMongoClient : true};  
mongoose.connect(mongodbUri ,{ useMongoClient: true, promiseLibrary: global.Promise });
//Define a schema

var Transaction = mongoose.model('Transaction', { 
	time : { type : Date, default: Date.now },
	Merchant : String,
	Description: String,
	Amount: Number,
	Status: String,
	Flag : Boolean,
	TagCategory : String
});
var date = new Date(); //2017-04-25T06:23:36.510Z
date.toLocaleTimeString();  //'11:53:36 AM'
var sampleTransaction = new Transaction({ 
	time : date,
	Merchant: 'Paypal',
	Description: 'Gift',
	Amount: '25.50',
	Status: 'Pending',
	Flag : false,
	TagCategory : 'none'
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



