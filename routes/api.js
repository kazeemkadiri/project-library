/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

MongoClient.connect(MONGODB_CONNECTION_STRING,((err,client) => {
  const collection = client.db("personal-library").collection("books");
  // perform actions on the collection object

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      collection.find({}).toArray((err, docs)=>{
   	  if(err) console.log(err);

          res.json(docs);
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title

      collection.insertOne({title},(err, result)=>{
        if(err) console.log(err);

     	res.json(result.ops[0]);
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;

      collection.find({_id: ObjectId(bookid)})
        .toArray((err, result)=>{
 	  if(err)console.log(err);

          res.json(result);
        });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });

    app.use((req,res,next)=>{
      res.status(404)
   	 .type('text')
 	 .send('Not Found');
    });

  }));  
};
