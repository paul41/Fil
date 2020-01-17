angular.module('prodDescApp', [])
	.controller('prodDescCtrl', ['$scope','$window','$route','getServerData',function($scope,$window,$route,getServerData){
        
        let productsObj = getServerData.getMap('product');
        const productDataArr = []
        productDataArr.push(productsObj[$route.current.params.id])
        $scope.productDetail = productDataArr;
        $scope.amazonRedirect = () =>{
            window.open(productDataArr[0].productURL)
        } 
    }])