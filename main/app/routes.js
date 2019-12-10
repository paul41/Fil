const filiateAppRouter = angular.module('filiateRouter',["ngRoute"]);
filiateAppRouter.config(($routeProvider)=>{
	$routeProvider.when("/",{
		templateUrl:"app/components/search/searchTemplate.html"
	})
	.when("/productContent",{
		templateUrl:"app/components/product_details/resultsTemplate.html"
	})
	.otherwise({ redirectTo: '/NotFound' });

});