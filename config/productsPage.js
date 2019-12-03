const mongoClient = require('mongodb').MongoClient;
const assert = require("assert");

module.exports = (app,url)=>{
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
        });
    });
}

module.exports.productDetails = (app,url,projectQ)=>{
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
}
module.exports.sort = (app,url)=>{
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
}
module.exports.nodata = (app)=>{
    app.get('/No-Data',(req,res)=>{
        res.send("<!doctype html><html><body><div style='text-align:center'><h1>No Data Found. </h1></br><a href='http://localhost:5000/#!/' ><span style='color:green'>Try again</span></a></div></body></html>")
    });
}