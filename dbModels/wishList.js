//this model defines table Wishlist

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//this allows us to access automatically created IDs
var ObjectId = mongoose.Schema.Types.ObjectId;

var wishList = new Schema({
    title : {type: String, default: "personal wish list"},

    // instead of defining new schema, we can create a relationship to Products database
    // we just need ID of product and could access it whenever neccesary
    //products is an array that has objectId refered from Products table
    products : [ {type: ObjectId, ref: 'Products'}  ]
});

module.exports = mongoose.model( "WishList", wishList);
