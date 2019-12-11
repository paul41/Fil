angular.module('contentApp',[])
	
	.controller('headerCtrl',['$scope','getServerData',function($scope,getServerData){
		$('#scrollTop').click(()=>{
			$('html, body').animate({ scrollTop: 0 }, 'slow');
		});

		document.getElementById('contentDiv').onscroll = ()=>{
			if(document.getElementById('contentDiv').scrollTop > 30){
				document.getElementById('prodName').style.fontSize = "20px";
				document.getElementById('prodName').style.paddingTop = '5px'
				document.getElementById('prodBrand').style.fontSize = "16px";
				document.getElementById('tagStyle').style.marginBottom = "4px";
			}
			else{
				document.getElementById('prodName').style.fontSize = "2rem";
				document.getElementById('prodName').style.paddingTop = '5px'
				document.getElementById('prodBrand').style.fontSize = "1.5rem";
				document.getElementById('tagStyle').style.marginBottom = "1rem"
			}
		}

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
		// $scope.sortItems = ['Price high to low','Rating','Recommended'];
		// $scope.sortValue = (v) =>{
		// 	$('#msgs').val(v)
		// 	$('.dropdown-content').css("display","none");
		// 	getServerData.sortProducts((res)=>{
		// 		let productList = [];
		// 		if(res.data.length > 0){
		// 			(res.data).forEach((val)=>{
		// 				productList.push(val.SearchItems.product);
		// 			});
		// 			$scope.lists = productList;
		// 			console.log(productList);
		// 		}
		// 	},{"sortParam":[$('#msgs').val(),getServerData.getMap('ProductType')]})
		// }
		
		$('input').mouseenter(()=>{
			$('.dropdown-content').css("display","block");
		})
	}])