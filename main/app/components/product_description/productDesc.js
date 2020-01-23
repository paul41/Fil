angular.module('prodDescApp', [])
	.controller('prodDescCtrl', ['$scope','$window','$route','getServerData',function($scope,$window,$route,getServerData){
        
        let productsObj = getServerData.getMap('product');
        let wishCount = 0;
        const productDataArr = [];
        let fbResponse = JSON.parse(localStorage.getItem('loginCred'));
        let wishListItems = getServerData.getWishItems();
        function buttonDisable(){
            document.getElementById('cartBtn').disabled = true
            document.getElementById('cartBtn').style.opacity = 0.6
            document.getElementById('cartBtn').style.cursor = 'not-allowed'
        }
        if($route.current.params.id < productsObj.length){

            $(document).ready(function(){
                wishListItems.forEach(element => {
                    if(element.productId == productsObj[$route.current.params.id].productId){
                        buttonDisable()
                    }
                })
                getServerData.FBLogin()
            })
            productDataArr.push(productsObj[$route.current.params.id])
            $scope.productDetail = productDataArr;
            $scope.amazonRedirect = () =>{
                window.open(productDataArr[0].productURL)
            } 
            if (wishListItems !== null && wishListItems.length > 0) {
                $scope.wishItems = wishListItems.length;
                $scope.wishArray = wishListItems
                document.getElementById('emptymsg').style.display = 'none';
            }else{
                $scope.wishItems = wishCount;
                document.getElementById('emptymsg').style.display = 'block';
            }
             
            $scope.addtoCart = () =>{
                document.getElementById('emptymsg').style.display = 'none';
                wishListItems.push(productsObj[$route.current.params.id])
                $scope.wishItems = wishListItems.length;
                $scope.wishArray = wishListItems;
                getServerData.setWishlistState(wishListItems)
                buttonDisable()
            }   
            $scope.removeList = (closeId) =>{
                wishListItems = wishListItems.filter((idtoRemove) =>
                    idtoRemove.productId != closeId
                );
                wishListItems.forEach(items =>{
                    if(items.productId != productsObj[$route.current.params.id].productId){
                        document.getElementById('cartBtn').disabled = false;
                        document.getElementById('cartBtn').style.opacity = 1;
                        document.getElementById('cartBtn').style.cursor = 'pointer';
                    }
                })
                if(wishListItems.length <= 0){
                    $scope.wishItems = wishListItems.length;
                    $scope.wishArray = wishListItems;
                    document.getElementById('emptymsg').style.display = 'block';
                    document.getElementById('cartBtn').disabled = false;
                    document.getElementById('cartBtn').style.opacity = 1
                    document.getElementById('cartBtn').style.cursor = 'pointer'
                }else{
                    $scope.wishItems = wishListItems.length;
                    $scope.wishArray = wishListItems;
                }
                 getServerData.setWishlistState(wishListItems)  
            }
            $scope.getWishModal = () =>{
                if(fbResponse){
                    document.getElementById('wishModal').style.display='block'
                }else{
                    alert('Login first to access your wishlist')
                }
                
            }
            /************** FB LOGIN **************/

            $scope.onFBLogin = function(){
                FB.login(function(res){
                    if(res.authResponse){
                        FB.api('/me','GET',{fields:'id,first_name,last_name'},function(response){
                            if(response){
                                getServerData.loginCredState(response)
                            }else{
                                alert('Login to get access to wishlist')
                            }
                        })
                    }else{
                        console.log('ERROR')
                    }
                },{
                    scope:'email,user_likes',
                    return_scopes:true
                })
            }


        }else{
            $window.location.href='/NotFound';
        }

    }])