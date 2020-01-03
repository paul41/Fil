angular.module('contentApp',[])
	.controller('headerCtrl',['$scope','getServerData','$timeout',function($scope,getServerData,$timeout){
		
		/* Page externalJS funtionality */

		$(document).ready(function(){
			$('#scrollTop').click(()=>{
				$('html, body').animate({ scrollTop: 0 }, 'slow');
			});
			var slider = document.getElementById("myRange");
			var output = document.getElementById("maxi");
			output.innerHTML = slider.value;
			slider.oninput = function() {
				output.innerHTML = this.value;	
			}
			let exScript = document.createElement('script');
		 	exScript.src = "../../../assets/js/shrinkNavigation.js";
			$("body").append(exScript);
			 
		})
		 	
		let btnIndex = 0;
		let productsArr = getServerData.getMap('product'); 
		console.log(productsArr)
		$scope.ProductType = getServerData.getMap('ProductType');
		$scope.lists =  productsArr;
		$scope.productList = (i)=>{
		 	$scope.ProductName = productsArr[i].ProductName;
		 	$scope.ProductBrand = productsArr[i].product_specification[1].Brand;
		 	$scope.Description = productsArr[i].product_specification[0].Description;
		 	btnIndex = i;
		}

		$scope.amazonProducts = [
		    "Amazon Devices","Amazon Fashion","Appliances","Apps for android","Baby products","Bags wallets and luggage","Beauty","Books","Car & motorbike","Clothing",
		    "Computers & Accessories","Electronics","Furnitures","Garden & outdoors","Gift cards","Health & personal care","Home & Kitchen","Jewellery",
		    "Kindle Stores","Luggage & Bags","Movies & Tv shows","Musical instruments","Office products","Pet supply","Prime Video","Shoes & handbags","Sports & fitness",
		    "Toys & games","Video Games","Watches"
		] 
		$scope.displayList = () =>{
		   $('#list-product').css('display','block')
		}
		$scope.hideList = ()=>{
		  	$timeout(()=>{
		      $('#list-product').css('display','none')
		    },250)
		}
		$scope.fetchproducts = (item)=>{
			$('#re-search').val(item);
			 
			getServerData.fetchProductDetails((res)=>{	
				if(res.data.length > 0){ 
					
					getServerData.setMap(res.data[0].SearchItems)
					let productsArry = getServerData.getMap('product');	
							//console.log($scope.$$phase)
							$("#myRange").attr(
								"max" , Math.max.apply(Math,productsArry.map(function(maxi){return maxi.price})),       	
							);
							$("#myRange").attr(
								'min' , Math.min.apply(Math,productsArry.map(function(mini){return mini.price})),       	
							);
    				$scope.lists = res.data[0].SearchItems[0].product;
    			}else{
    				$window.location.href = "/No-Data";
    			}
					
					$('#re-search').val("")
			},{"SearchItems.ProductType":item})
		}
		$scope.redirect = ()=>{
		 	$(location).attr('href',productsArr[btnIndex].productURL)
		}
		$scope.redHeart = (rh)=>{
			if(document.getElementsByClassName('fa fa-heart')[rh].style.color == 'red'){
				document.getElementsByClassName('fa fa-heart')[rh].style.color = '#b5b3b3'
			}else{
				document.getElementsByClassName('fa fa-heart')[rh].style.color = 'red';
			}
			
		}
		$scope.radioValues = {
			brandName:["Versace","Amazon","Reebok","Adidas","Woodland","HRX","Zara","Bata"]
		}
		$scope.max = Math.max.apply(Math,productsArr.map(function(maxi){return maxi.price}));
		$scope.min = Math.min.apply(Math,productsArr.map(function(mini){return mini.price}));
		$scope.filterValues = ()=>{
			let budgetArr = [];
			let rateFilterArr = [];
			let brandsArr = [];
			let brandsDataObj;
			let sortParam = [];
			let sortMoney = []

			budgetArr.push(Number($('#mini').text()));
			budgetArr.push(Number($('#maxi').text()));
			budgetArr.push(getServerData.getMap('ProductType'));
			getServerData.getRange((res)=>{
				if(res.data[0].product.length > 0){
					
					$scope.lists = res.data[0].product;
				}
			},{budgetArr})
			$.each($("input[name='rating']:checked"),function(){
				rateFilterArr.push($(this).val());
				rateFilterArr.push(getServerData.getMap('ProductType'));
				if(rateFilterArr.length > 1 ){
					getServerData.getRating((res)=>{
						if(res.data[0].product.length > 0){
							$scope.lists = res.data[0].product;
						}
					},{rateFilterArr});
				}	
			});
			$.each($("input[name='brands']:checked"),function(){
				brandsArr.push($(this).val());
				let productType = getServerData.getMap('ProductType')
				brandsDataObj = {"brands":brandsArr,productType}
				console.log(brandsDataObj)
			});
			if(brandsArr.length > 0){
				getServerData.getBrands((res)=>{	
					console.log(res)
				},{brandsDataObj});
			}
				/** SORT */

			let stars = $('.Stars').val();
			
			if(stars == "Desc"){
				let array = [];
				sortParam.push("Desc")
				sortParam.push(getServerData.getMap('ProductType'));
				getServerData.sortByStars((res)=>{
					$.each((res.data),function(index,val){
						array.push(val.product)
					});
					
					$scope.lists = array;
				},{sortParam})
			}else if(stars == "Asc"){
				let array = [];
				sortParam.push("Asc");
				sortParam.push(getServerData.getMap('ProductType'));
				getServerData.sortByStars((res)=>{
					$.each((res.data),function(index,val){
						array.push(val.product)
					});
					$scope.lists = array;
				},{sortParam})
			}

			let money = $('.Money').val();

			if(money == "Descending"){
				let arrays = [];
				sortMoney.push("Descending");
				sortMoney.push(getServerData.getMap('ProductType'));
				getServerData.sortByMoney((res)=>{
					$.each((res.data),function(index,val){
						arrays.push(val.product)
					});
					
					$scope.lists = arrays;
				},{sortMoney})

			}else if(money == "Ascending"){
				let arrays = [];
				sortMoney.push("Ascending");
				sortMoney.push(getServerData.getMap('ProductType'));
				getServerData.sortByMoney((res)=>{
					$.each((res.data),function(index,val){
						arrays.push(val.product)
					});
					$scope.lists = arrays;
				},{sortMoney})
			}

			document.getElementById('filterModal').style.display='none';
		}
		
	}])