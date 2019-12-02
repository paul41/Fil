var deliveryLoc = angular.module("deliveryLocation",['angular-loading-bar']);
deliveryLoc.config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
  });
deliveryLoc.controller("locationCtrl",function($scope,$http,$interval){
	
	var arr=[];
	$scope.findFood=function(){
		getServerData(function(response){
			console.log(response)
			if(response.data.length == 1){
				hotelDataStore(response);
			}else{
				alert("We do not deliver in your location");
			} 
		});
	}
	$scope.getLocations = function(){
		getServerData(function(response){
			if(response.data.length != 0){
				
				$(response.data).each(function(){
					if(arr.indexOf(this.hotelLoc) == -1){
						arr.push(this.hotelLoc)
					}
				});
				$scope.names=arr;
			}
			
		});
		
		$scope.setList=function(loct){
			document.getElementsByClassName("form-control")[0].value = loct;
			$scope.hotelNm.hotelLoc=loct;
			$("#autoC").css("display","none");
		}
		
	}
	$(".form-control").keyup(function(){
		$("#autoC").css("display","none");
		if($(".form-control").val().length > 0){
			
			$("#autoC").css("display","block");	
			
		}
		else{
			$("#autoC").css("display","none");
		}
	});
	
	function getServerData(callback){
		$http.get('/marker' ,{params:$scope.hotelNm} ).then(function(response){
			console.log(response)
			callback(response);
		});
	}
	function hotelDataStore(response){
		var items=[];
		items.push(response);
		items.push(arr);
		if(typeof(Storage) !== 'undefined'){
			//Store
			localStorage.setItem("dataObj",JSON.stringify(items));
		}
		else{
			alert("Update your browser to continue");
		}
		window.location.href = "../page2.html";	
	}
})
