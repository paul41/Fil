var hotelView = angular.module("hotelViewApp",["checklist-model","ngRoute"]);
hotelView.config(function($routeProvider){
//var index = 0;	
	$routeProvider
	.when('/',{

		templateUrl : "../../pages/hotelsList.html",
		controller:"hotelViewCtrl"
	})
	.when('/:hotelNm/:index',{
		templateUrl : '../../pages/hotelMenu.html',
		controller  : 'hotelMenu',
		
	});
	/*  .otherwise({redirectTo: '/'}); */
	/* .otherwise({
        redirectTo: '/hotelDetail'
		or
		template:"<h1>Main</h1>"
    }); */
});
hotelView.controller('hotelMenu',function($scope,$http,$routeParams){
	//$scope.message = 'Look! I am a single page.';
	var retrievedObj = localStorage.getItem("dataObj");
	var dataObj = {};
	dataObj = JSON.parse(retrievedObj);
	var a = dataObj[0].data[0].hotelLoc;
	var b = {'hotelList.hotelName':$routeParams.hotelNm,"hotelLoc":a};
	var globalVar;
	var fcartArr=[];
	
	//var c = {'hotelList.$':1,'_id':0};
	
	//> db.hotelCol.find({hotelLoc:"Kundalahalli",'hotelList.hotelName':'Dawat Restuarant'},{"hotelList.$":1,'_id':0}).pretty()
	console.log(a)
	$scope.indeX = $routeParams.index;
	
	$http.get('/marker' , {params:b}).then(function(response){
		console.log(response)
		$scope.hotelName=response.data[0].hotelList[$routeParams.index].hotelName;
		$scope.rating=response.data[0].hotelList[$routeParams.index].rating;
		$scope.foods = response.data[0].hotelList[$routeParams.index].foods;
		$scope.hotelImg = response.data[0].hotelList[$routeParams.index].hotelImg;
		$scope.foodItems = response.data[0].hotelList[$routeParams.index].foodItems;
		globalVar = response.data[0].hotelList[$routeParams.index].foodItems;
	});	
/* 	$scope.expressCartTotal = function(foodItem) {
		fArray = [];		
		var cartItems = new Object();
		cartItems.foodName = '';
		cartItems.count = 0;
		cartItems.price = 0;
		cartItems.id = 0;
		if (fcartArr.length !== 0) {
			var food = fcartArr.filter((data) => {
						return data.foodItems == foodItem.fName; 			
					   });
			var foodIndex = fcartArr.indexOf(food);
			if (foodIndex == -1) {
				cartItems.foodName = foodItem.fName;
				cartItems.count = 1;
				cartItems.id = cartItems.id + 1;
				cartItems.price = foodItem.fPrice;
				fcartArr.push(cartItems);	
			} else {
				food.count = food.count + 1;
				food.price = food.price + food.price;
				fcartArr.splice(foodIndex,0,food);		
			}	
		} else {
			cartItems.foodName = foodItem.fName;
			cartItems.count = 1;
			cartItems.price = foodItem.fPrice
			fcartArr.push(cartItems);	
		}
		console.log(fcartArr);	
	} */
	$scope.cartTotal=function(i){
		$("#totalPrice").css("display","block");
		$(".checkout").css("display","block");
		var flag = true;
		if(fcartArr.length > 0) {
			fcartArr.forEach(function(fVal){
				if(fVal.foodName == globalVar[i].fName){ 
					fVal.count = fVal.count + 1;
					fVal.price = fVal.price + globalVar[i].fPrice;
					flag = false;
				}
			})
		} 
		if(flag) {
			var fcartList = new Object();
			fcartList.foodName = globalVar[i].fName;
			fcartList.count = 1;
			fcartList.price = globalVar[i].fPrice;
			fcartArr.push(fcartList);
		}
		$scope.fcartArr = fcartArr;
		totArr=[];
		fcartArr.forEach(function(data,err){
			totArr.push(data.price)
			var sum=totArr.reduce(add,0);
			function add(a,b){
				return a+b;
			}
			console.log(sum);
			$scope.fTotal = sum
		})
		$(".showSuccess").on("click",function(){
			swal("Congrats!", ", Your food is ordered!", "success")
		})
	}
	
})
hotelView.controller('hotelViewCtrl',function($scope,$http){
	
	var retrievedObj = localStorage.getItem("dataObj");
	var dataObj = {};
	dataObj = JSON.parse(retrievedObj);
	console.log(dataObj);
	function updtStrg(arrItem){
		console.log(arrItem)
		localStorage.setItem("dataObj",JSON.stringify(arrItem));
		retrievedObj = localStorage.getItem("dataObj");
		dataObj = JSON.parse(retrievedObj);
		console.log(dataObj)
	}
	
	$(".inputText").keyup(function(){
		//$("#uList").css("display","none");
		$scope.placesVisited = dataObj[1];
		
		if($(".inputText").val().length > 1){
			
			$("#uList").css("display","block");	
			
		}else{
			$("#uList").css("display","none")
		}			
	
	});
	$scope.setText=function(Custlocation){
		
		document.getElementsByClassName("inputText")[0].value=Custlocation;
		$scope.hotelName = {hotelLoc:Custlocation}
		console.log($scope.hotelName);
		$("#uList").css("display","none");
		$http.get('/marker' ,{params:$scope.hotelName}).then(function(response){
			document.getElementById("hotelsLocation").innerHTML = response.data[0].hotelLoc;
			$scope.hotelsList = response.data[0].hotelList;
			listLength($scope.hotelsList.length);
			var setArr = [];
			setArr.push(response);
			//console.log(dataObj[1])
			setArr.push(dataObj[1]);
			console.log(setArr)
			updtStrg(setArr)
		});
	}
	document.getElementById("hotelsLocation").innerHTML = dataObj[0].data[0].hotelLoc;
	$scope.occurrenceOptions = ["100-250","251-500","501-650","651-800","801-1000"];
	$scope.selectedOccurrence = {};
	var dataListDB = dataObj[0].data[0].hotelList;
	console.log(dataListDB);
	$scope.hotelsList = dataListDB;
	listLength($scope.hotelsList.length);
	
	/*Post Values*/
	function httpPost(filterStr){
		console.log(filterStr);
		$http.post('/marker',filterStr).then(function(resp){
			console.log(resp.data)
			if(resp.status == 200){
				$scope.hotelsList = resp.data[0].hotelList;
			    listLength($scope.hotelsList.length);
				//console.log($scope.hotelsList.length);
				
			}else{
					alert("Not Responding");
			}
		})
		
	}
	function listLength(val){
		//console.log(val);
		if(val > 99){
					$scope.listSize = 99 + '+';
				}
				else{
					$scope.listSize = val;
		}
	}
	
	$scope.radioOptions=function(){
		var postArr = [];
		var strArr = $scope.selectedOccurrence.option.split("-");
		postArr.push(dataObj[0].data[0].hotelLoc,strArr);
		
		httpPost(postArr);
	}
	
	$scope.roles = ["Bengali",'Dessert','Thai','Street','Italian','Asian','Chinese','Maxican',"Pizzas",'Ice-cream','Continental','Tandoor','Sweets','Seafood'];
	
	$scope.user = {
		roles: []
	};
	
	$scope.dataSort = ["Rating","Price"];
	$scope.icon = ["fa fa-star","fa fa-inr"];
	$scope.sortData=function(ic){
		var templateDatas = [];
		console.log(dataObj[0].data[0].hotelLoc)
		var loc = {'hotelLoc':dataObj[0].data[0].hotelLoc} 
		loc.sortParam = ic;
		$http.get("/sortParam",{params:loc}).then(function(response){
			
			for(var i = 0; i < response.data.length; i++){
				templateDatas.push( response.data[i].hotelList);
				$scope.hotelsList = templateDatas;
			}
			//console.log(response)
			
			//listLength($scope.hotelsList.length);
		}) 	
	}
	/* -filter checkBox- */
	$scope.checkBoxOptions=function(){
		var reqArray = [];
		console.log($scope.user)
		reqArray.push(dataObj[0].data[0].hotelLoc,$scope.user.roles);
		console.log(reqArray);
		httpPost(reqArray);	
	}
	
	$("#loadMore").on('click', function (e) {
		e.preventDefault();
		
		$(".col-sm-6:hidden").slice(0, 2).slideDown();		
	});
	
});

hotelView.directive("hotelDirective",function(){
	return{
		scope:true,
		link:function(scope,$element,attr){
			if(scope.$last){
				$(".col-sm-6").hide();
				$(".col-sm-6").slice(0,2).show()			
			}
		}
	}
})
