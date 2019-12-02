const filiateAppRouter = angular.module('filiateRouter',["ngRoute"]);
filiateAppRouter.config(($routeProvider)=>{
	$routeProvider.when("/",{
		templateUrl:"app/components/search/searchApp.html"
	})
	.when("/productContent",{
		templateUrl:"app/components/product_details/display.html"
	})
	.otherwise({ redirectTo: '/NotFound' });

});