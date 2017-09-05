var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/mydb"

MongoClient.connect(url, function(err){
 if(!err) {
    console.log("Database is connected ... nn");
} else {
    console.log("Error connecting database ... nn");
}
});



var app = express();


/* GET register page. */
router.get('/register', function(req, res) {
  res.render('index');
});

//get login page
router.get('/login', function(req, res) {
  res.render('login1');
});


//************************************************************************
//************************************************************************
router.post('/register',function(req,res,db){
  console.log("req",req.body);

  MongoClient.connect(url, function(err,db){ 
  var users = {
    "first_name":req.body.first_name,
    "last_name":req.body.last_name,
    "email":req.body.email,
    "password":req.body.password,
  };
  db.collection("customers").insertOne(users, function (error, results) {
  if (error) {
    console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    });
  }else{
    console.log('The solution is: ', results);
    res.send({
      "code":200,
      "success":"user registered sucessfully"
        });
  }
  });
});
});




router.post('/login',function(req,res){

  MongoClient.connect(url, function(err,db) {
  var query= { "email": req.body.email };
  var password = req.body.password;

  db.collection("customers").find(query).toArray(function(err, result) {
  if (err) {
    // console.log("error ocurred",error);
    res.send({
      "code":400,
      "failed":"error ocurred"
    });
  }else{
    // console.log('The solution is: ', results);
    if(result.length >0){
      if(result[0].password == password){
        res.send({
          "code":200,
          "success":"login sucessfull"
            });
      }
      else{
        res.send({
          "code":204,
          "success":"Email and password does not match"
            });
      }
    }
    else{
      res.send({
        "code":204,
        "success":"Email does not exits"
          });
    }
  }
  });
});

});
module.exports = router;
