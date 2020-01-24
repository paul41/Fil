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
module.exports.login = (app,url) =>{
  app.post('/userlogin', (req,res) =>{
    mongoClient.connect(url,(err,db)=>{
      assert.equal(null,err);
      db.collection('users').createIndex({ "id": 1 }, { unique: true })
      db.collection('users').insert(req.body);
      db.close()
    })
    res.json('user added')
  })
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
module.exports.contact = (app) =>{
  app.get('/contact',(req,res)=>{ 
    res.sendFile(process.cwd()+'/main/app/components/contact_us/contact.html')
  })
}
module.exports.privacy = (app) =>{
  app.get('/privacy',(req,res)=>{ 
    res.sendFile(process.cwd()+'/main/app/components/privacy/privacy.html')
  })
}
module.exports.nodata = (app)=>{
  app.get('/NotFound',(req,res)=>{
      res.send("<!doctype html><html><body><div style='position:relative;height:100vh;background:#f6f6f6'><div style ='position: absolute;left: 50%;top: 50%;-webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform: translate(-50%,-50%);max-width: 767px;width: 100%;line-height: 1.4;padding: 110px 40px;text-align: center;background: #fff;-webkit-box-shadow: 0 15px 15px -10px rgba(0,0,0,.1);box-shadow: 0 15px 15px -10px rgba(0,0,0,.1)'><div style='position:relative;height:180px'><h1 style='font-size:165px;margin-block-start:0.1em'>4<span style='color:#00b7ff'>0</span>4</h1></div><h2 style='font-family: roboto,sans-serif;font-weight:400;text-transform: uppercase;margin-bottom: 25px;'>the page you requested could not be found</h2><a href='/' style='font-family: Montserrat, sans-serif;display: inline-block;padding: 12px 30px;font-weight: 700;background-color: #00b7ff;color: #fff;border-radius: 40px;text-decoration: none;-webkit-transition: 0.2s all;transition: 0.2s all'>GO TO HOMEPAGE </a></div></div></body></html>")
  });
}
