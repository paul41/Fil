angular.module('mainAppCtrl',[]).controller('mainAppController',['$scope','$http','$timeout','$window','$location','getServerData', function ($scope,$http,$timeout,$window,$location,getServerData){
	
	/* Load UI externalJSs when DOM is ready.. */

	 $(document).ready(function(){	
		let s = document.createElement('script');
		s.src = "../../../assets/js/jquery.sticky.js"
		$("head").append(s);
		let scr = document.createElement('script');
		scr.src = "../../../assets/js/jquery.waypoints.min.js"
		$("head").append(scr);	
		let x = document.createElement('script');
		x.src = "../../../assets/js/jquery.animateNumber.min.js"
		$("head").append(x);
		let sc = document.createElement('script');
		sc.src = "../../../assets/js/owl.carousel.min.js"
		$("head").append(sc);
		// let y = document.createElement('script');
		// y.src = "../../../assets/js/jquery.fancybox.min.js"
		//$("head").append(y);
		let z = document.createElement('script');
		z.src = "../../../assets/js/jquery.easing.1.3.js"
		$("head").append(z);
		let a = document.createElement('script');
		a.src = "../../../assets/js/aos.js"
		$("head").append(a);
	 	let b = document.createElement('script');
		b.src = "../../../assets/js/main.js"
		$("head").append(b);
	})
	$scope.clothing = "https://www.amazon.in/s/ref=as_li_ss_tl?url=search-alias=apparel&field-keywords=&linkCode=ll2&tag=fily0e-21&linkId=fbbbb37602a7385b19f748188a60ac46&language=en_IN"
	$scope.electronic = "https://www.amazon.in/s/ref=as_li_ss_tl?url=search-alias=electronics&field-keywords=&linkCode=ll2&tag=fily0e-21&linkId=156c8511b3a60fa0bdbc71f5fbf7f949&language=en_IN"
	$scope.discovery = [	
		{"href":"https://www.amazon.in/s/ref=as_li_ss_tl?url=search-alias=kitchen&field-keywords=&linkCode=ll2&tag=fily0e-21&linkId=c4dfbd8504458f19b6888da8ccae06ba&language=en_IN","name":"Home & Kitchen"},
		{"href":"https://www.amazon.in/s/ref=as_li_ss_tl?url=search-alias=sporting&field-keywords=&linkCode=ll2&tag=fily0e-21&linkId=7c27651b1e49b66ba9a7933aa93b1860&language=en_IN","name":"Sports"},
		{"href":"https://www.amazon.in/s/ref=as_li_ss_tl?url=search-alias=luggage&field-keywords=&linkCode=ll2&tag=fily0e-21&linkId=3803c20447a4dd517455b2a0132c937e&language=en_IN","name":"Luggage & Bags"},
		{"href":"https://www.amazon.in/s/ref=as_li_ss_tl?url=search-alias=dvd&field-keywords=&linkCode=ll2&tag=fily0e-21&linkId=faf9f7bcd3ed8e36feb7e31eac7b0587&language=en_IN","name":"Movies & TV shows"},
		{"href":"https://www.amazon.in/s/ref=as_li_ss_tl?url=search-alias=hpc&field-keywords=&linkCode=ll2&tag=fily0e-21&linkId=ea16aaaee40d8a342d0ae44794330eb3&language=en_IN","name":"Health & Personal care"},
		{"href":"https://www.amazon.in/s/ref=as_li_ss_tl?url=search-alias=jewelry&field-keywords=&linkCode=ll2&tag=fily0e-21&linkId=db75a55133cb0a422affb53905b80d30&language=en_IN","name":"Jewellery & Beauty products"}
	]
	$scope.product = [
        "Amazon Devices","Amazon Fashion","Appliances","Apps for android","Baby products","Bags wallets and luggage","Beauty","Books","Car & motorbike","Clothing",
        "Computers & Accessories","Electronics","Furnitures","Garden & outdoors","Gift cards","Health & personal care","Home & Kitchen","Jewellery",
        "Kindle Stores","Luggage & Bags","Movies & Tv shows","Musical instruments","Office products","Pet supply","Prime Video","Shoes & handbags","Sports & fitness",
        "Toys & games","Video Games","Watches"
    ]

    $scope.setValue = (product)=>{	
    	$('#input-search').val(product);
    	$('#productList').css('display','none')
    }
    $scope.showList = ()=>{
    	$('#productList').css('display','block')
    }
    $scope.hideList = ()=>{
    	$timeout(()=>{
    		$('#productList').css('display','none')
    	},250)
    }
    /**********Search module***********/
    $scope.search = ()=>{
    	let inputVal = $('#input-search').val();
    	if(inputVal){
    		getServerData.fetchProductDetails((res)=>{
    			if(res.data.length > 0){
    				$window.location.href="#!/productContent";
    				getServerData.setMap(res.data[0].SearchItems)
    				
    			}else{
    				$window.location.href = "/No-Data";
    			}
    		},{"SearchItems.ProductType":inputVal})
    		
    	}else{
    		alert('Enter products,brands and more to search')
    	}
    }

    function getDeals(){

    	getServerData.getResponse((res)=>{
    		$scope.deals = res.data[0].Deals.DealsImg;
    		$scope.link = (index)=>{
    			$(location).attr('href',res.data[0].Deals.ProductURL[index])
    		}
    	},{});
    }
    getDeals();

	function showBrands(){
		getServerData.getResponse((res)=>{
			$scope.brands = res.data[0].Brands.BrandsArr;
		},{})
	}
	showBrands()

	function showTrends(){
		getServerData.getResponse((res)=>{
			$scope.trend = res.data[0].Trend.TrendsArr;
			$scope.refLink = (i) =>{
				$(location).attr('href',res.data[0].Trend.TrendsArr[i].productUrl)
			}
		},{})
	}
	showTrends();

	$('#men').hover(()=>{
		$("#menLists").css('display',"block");
	})
	$('#menLists').mouseleave(()=>{
		$("#menLists").css('display',"none");
	})
}]);