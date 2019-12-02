angular.module('searchAppService',[]).service('getServerData',function ($http){
	let cacheVal,dataVal;
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
		setMap:function(itemData){
			
		 	for(const elements of itemData){
		 		cacheVal = new Map(Object.entries(elements));
		 	}
		},
		getMap:function(key){
			return cacheVal.get(key);
		}
	}
});