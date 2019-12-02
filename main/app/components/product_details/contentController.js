angular.module('contentController',[])
	
	.controller('headerCtrl',['$http','$scope','$location','getServerData',function($http,$scope,$location,getServerData){
		let btnIndex = 0;
		let productsArr = getServerData.getMap('product'); 
		$scope.ProductType = getServerData.getMap('ProductType');
		$scope.lists =  productsArr;
		$scope.productList = (i)=>{
		 	$scope.ProductName = productsArr[i].ProductName;
		 	$scope.ProductBrand = productsArr[i].product_specification[1].Brand;
		 	$scope.Description = productsArr[i].product_specification[0].Description;
		 	btnIndex = i;
		}
		$scope.redirect = ()=>{
		 	$(location).attr('href',productsArr[btnIndex].productURL)
		}
		$scope.sortItems = ['Price high to low','Rating','Recommended'];
		$scope.sortValue = (v) =>{
			$('#msgs').val(v)
			$('.dropdown-content').css("display","none");
			getServerData.sortProducts((res)=>{
				let productList = [];
				if(res.data.length > 0){
					(res.data).forEach((val,index)=>{
						productList.push(val.SearchItems.product);
					});
					$scope.lists = productList;
					console.log(productList);
				}
			},{"sortParam":[$('#msgs').val(),getServerData.getMap('ProductType')]})
		}
		
		$('input').mouseenter(()=>{
			$('.dropdown-content').css("display","block");
		})
	}])