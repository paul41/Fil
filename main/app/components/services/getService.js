angular.module('searchAppService',[]).service('getServerData',function ($http,$window){
	
	return{
		
		getResponse:function(callback,parameter){
			$http.get('/marketplace',{params:parameter}).then((response)=>{
    			callback(response)
    		})
		},
		fetchProductDetails:function(callback,parameter){
			$http.get('/productsdetail',{params:parameter}).then((response)=>{
				callback(response)
			})
		},
		arrangeData:function(data){
			console.log(data)	
			if(data[0].hasOwnProperty('product') == true){
				const requiredData = [];
				let filterOffer = data[0].product;
				for(let off = 0; off<filterOffer.length; off++){
					if(filterOffer[off].offer.length > 0){
						requiredData.push(filterOffer[off])
					}
				}
				filterOffer.sort(function(a,b){
					return a.price-b.price
				})
				for(let ele of filterOffer){
					if(ele.offer.length == 0 ){
						requiredData.push(ele)
					}		
				}
				return requiredData;
			}else{
				$window.location.href = "/NotFound";
			}	
		},
		sortProducts:function(callback,parameter){
			$http.get('/sortitems',{params:parameter}).then((response)=>{
				callback(response)
			})
		},
		getRange:function(callback,parameter){
			$http.get('/minmax',{params:parameter}).then((response)=>{
				callback(response);
			})
		},
		getRating:function(callback,parameter){
			$http.get('/ratingfilter',{params:parameter}).then((response)=>{
				callback(response);
			})
		},
		getBrands:function(callback,parameter){
			$http.get('/brandsfilter',{params:parameter}).then((response)=>{
				callback(response);
			})
		},
		sortByStars:function(callback,parameter){
			$http.get('/sortbystars',{params:parameter}).then((response)=>{
				callback(response);
			})
		},
		sortByMoney:function(callback,parameter){
			$http.get('/sortbyprice',{params:parameter}).then((response)=>{
				callback(response);
			})
		},
		setWishlistState:function(wishitems){
			localStorage.setItem('cart',JSON.stringify(wishitems))
		},
		getWishItems:function(){
			let cartValues = localStorage.getItem('cart');
			return JSON.parse(cartValues);
		},
		setMap:function(itemData){	
		 	for(const elements of itemData){
		 		localStorage.setItem('cached',JSON.stringify(elements))	
			}
			
		},
		getMap:function(key){
			let cachedValue = localStorage.getItem('cached');
			let cacheMap = new Map(Object.entries(JSON.parse(cachedValue)));
			return cacheMap.get(key);
		},
		FBLogin:function(){
			// window.fbAsyncInit = function() {
			// 	FB.init({
			// 	  appId            : '805862913172894',
			// 	  autoLogAppEvents : true,
			// 	  xfbml            : true,
			// 	  version          : 'v5.0',
			// 	  status           : true
			// 	});
			// 	FB.getLoginStatus(function(res){
			// 	  if(res.status === 'connected'){
			// 		console.log('connected')
			// 	  }else if(res.status === 'not_authorized'){
			// 		console.log("Not authorized")
			// 	  }else{
			// 		console.log('Create FB account')
			// 	  }
			// 	})
			// };
		},
		loginCredState:function(credObj){
			localStorage.setItem('loginCred',JSON.stringify(credObj))
		},
		storeUserDatas:function(userParams){
			$http.post('/userlogin',userParams).then((response)=>{
				//callback(response);
				console.log(response)
			})
		}
	}
});