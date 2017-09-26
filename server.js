var express = require('express');
var mongoose = require('mongoose');
var Promise = require('promise');
//var mongodbUri = 'mongodb://admin:password@ds149144.mlab.com:49144/amexmebuttons';
var mongodbUri = 'mongodb://admin:password@ds149144.mlab.com:49144/amexmebuttons';
var bodyParser = require('body-parser');
var routes = require('./routes/routes.js');
var app = module.exports = express();

//app.use(express.static('public'));
app.use(routes);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = 1234;
var server = app.listen(port,function(){
	console.log("app listening on port " + port);
});
mongoose.connect(mongodbUri ,{ useMongoClient: true, promiseLibrary: global.Promise });

var Transaction = mongoose.model('Transaction', {
	time : { type : Date, default: Date.now },
	Merchant : String,
	Description: String,
	Amount: Number,
	Status: String,
	Flag : {type: Boolean, default: false},
	TagCategory : String,
	CallBack : {type: Boolean, default: false}
});
var date = new Date(); //2017-04-25T06:23:36.510Z
date.toLocaleTimeString();  //'11:53:36 AM'
Transaction.find(function(err,transaction){
	if(err)
		console.log(err);
	console.log(transaction);
});
