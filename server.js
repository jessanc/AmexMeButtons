var express = require('express');
var mongoose = require('mongoose');
var Promise = require('promise');
//var mongodbUri = 'mongodb://admin:password@ds149144.mlab.com:49144/amexmebuttons';
var mongodbUri = 'mongodb://localhost/transactionsDB'
var bodyParser = require('body-Parser');
var routes = require('./routes/routes.js');
var app = module.exports = express();
var admin = require('firebase-admin');
var serviceAccount = require("./key.json");
//app.use(express.static('public'));
app.use(routes);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var ip = process.env.OPENSHIFT_NODEJS_IP;
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8765;
var server =app.listen(port,ip,function(){
	console.log("app listening on port " + port);
});
var options = { useMongoClient : true};
mongoose.connect(mongodbUri ,{ useMongoClient: true, promiseLibrary: global.Promise });
//firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-mebuttons.firebaseio.com"
});

var topic = "test";

// See the "Defining the message payload" section below for details
// on how to define a message payload.
var payload = {
  data: {
    title: "blahhasdadas",
    body: "asd"
  }
};
var foptions = {
	click_action: "android.intent.action.MAIN"
}
// Send a message to devices subscribed to the provided topic.
admin.messaging().sendToTopic(topic, payload,foptions)
  .then(function(response) {
    // See the MessagingTopicResponse reference documentation for the
    // contents of response.
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });


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

Transaction.find(function(err,transaction){
	if(err)
		console.log(err);
	console.log(transaction);
});
