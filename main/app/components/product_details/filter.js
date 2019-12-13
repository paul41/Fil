var app = angular.module('contentApp', []);

app.controller('headerCtrl', function($scope) {
  var slider = document.getElementById("myRange");
  var output = document.getElementById("maxi");
  output.innerHTML = slider.value;

  slider.oninput = function() {
    output.innerHTML = this.value;
    
  }
  $scope.min = 1
  $scope.max = 200
  $scope.filterValues = ()=>{
    console.log($('#mini').text())
    console.log($('#maxi').text())
  }
});