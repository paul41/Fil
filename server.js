const express = require('express');
const app=express();
const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://admin:admin1!@ds229290.mlab.com:29290/filiate_master"
const mongojs = require('mongojs');
const bodyParse = require("body-parser");
const util = require("util");
const assert = require("assert");
const rateLimit = require("express-rate-limit");
var port = process.env.PORT || 8080;
const projectQ = {'SearchItems.$':1};
app.use(express.static(__dirname+"/main"));

app.get('/marketplace',(req,res)=>{
	let respArr = [];
	mongoClient.connect(url,(err,db)=>{
		assert.equal(null,err);
		let cursor = db.collection('BestBuy').find(req.query);
		cursor.forEach((docs,err)=>{
			assert.equal(null,err);
			respArr.push(docs)
		},()=>{
			db.close();
			res.json(respArr)
		})
	})
});
app.get('/productsdetail',(req,res)=>{

	let colRes = [];
	mongoClient.connect(url,(err,db)=>{
		assert.equal(null,err);
		let cursor = db.collection('BestBuy').find(req.query,projectQ);
		cursor.forEach((docs,err)=>{
			assert.equal(null,err);
			colRes.push(docs)
		},()=>{
			db.close();
			res.json(colRes)
		})
	})
});
app.get('/sortitems',(req,res)=>{
	let sortArr = [];
	let cursor;
	mongoClient.connect(url,(err,db)=>{
		assert.equal(null,err);
		let queryArray = req.query.sortParam;
		if(queryArray[0] == 'Price high to low'){
			cursor = db.collection('BestBuy').aggregate([
			  {
			    $unwind: "$SearchItems"
			  },
			  {
			    $match: {
			      "SearchItems.ProductType": queryArray[1]
			    }
			  },
			  {
			    $unwind: "$SearchItems.product"
			  },
			  {
			    $sort: {
			      "SearchItems.product.price": -1
			    }
			  }
			]);
		}
		else if(queryArray[0] == 'Rating'){
			cursor = db.collection('BestBuy').aggregate([
			  {
			    $unwind: "$SearchItems"
			  },
			  {
			    $match: {
			      "SearchItems.ProductType": queryArray[1]
			    }
			  },
			  {
			    $unwind: "$SearchItems.product"
			  },
			  {
			    $sort: {
			      "SearchItems.product.rating": -1
			    }
			  }
			]);
		}
		// YET TO IMPLEMENT...
		//	}else{
		// 	cursor = db.collection('BestBuy').aggregate([
		// 		{$match:''},
		// 		{$unwind:'$SearchItems.product'},
		// 		{$sort:'SearchItems.product.recommended':1}
		// 	])
		// }		
		cursor.forEach((docs,err)=>{
			assert.equal(null,err);
			sortArr.push(docs)
		},()=>{
			db.close();
			res.json(sortArr)
		})
	})
})
app.get('/No-Data',(req,res)=>{
	res.send("<!doctype html><html><body><div style='text-align:center'><h1>No Data Found. </h1></br><a href='http://localhost:5000/#!/' ><span style='color:green'>Try again</span></a></div></body></html>")
});

/* Log-in service */
const createAccountLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message:
    "Too many accounts created from this IP, please try again after an hour"
});
app.post('/create-account',createAccountLimiter,(req,res)=>{
	//Implement Login...
});
/*................*/

app.listen(port,function(){
	console.log("app running on port ",port)
});
