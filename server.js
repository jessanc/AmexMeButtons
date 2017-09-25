var express = require('express');
var mongoose = require('mongoose');
var Promise = require('promise');
var mongodbUri = 'mongodb://admin:password@ds149144.mlab.com:49144/amexmebuttons';
var bodyParser = require('body-Parser');
var firebase = require('firebase');
var port = 8888;


var app = express();
app.listen(port,function(){
	console.log("app listening on port " + port);
});
var options = { useMongoClient : true};  

mongoose.connect(mongodbUri ,{ useMongoClient: true, promiseLibrary: global.Promise });
//Define a schema
var Schema = mongoose.schema;
var Cat = mongoose.model('Cat', { name: String });
var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('meow');
  }
});

