angular.module('prodDescApp', [])
	.controller('prodDescCtrl', ['$scope','$window','$route','getServerData','$http',function($scope,$window,$route,getServerData,$http){
        
        let productsObj = getServerData.getMap('product');
        let wishCount = 0;
        const productDataArr = [];
        let fbResponse = JSON.parse(localStorage.getItem('loginCred'));
        let wishListItems = getServerData.getWishItems();
        if(wishListItems == null){
            wishListItems = [];
        }
        function buttonDisable(){
            document.getElementById('cartBtn').disabled = true
            document.getElementById('cartBtn').style.opacity = 0.6
            document.getElementById('cartBtn').style.cursor = 'not-allowed'
        }
        if($route.current.params.id < productsObj.length){
            console.log(productsObj[$route.current.params.id])
            $(document).ready(function(){
                $('html, body').animate({ scrollTop: 0 })
                wishListItems.forEach(element => {
                    if(element.productId == productsObj[$route.current.params.id].productId){
                        buttonDisable()
                    }
                })
                if(fbResponse){
                    document.getElementById('displayName').style.display='inline-block'
                    $scope.fname = fbResponse.first_name
                    $scope.lname = fbResponse.last_name
                    $scope.$apply()
                }
                $('#scrollTop').click(() => {
                    $('html, body').animate({ scrollTop: 0 }, 'slow');
                });
            })
            productDataArr.push(productsObj[$route.current.params.id])
            console.log(productDataArr)
            const url = productDataArr[0].productURL
            $http({
                url:"https://web-scraper-v8.herokuapp.com/fily/item",
                method:"post",
                data:{url}
            }).then(res => detailFn(res))
            function detailFn(detailArr){
                let detailsA = detailArr.data.attributeList;
                console.log(detailsA)
                let eleminateSeemore = detailsA[2].details
                if(Object.keys(detailsA[2]) == 'details'){
                    if(eleminateSeemore[eleminateSeemore.length -1] == '› See more product details' || eleminateSeemore[eleminateSeemore.length -1] == 'Show Less'){
                        eleminateSeemore.splice(eleminateSeemore.length -1,1)
                    }
                    $scope.para = eleminateSeemore;
                }else{
                    console.log('No detail found at index 2')
                }
                if(Array.isArray(detailsA[3].moreItems)){
                    $scope.similarProducts = detailsA[3].moreItems
                }else{
                    console.log('No similar products found');
                    document.getElementById('similarProdDiv').style.display='none'
                }
                    
            }
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
                if(wishListItems == null){
                    wishListItems = [];
                }
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
            $scope.showimage = (imageToShow) =>{
                document.getElementById('imgStyle').src = imageToShow;
            }
            $scope.getWishProduct = (w) => {
                window.open(wishListItems[w].productURL)
            }
            $scope.gotoSimilar = (productLink) =>{
                window.open(productLink)
            }
            $scope.getWishModal = () =>{
                fbResponse = JSON.parse(localStorage.getItem('loginCred'))
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
                                getServerData.storeUserDatas(response)
                                $scope.fname = response.first_name
                                $scope.lname = response.last_name
                                document.getElementById('displayName').style.display='block'
                            }else{
                                alert('Login to get access to wishlist')
                            }
                        })
                    }else{
                        console.log('ERROR')
                    }
                },{
                    scope:'email',
                    return_scopes:true
                })
            }


        }else{
            $window.location.href='/NotFound';
        }

    }])