const express = require('express');
const app=express();
const util = require("util");
const rateLimit = require("express-rate-limit");
const getProducts = require("./config/productsPage.js")
const dbconfig = require("./config/db.js");
const port = process.env.PORT || 8080;
app.use(express.static(__dirname+"/main"));

getProducts(dbconfig.url);
getProducts.productDetails(dbconfig.url,dbconfig.projectQ)
getProducts.sort(dbconfig.url)
getProducts.nodata();

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

app.listen(port,function(){
	console.log("app running on port ",port)
});
