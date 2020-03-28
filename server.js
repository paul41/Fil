const express = require('express');
const app=express();
const rateLimit = require("express-rate-limit");
const getProducts = require("./config/productsPage.js")
const dbconfig = require("./config/db.js");
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const multer = require('multer');
const flipScrap = require('./main/app/server/flipkart_scrap');
var upload = multer();
app.use(express.static(__dirname+"/main"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(upload.array());
getProducts(app,dbconfig.url);
getProducts.login(app,dbconfig.url)
getProducts.productDetails(app,dbconfig.url,dbconfig.projectQ)
getProducts.sort(app,dbconfig.url);
getProducts.sortByPrice(app,dbconfig.url);
getProducts.nodata(app);
getProducts.getrange(app,dbconfig.url);
getProducts.ratingFilter(app,dbconfig.url);
getProducts.braFil(app,dbconfig.url);
getProducts.about(app);
getProducts.contactform(app,dbconfig.url)
getProducts.privacy(app);
getProducts.contact(app);
//setTimeout(function(){flipScrap.flipkart('books')},5000)

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
app.get ('/flipkartdataroute',async function(req,res){
  console.log(req.query)
  await flipScrap.flipkart(req.query.parameter).then(itemData => {
    res.json(itemData)
  }).catch(e =>{
    console.log(e);
    //throw e;
  });
})
app.get('*', function(req, res){
  res.status(404).send("<!doctype html><html><body><div style='position:relative;height:100vh;background:#f6f6f6'><div style ='position: absolute;left: 50%;top: 50%;-webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform: translate(-50%,-50%);max-width: 767px;width: 100%;line-height: 1.4;padding: 110px 40px;text-align: center;background: #fff;-webkit-box-shadow: 0 15px 15px -10px rgba(0,0,0,.1);box-shadow: 0 15px 15px -10px rgba(0,0,0,.1)'><div style='position:relative;height:180px'><h1 style='font-size:165px;margin-block-start:0.1em'>4<span style='color:#00b7ff'>0</span>4</h1></div><h2 style='font-family: roboto,sans-serif;font-weight:400;text-transform: uppercase;margin-bottom: 25px;'>the page you requested could not be found</h2><a href='/' style='font-family: Montserrat, sans-serif;display: inline-block;padding: 12px 30px;font-weight: 700;background-color: #00b7ff;color: #fff;border-radius: 40px;text-decoration: none;-webkit-transition: 0.2s all;transition: 0.2s all'>GO TO HOMEPAGE </a></div></div></body></html>");
});
app.listen(port,function(){
	console.log("Fily app running on port ",port)
});
