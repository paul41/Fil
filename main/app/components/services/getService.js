angular.module('searchAppService',[]).service('getServerData',function ($http){
	let cacheVal;
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
		setMap:function(itemData){
			
		 	for(const elements of itemData){
		 		sessionStorage.setItem('cached',JSON.stringify(elements))	
			}
			
		},
		getMap:function(key){
			let cachedValue = sessionStorage.getItem('cached');
			let cacheMap = new Map(Object.entries(JSON.parse(cachedValue)));
			return cacheMap.get(key);
		}
	}
});