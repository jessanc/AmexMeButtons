var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var bodyParser = require('body-parser');
var admin = require('firebase-admin');
var serviceAccount = require("../key.json");

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
  var objID = mongoose.Types.ObjectId(id);
  console.log("ID received : " + objID);
  //   transactionModel.findById(objID, function (err, trans){
  //     if(err)
  //     console.log(err);
  //     console.log("Transaction found with id : " + trans);
  // });
  transactionModel.update({_id: id},{Flag : true },
     {multi:true},
       function(err, numberAffected){
         if(err)
         console.log(err);
         console.log(numberAffected);
       });

  res.sendStatus(200);
});
router.post('/callMe',function(req,res){
  var transactionModel = mongoose.model('Transaction');
  console.log(req.body);
  var id = req.body.ID;
  var objID = mongoose.Types.ObjectId(id);
  console.log("ID received for callme: " + objID);
    transactionModel.findById(objID, function (err, trans){
      if(err)
      console.log(err);
      console.log("Transaction found with id(callme) : " + trans);
  });
  res.sendStatus(200);
})
// Define the about route
router.get('/about', function(req, res) {
  res.send('About us');
});

module.exports = router;
