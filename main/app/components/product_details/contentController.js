angular.module('contentApp', [])
	.controller('headerCtrl', ['$scope', '$window','getServerData', '$timeout', function ($scope,$window, getServerData, $timeout) {

		let wishCount = 0;
		let wishListItems = getServerData.getWishItems();
		if (wishListItems !== null) {
			wishCount = wishListItems.length;
		}
		$scope.wishItems = wishCount;
		let wishlistArray = getServerData.getWishItems();
		let productsArr = getServerData.getMap('product');
		
		$scope.ProductType = getServerData.getMap('ProductType');
		if (wishlistArray && wishlistArray.length) {
			$scope.wishArray = wishlistArray;
		} else {
			$scope.wishArray = [];
		}
		
		/* Page externalJS funtionality */
		$(document).ready(function () {
			$('#scrollTop').click(() => {
				$('html, body').animate({ scrollTop: 0 }, 'slow');
			});
			var slider = document.getElementById("myRange");
			var output = document.getElementById("maxi");
			output.innerHTML = slider.value;
			slider.oninput = function () {
				output.innerHTML = this.value;
			}
			if (wishlistArray === null || !wishlistArray.length) {
				document.getElementById('emptymsg').style.display = 'block';
			} else {
				document.getElementById('emptymsg').style.display = 'none';
				$scope.wishArray = wishlistArray;
			}
			
			let cartList = getServerData.getWishItems()
			if (cartList && cartList.length) {
				for (let i = 0; i < productsArr.length; i++) {
					for (let j = 0; j < cartList.length; j++) {
						if (cartList[j].productId == productsArr[i].productId) {
							setTimeout(() => {
								document.getElementsByClassName('fa fa-heart')[i].style.color = "red"
							});
						}
					}
				}
			}
		})
		/** Calculate discount  */
		function discountRateFn(arr) {
			let newProductArr = [];
			(arr).forEach((item) => {

				let discountPrice = ((item.strike) - (item.price));
				let discountRate = Number(discountPrice / item.strike)
				let rate = (discountRate * 100).toFixed(0)
				item.discountpercent = rate;
				newProductArr.push(item)
			})

			return newProductArr;
		}
		$scope.lists = discountRateFn(productsArr);

		$scope.productList = (id) => {
			$window.location.href="#!/productDetails"+'/'+id;
		}
		$scope.productUrl = (i) => {
			window.open(productsArr[i].productURL)
		}
		$scope.amazonProducts = [
			"Amazon Devices", "Amazon Fashion", "Appliances", "Apps for android", "Baby products", "Bags wallets and luggage", "Beauty", "Books", "Car & motorbike", "Clothing",
			"Computers & Accessories", "Electronics", "Furnitures", "Garden & outdoors", "Gift cards", "Health & personal care", "Home & Kitchen", "Jewellery",
			"Kindle Stores", "Luggage & Bags", "Movies & Tv shows", "Musical instruments", "Office products", "Pet supply", "Prime Video", "Shoes & handbags", "Sports & fitness",
			"Toys & games", "Video Games", "Watches"
		]
		$scope.displayList = () => {
			$('#list-product').css('display', 'block')
		}
		$scope.hideList = () => {
			$timeout(() => {
				$('#list-product').css('display', 'none')
			}, 250)
		}
		$scope.fetchproducts = (item) => {
			$('#re-search').val(item);
			getServerData.fetchProductDetails((res) => {
				if (res.data.length > 0) {

					getServerData.setMap(res.data[0].SearchItems)
					let cartItems = getServerData.getWishItems();
					let prdList = getServerData.getMap('product');
					$scope.lists = discountRateFn(prdList);
					for (let i = 0; i < prdList.length; i++) {
						for (let j = 0; j < cartItems.length; j++) {
							if (cartItems[j].productId == prdList[i].productId) {
								setTimeout(() => {
									document.getElementsByClassName('fa fa-heart')[i].style.color = "red"
								})
							}
						}
					}
					$scope.productUrl = (i) => {
						window.open(prdList[i].productURL)
					}
					$scope.productList = (id) => {
						$window.location.href="#!/productDetails"+'/'+id;
						
					}
					$("#myRange").attr(
						"max", Math.max.apply(Math, prdList.map(function (maxi) { return maxi.price })),
					);
					$("#myRange").attr(
						'min', Math.min.apply(Math, prdList.map(function (mini) { return mini.price })),
					);
				} else {
					$window.location.href = "/NotFound";
				}

				$('#re-search').val("")
			}, { "SearchItems.ProductType": item })
		}

		$scope.redHeart = (rh) => {
			
			if (document.getElementsByClassName('fa fa-heart')[rh].style.color == 'red') {
				document.getElementsByClassName('fa fa-heart')[rh].style.color = '#b5b3b3';
				$scope.wishItems = --wishCount;
				wishlistArray = wishlistArray.filter((item) => (getServerData.getMap('product')[rh].productId !== item.productId));
				if (wishlistArray.length == 0) {
					document.getElementById('emptymsg').style.display = 'block';
				} else {
					document.getElementById('emptymsg').style.display = 'none';
				}
			} else {
				document.getElementById('emptymsg').style.display = 'none';
				document.getElementsByClassName('fa fa-heart')[rh].style.color = 'red';
				$scope.wishItems = ++wishCount;
				if (wishlistArray === null) {
					wishlistArray = [];
				}
				wishlistArray.push(getServerData.getMap('product')[rh]);
			}

			$scope.wishArray = wishlistArray;
			getServerData.setWishlistState(wishlistArray)
		}
		$scope.removeList = (itemtoremove) =>{
			let productType = getServerData.getMap('product')
			wishlistArray = wishlistArray.filter((itmrmv)=> itmrmv.productId != itemtoremove);
			getServerData.setWishlistState(wishlistArray)
			if(wishlistArray.length > 0){
				$scope.wishArray = wishlistArray;
				wishCount = wishlistArray.length;
				$scope.wishItems = wishCount;
				
				for(let i = 0; i<productType.length; i++){
					if(itemtoremove == productType[i].productId){
						setTimeout(() => {
							document.getElementsByClassName('fa fa-heart')[i].style.color = "#b5b3b3"
						})
					}
				}
			}else{
				$scope.wishArray = wishlistArray;
				wishCount = wishlistArray.length;
				$scope.wishItems = wishCount;
				for(let i = 0; i<productType.length; i++){
					
					if(itemtoremove == productType[i].productId){
						setTimeout(() => {
							document.getElementsByClassName('fa fa-heart')[i].style.color = "#b5b3b3"
						})
					}
				}
				document.getElementById('emptymsg').style.display = 'block';
			}
		}
		$scope.getWishProduct = (w) => {
			$(location).attr('href', wishlistArray[w].productURL)
		}
		$scope.radioValues = {
			brandName: ["Versace", "Amazon", "Reebok", "Adidas", "Woodland", "HRX", "Zara", "Bata"]
		}
		$scope.max = Math.max.apply(Math, productsArr.map(function (maxi) { return maxi.price }));
		$scope.min = Math.min.apply(Math, productsArr.map(function (mini) { return mini.price }));
		$scope.filterValues = () => {
			let budgetArr = [];
			let rateFilterArr = [];
			let brandsArr = [];
			let brandsDataObj;
			let sortParam = [];
			let sortMoney = [];

			budgetArr.push(Number($('#mini').text()));
			budgetArr.push(Number($('#maxi').text()));
			budgetArr.push(getServerData.getMap('ProductType'));
			console.log(budgetArr)
			getServerData.getRange((res) => {
				if (res.data[0].product.length > 0) {
					console.log(res.data[0])
					$scope.lists = res.data[0].product;
				}
			}, { budgetArr })
			$.each($("input[name='rating']:checked"), function () {
				rateFilterArr.push($(this).val());
				rateFilterArr.push(getServerData.getMap('ProductType'));
				if (rateFilterArr.length > 1) {
					getServerData.getRating((res) => {
						if (res.data[0].product.length > 0) {
							$scope.lists = res.data[0].product;
						}
					}, { rateFilterArr });
				}
			});
			$.each($("input[name='brands']:checked"), function () {
				brandsArr.push($(this).val());
				let productType = getServerData.getMap('ProductType')
				brandsDataObj = { "brands": brandsArr, productType }
			});
			if (brandsArr.length > 0) {
				getServerData.getBrands((res) => {
				}, { brandsDataObj });
			}
			/** SORT */

			let stars = $('.Stars').val();

			if (stars == "Desc") {
				let array = [];
				sortParam.push("Desc")
				sortParam.push(getServerData.getMap('ProductType'));
				getServerData.sortByStars((res) => {
					$.each((res.data), function (index, val) {
						array.push(val.product)
					});

					$scope.lists = array;
				}, { sortParam })
			} else if (stars == "Asc") {
				let array = [];
				sortParam.push("Asc");
				sortParam.push(getServerData.getMap('ProductType'));
				getServerData.sortByStars((res) => {
					$.each((res.data), function (index, val) {
						array.push(val.product)
					});
					$scope.lists = array;
				}, { sortParam })
			}

			let money = $('.Money').val();

			if (money == "Descending") {
				let arrays = [];
				sortMoney.push("Descending");
				sortMoney.push(getServerData.getMap('ProductType'));
				getServerData.sortByMoney((res) => {
					$.each((res.data), function (index, val) {
						arrays.push(val.product)
					});

					$scope.lists = arrays;
				}, { sortMoney })

			} else if (money == "Ascending") {
				let arrays = [];
				sortMoney.push("Ascending");
				sortMoney.push(getServerData.getMap('ProductType'));
				getServerData.sortByMoney((res) => {
					$.each((res.data), function (index, val) {
						arrays.push(val.product)
					});
					$scope.lists = arrays;
				}, { sortMoney })
			}

			document.getElementById('filterModal').style.display = 'none';
		}

	}])