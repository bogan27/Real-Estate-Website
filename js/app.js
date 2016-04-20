angular.module('demoApp', [])

.controller('demoCtrl',['$scope', '$http', function($scope, $http){

  $scope.initialize = function(){
    $scope.userName = "";
    $scope.greeting = makeAPICall();
  }

  $scope.submit = function(){
    $scope.greeting = makeAPICall();
  }

  function makeAPICall(){
    var urlString = constructUrl();
    $http.get(urlString)
    .success(function(data) {
        $scope.greeting = data;
    });
  }

  function constructUrl(){
    var baseUrl = "/apis/greeting?name="
    var urlString =  baseUrl.concat($scope.userName);
    console.log("URL Called: " + urlString);
    return urlString;
  }
}])
.directive('navigation', function() {
  return{
    restrict: 'E',
    templateUrl: 'partials/navigationIndex.html'
  }
})
.config(function($httpProvider){
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
