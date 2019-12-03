const express = require('express');
const app=express();
const rateLimit = require("express-rate-limit");
const getProducts = require("./config/productsPage.js")
const dbconfig = require("./config/db.js");
const port = process.env.PORT || 8080;
app.use(express.static(__dirname+"/main"));

getProducts(app,dbconfig.url);
getProducts.productDetails(app,dbconfig.url,dbconfig.projectQ)
getProducts.sort(app,dbconfig.url)
getProducts.nodata(app);

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
