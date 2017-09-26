var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var bodyParser = require('body-parser');
var admin = require('firebase-admin');
var serviceAccount = require("../key.json");
var twilio = require('twilio');

//firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-mebuttons.firebaseio.com"
});
var topic = "test";
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log('Time: ', Date.now());
  next();
});


// Define the home page route
router.get('/', function(req, res) {
  res.json({ message: 'home page' });

});

router.get('/transactions',function(req,res){
	var transactionModel = mongoose.model('Transaction');
  console.log(req.body);
	transactionModel.find(function(err, transaction) {
            if (err)
                res.send(err);

            res.json(transaction);
        });
});
router.get('/transaction',function(req,res){
  var transactionModel = mongoose.model('Transaction');
    console.log(req.query);
  var id = req.query.ID;
  var objID = mongoose.Types.ObjectId(id);
  console.log("ID received : " + objID);
  transactionModel.findById(objID,
       function(err, trans){
         if(err)
         console.log(err);
         console.log(trans);
         res.status(200);
         res.json(trans);
       });
})
router.post('/transaction',function(req,res){
	var transactionModel = mongoose.model('Transaction');
  var transaction = new transactionModel();
  //console.log(req.body);
  transaction.Merchant = req.body.Merchant;
  transaction.Description = req.body.Description;
  transaction.Amount = req.body.Amount;
  transaction.Status = req.body.Status;
  transaction.save(function(err,saved){
    if(err)
      console.log(err);
    res.json({message : 'Transaction added'});
    console.log(saved.id);
    //sending firebase
    var payload = {
      data: {
        Merchant : saved.Merchant,
        Amount: saved.Amount.toString(),
        ID: saved.id
      }
    };
    // Send a message to devices subscribed to the provided topic.
    admin.messaging().sendToTopic(topic, payload)
      .then(function(response) {
        // See the MessagingTopicResponse reference documentation for the
        // contents of response.
        console.log("Successfully sent message:", response);
      })
      .catch(function(error) {
        console.log("Error sending message:", error);
      });
  })
})
router.post('/tagMe',function(req,res){
  var transactionModel = mongoose.model('Transaction');
  console.log(req.body);
  var id = req.body.ID;
  var category = req.body.category;
  var objID = mongoose.Types.ObjectId(id);
  console.log("ID received : " + objID);
  transactionModel.update({_id: id},{Flag : true , TagCategory : category},
     {multi:true},
       function(err, numberAffected){
         if(err)
         console.log(err);
       });
       var query = transactionModel.findById(objID);
       var promise = query.exec();

       promise.then(function(doc){
         console.log(doc);
       })

  res.sendStatus(200);
});
router.post('/callMe',function(req,res){
  var transactionModel = mongoose.model('Transaction');
  console.log(req.body);
  var id = req.body.ID;
  var objID = mongoose.Types.ObjectId(id);
  console.log("ID received for callme: " + objID);
 transactionModel.update({_id: id},{CallBack : true },
     {multi:true},
       function(err, documents){
         if(err)
         console.log(err);
       });
  var query = transactionModel.findById(objID);
  var promise = query.exec();

  promise.then(function(doc){
    console.log(doc);
    call(doc);
    // text2Speech(doc);
  })
  res.sendStatus(200);
})

function call(transaction){
  var URL = "https://poised-yarn-8449.twil.io/assets/avaintro.mp3";
  if(transaction.Merchant == "Home Depot")
    URL = "https://poised-yarn-8449.twil.io/assets/homedepot.mp3";
  else if (transaction.Merchant == "AB Financial")
    URL = "https://poised-yarn-8449.twil.io/assets/ABFinancial.mp3";
  else if (transaction.Merchant == "Netflix")
    URL = "https://poised-yarn-8449.twil.io/assets/Netflix.mp3";

  var ACCOUNT_SID = "AC710bb21579f2b277fc1f6388ad783398";
  var AUTH_TOKEN = "cd4155173f2582ecc256e43f400b4340";
  var TWILIO_NUMBER = "+15615624153";
  var APPLICATION_SID = "AP4312e72c31b282f9f1edaeb5a5afe48b";
  var client = new twilio(ACCOUNT_SID, AUTH_TOKEN);

  client.calls.create({
      url: URL,
      to: "+19542344105",
      from: TWILIO_NUMBER
  }, function(err, call) {
      if (!err) {
          // The second argument to the callback will contain the information
          // sent back by Twilio for the request. In this case, it is the
          // information about the phone call you just made:
          console.log('Success! There was a call: ');
          console.log(call.sid);
      } else {
          console.log('Oops! There was an error.');
          console.log(error);
      }
  });
}

router.post('/voice', (request, response) => {

  // Use the Twilio Node.js SDK to build an XML response
  var twiml = new twilio.twiml.VoiceResponse();
  twiml.say(`This is a test tosee if voice to speech really works`, {
    voice: 'alice'
  });
  twiml.play('https://demo.twilio.com/docs/classic.mp3');

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

function text2Speech(transaction){
  var ACCOUNT_SID = "AC710bb21579f2b277fc1f6388ad783398";
  var AUTH_TOKEN = "cd4155173f2582ecc256e43f400b4340";
  var TWILIO_NUMBER = "+15615624153";
  var APPLICATION_SID = "AP4312e72c31b282f9f1edaeb5a5afe48b";
  var client = new twilio(ACCOUNT_SID, AUTH_TOKEN);

  client.calls.create({
      url: "http://13.58.150.184:1234/voice",
      to: "+19542344105",
      from: TWILIO_NUMBER
  }, function(err, call) {
      if (!err) {
          // The second argument to the callback will contain the information
          // sent back by Twilio for the request. In this case, it is the
          // information about the phone call you just made:
          console.log('Success! There was a call: ');
          console.log(call.sid);
      } else {
          console.log('Oops! There was an error.');
          console.log(err);
      }
  });
}

// Define the about route
router.get('/about', function(req, res) {
  res.send('About us');
});

module.exports = router;
