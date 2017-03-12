angular.module('transactionSummarizerApp', ['filters'])

.controller('transactionSummaryCtrl',['$scope', '$http', function($scope, $http){

  $scope.searchError = false;
  $scope.errorMessage = "";

  $scope.showSummaries = false;

  $scope.getTransactionSumary = function(){
    makeAPICall();
  }

  function makeAPICall(){
    var urlString = constructUrl();
    $http.get(urlString)
    .success(function(data) {
      $scope.searchError = false;
        $scope.summaries = data;
        $scope.showSummaries = true;
        if($scope.summaries.length < 1){
          $scope.searchError = true;
          $scope.errorMessage = "Sorry, your search did not return any results.";
        }
    })
    .error(function(){
      $scope.searchError = true;
      $scope.errorMessage = "Sorry, it seems an error occured when processing your search :(";
    });
  }

  function constructUrl(){
    var baseUrl = "http://ec2-54-86-82-1.compute-1.amazonaws.com/apis/monitoring/transactions/summaries?table="
    var urlString =  baseUrl.concat($scope.tableName).concat("&days=").concat($scope.days).concat("&action=").concat($scope.transactionType);
    console.log("URL Called: " + urlString);
    return urlString;
  }
}])

.directive('navigation', function() {
  return{
    restrict: 'E',
    templateUrl: 'partials/navigationDBMonitoring.html'
  }
})
