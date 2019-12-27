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
    app.get('/sortbystars',(req,res)=>{
        let sortArr = [];
        let cursor;
        mongoClient.connect(url,(err,db)=>{
            assert.equal(null,err);
            let queryArray = req.query.sortParam;
            if(queryArray[0] == "Desc"){
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
                  },
                  {
                    $project: {
                      "product": "$SearchItems.product"
                    }
                  }
                ]);
            }
            else if(queryArray[0] == "Asc"){
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
                      "SearchItems.product.rating": 1
                    }
                  },
                  {
                    $project: {
                      "product": "$SearchItems.product"
                    }
                  }
                ]);
            }	
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

module.exports.sortByPrice = (app,url)=>{
  app.get('/sortbyprice',(req,res)=>{
      let sortArr = [];
      let cursor;
      mongoClient.connect(url,(err,db)=>{
          assert.equal(null,err);
          let queryArray = req.query.sortMoney;
          if(queryArray[0] == "Descending"){
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
                },
                {
                  $project: {
                    "product": "$SearchItems.product"
                  }
                }
              ]);
          }
          else if(queryArray[0] == "Ascending"){
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
                    "SearchItems.product.price": 1
                  }
                },
                {
                  $project: {
                    "product": "$SearchItems.product"
                  }
                }
              ]);
          }	
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

module.exports.getrange = (app,url) =>{
  app.get('/minmax',(req,res)=>{
    let filterArr = [];
    let cursor;
    mongoClient.connect(url,(err,db)=>{
      assert.equal(null,err);
      cursor = db.collection('BestBuy').aggregate([
        {
          $unwind: "$SearchItems"
        },
        {
          $match: {
            "SearchItems.ProductType": req.query.budgetArr[2]
          }
        },
        {
          $project: {
            product: {
              $filter: {
                input: "$SearchItems.product",
                as: "item",
                cond: { 
                  $and: [
                    {
                      $gte: [
                        "$$item.price",
                        Number(req.query.budgetArr[0])
                      ]
                    },
                    {
                      $lte: [
                        "$$item.price",
                        Number(req.query.budgetArr[1])
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      ])
      cursor.forEach((docs,err)=>{
        assert.equal(null,err);
        filterArr.push(docs);
      },()=>{
        db.close();
        res.json(filterArr)
      })
    })
  })
}
module.exports.ratingFilter = (app,url)=>{
  app.get('/ratingfilter',(req,res)=>{
    let ratingArr = [];
    let cursor;
    mongoClient.connect(url,(err,db)=>{
      assert.equal(null,err);
      cursor = db.collection('BestBuy').aggregate([
        {
          $unwind: "$SearchItems"
        },
        {
          $match: {
            "SearchItems.ProductType": req.query.rateFilterArr[1]
          }
        },
        {
          $project: {
            product: {
              $filter: {
                input: "$SearchItems.product",
                as: "item",
                cond: {
                  $gte: [
                    "$$item.rating",
                    Number(req.query.rateFilterArr[0])
                  ]
                }
              }
            }
          }
        }
      ])
      cursor.forEach((docs,err)=>{
        assert.equal(null,err);
        ratingArr.push(docs);
      },()=>{
        db.close();
        res.json(ratingArr)
      })
    })
  })
}
module.exports.braFil = (app,url) =>{
  app.get('/brandsfilter',(req,res)=>{
    let filteredArray = [];
    let cursor;
    console.log(req.query.brandsDataObj)
    mongoClient.connect(url,(err,db)=>{
      
      assert.equal(null,err);
      cursor = db.collection('BestBuy').aggregate([
        {
          $unwind: "$SearchItems"
        },
        {
          $match: {
            "SearchItems.ProductType": req.query.brandsDataObj.productType
          }
        },
        {
          $unwind: "$SearchItems.product"
        },
        {
          $match: {
            "SearchItems.product.product_specification.Brand": {
              $in: ["Amazon"]
              //req.query.brandsDataObj.brands
            }  
          }
        }
      ])
      cursor.forEach((docs,err)=>{
        assert.equal(null,err);
        filteredArray.push(docs);
      },()=>{
        db.close();
        res.json(filteredArray)
      })
    });
  })
}
module.exports.about = (app) =>{
  app.get('/about',(req,res)=>{ 
    res.sendFile(process.cwd()+'/main/app/components/about_us/about.html')
  })
}
module.exports.nodata = (app)=>{
  app.get('/No-Data',(req,res)=>{
      res.send("<!doctype html><html><body><div style='text-align:center'><h1>No Data Found. </h1></br><a href='http://localhost:5000/#!/' ><span style='color:green'>Try again</span></a></div></body></html>")
  });
}