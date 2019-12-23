var app = angular.module('contentApp', []);

app.controller('headerCtrl', function($scope) {
  var slider = document.getElementById("myRange");
  var output = document.getElementById("maxi");
  output.innerHTML = slider.value;

  slider.oninput = function() {
    output.innerHTML = this.value;
    
  }
  //Fetch value from JSON
  $scope.min = 1
  $scope.max = 200
  $scope.radioValues = {
    brandName:["Versace","Nike","Reebok","Adidas","Woodland","HRX","Zara","Bata"]
  }


  $scope.filterValues = ()=>{
    let budgetArr = [];
    let brandsArr = [];
    let ratingArr = [];
    
    budgetArr.push(Number($('#mini').text()))
    budgetArr.push(Number($('#maxi').text()))
    //console.log(budgetArr);
    var ok;
    var productType = "Amazon"
    $.each($("input[name='brands']:checked"),function(){
      brandsArr.push($(this).val());
       ok = {"brands":brandsArr,productType}
       
    });
    console.log(ok);

    $.each($("input[name='rating']:checked"),function(){
      ratingArr.push($(this).val());
    });
    //console.log(ratingArr)

    let moneySortOption = $("select.Money option:selected").val();
    //console.log(moneySortOption)

    let starSortOption = $("select.Stars option:selected").val();
    //console.log(starSortOption)
    let stars = $('.Stars').val();
			if(stars){
				alert("value")
			}else{
        alert('No value')
      }
    document.getElementById('filterModal').style.display='none';
  }
});