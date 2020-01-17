const filiateAppRouter = angular.module('filiateRouter',["ngRoute"]);
filiateAppRouter.config(($routeProvider)=>{
	$routeProvider.when("/",{
		templateUrl:"app/components/search/searchTemplate.html"
	})
	.when("/productList",{
		templateUrl:"app/components/product_details/resultsTemplate.html"
	})
	.when("/productDetails/:id",{
		templateUrl:"app/components/product_description/productdescription.html"
	})
	.otherwise({ redirectTo: '/NotFound' });

});