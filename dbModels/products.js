// this database model defines the Products table in database.
//the database query will go forward only through rules defined in here

var mongoose = require('mongoose');

//defines schema for product by calling Schema function in mongoose
var Schema = mongoose.Schema;

var product = new Schema({
  //define column name and its type
  title : {type :String, required: true},
  price : Number,
  likes : {type: Number, default: 0 }
});

//export the model to be accessed by other codes
//here we are exporting schema product.
//in the database this schema will known as table 'Product'
module.exports = mongoose.model('Products', product);
