var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
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
	mongoose.model('Transaction').find(function(err, transaction) {
            if (err)
                res.send(err);

            res.json(transaction);
        });
});


// Define the about route
router.get('/about', function(req, res) {
  res.send('About us');
});

module.exports = router;