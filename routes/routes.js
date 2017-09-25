var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var bodyParser = require('body-Parser');
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
  //add all fields of transaction from trnsaction
  transaction.Merchant = req.body.Merchant;
  transaction.save(function(err){
    if(err)
      console.log(err);
    res.json({message : 'Transaction added'});
  })
})

// Define the about route
router.get('/about', function(req, res) {
  res.send('About us');
});

module.exports = router;
