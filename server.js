//initialising packages
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

//establishing database mongoose connection
var db = mongoose.connect('mongodb://localhost/swag-shop');

//importing databases models file
var Product = require('./dbModels/products');
var Wishlist = require('./dbModels/wishList');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

//port setting
app.listen(3000, function(){
  console.log("swag shop api server running on port 3000");
});

//POST request handling
//the product owner should be able to enter their product to our databases
app.post('/products', function(request, response){
  //create a new product
  var product = new Product();

  //parse request entry
  product.title = request.body.title;
  product.price = request.body.price;

  //save entry to database using save()
  //first parameter denotes error if any
  //second parameter denotes the successful entry
  product.save(function(err, savedProduct){
    if(err){
      response.status(500).send({error: "post operation failed"});
    }
    else{
      response.send(savedProduct);
      console.log("saved new entry");
      console.log(savedProduct);
    }
  });
});


//see all products
app.get('/products',function(request, response){
  //we directly access Product database and use find()
  Product.find({}, function(err, allProducts){
    if(err){
      response.status(500).send({error: "get request cannot be processed"});
    }
    else{
      response.send(allProducts);
    }
  })
});

//find product by product id as parameter
app.get('/products/:productId', function(request, response){
  var proId = request.params.productId;
  Product.find({ _id: proId }, function(err, outProduct){
    if(err){
      response.status(500).send({error: "Cannot find product"});
    }
    else{
      response.send(outProduct);
    }
  });
});

//add new wishlist to Wishlist table
app.post('/wishlist', function(request, response){
  var list = new Wishlist();

  list.title = request.body.title;

  list.save(function(err, savedList){
    if(err){
      response.status(500).send({error: "Wishlist could not be created"});
    }
    else{
      response.send(savedList);
    }
  });
});

//see all wishlist
app.get('/wishlist', function(request, response){
  //see the wishlist but each should populate entire product instead of just the productId
  //populate parameter:
  //    - path : products is the element in wishlist to be modified
  //    - model : Products is what to populate it with
  Wishlist.find({}).populate({path: 'products', model: 'Products'}).exec(function(err, populatedWishlist){
    if(err){
      response.status(500).send({error: "something went wrong"});
    }
    else{
      response.send(populatedWishlist);
    }
  });
});


// add productId into existing wishList's products array
app.put('/wishlist/product/add', function(request, response){
  var proId = request.body.productId;
  var wishId = request.body.wishlistId;

  //find productid if it exist from Products table
  Product.findOne({_id : proId}, function(err, outProduct){
    if(err){
      response.status(500).send({error: "could not find the product"});
    }
    else{
      //find the wishlist from wishlist table
      //first parameter is searching condition
      //second parameter is column to be updated and its new value
      //third is function
      Wishlist.update({_id : wishId},{$addToSet : {products : outProduct._id} }, function(err, newWishlist){
        if(err){
          response.status(500).send({error: "wishlist could not be found"});
        }
        else{
          response.send("Successfully added to wishlist");
        }
      });
    }
  });

});
