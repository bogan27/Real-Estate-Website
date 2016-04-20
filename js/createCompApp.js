angular.module('addCompApp', [])

.controller('addCompCtrl',['$scope', '$http', function($scope, $http){

  $scope.searchError = false;
  $scope.errorMessage = "";

  $scope.addCompError = false;
  $scope.compErrorMessage = "";

  $scope.showDetails = false;
  $scope.activeProperty = null;

  $scope.showZestimate = false;
  $scope.showRent = false;

  $scope.submit = function(){
    makeAPICall();
  }

  function makeAPICall(){
    var urlString = constructUrl();
    $http.get(urlString)
    .success(function(data) {
      $scope.searchError = false;
        $scope.properties = data;
        if($scope.properties.length < 1){
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
    var baseUrl = "/apis/properties?address="
    var urlString =  baseUrl.concat($scope.addressToSearch).concat("&zip=").concat($scope.zipcodeToSearch);
    console.log("URL Called: " + urlString);
    return urlString;
  }

  $scope.makeAddress = function(property){
    var address = "";
    if(!angular.isUndefined(property.streetAddress)){
    address = address.concat(" ").concat(property.city).concat(", ").concat(property.state).concat(" ").concat(property.zipCode);
    console.log("Built address: " + address);
  }
    return address;
  }

  $scope.setActiveProperty = function(propertyIndex){
    $scope.activeProperty = $scope.properties[propertyIndex];
    $scope.showDetails = true;
  }

  $scope.resetActiveProperty = function(){
    $scope.activeProperty = false;
    $scope.showDetails = false;
    $scope.showZestimate = false;
  }

  $scope.addComp = function(){
    var url = buildUrlToAddComp();
    $http.get(url)
    .success(function(data) {
      $scope.addCompError = false;
        $scope.comparables = data;
        if($scope.comparables.length < 1){
          $scope.addCompError = true;
          $scope.compErrorMessage = "Sorry, no comparables was returned. Be sure the property you are adding exists in the database.";
        }
    })
    .error(function(){
      $scope.addCompError = true;
      $scope.compErrorMessage = "Sorry, it seems an error occured when adding your comparable :(";
    });

  }

  var buildUrlToAddComp = function(){
    var param1 = $scope.activeProperty.streetAddress;
    var param2 = $scope.activeProperty.zipCode;
    var param3 = $scope.compAddress;
    var param4 = $scope.compZip;
    var param5 = $scope.compScore;
    var baseUrl = "/apis/comparables/insert?";
    var requestUrl = baseUrl.concat("address1=").concat(param1)
      .concat("&zip1=").concat(param2)
      .concat("&address2=").concat(param3)
      .concat("&zip2=").concat(param4)
      .concat("&compScore=").concat(param5);
    return requestUrl;
  }


  $scope.deleteComp = function(){
    var url = buildUrlToRemoveComp();
    $http.get(url)
    .success(function(data) {
      $scope.addCompError = false;
        $scope.comparables = data;
        if($scope.comparables.length < 1){
          $scope.addCompError = true;
          $scope.compErrorMessage = "Sorry, no comparables was returned. Be sure the comparable you are removing exists in the database.";
        }
    })
    .error(function(){
      $scope.addCompError = true;
      $scope.compErrorMessage = "Sorry, it seems an error occured when removing your comparable :(";
    });

  }

  var buildUrlToRemoveComp = function(){
    var param1 = $scope.activeProperty.streetAddress;
    var param2 = $scope.activeProperty.zipCode;
    var param3 = $scope.compAddress;
    var param4 = $scope.compZip;
    var param5 = $scope.compScore;
    var baseUrl = "/apis/comparables/delete?";
    var requestUrl = baseUrl.concat("address1=").concat(param1)
      .concat("&zip1=").concat(param2)
      .concat("&address2=").concat(param3)
      .concat("&zip2=").concat(param4)
      .concat("&compScore=").concat(param5);
    return requestUrl;
  }

}])

///////////////////////////////////////
// DIRECTIVES //
///////////////////////////////////////
.directive('navigation', function() {
  return{
    restrict: 'E',
    templateUrl: 'partials/navigationCreate.html'
  }
})
.directive('navigationDelete', function() {
  return{
    restrict: 'E',
    templateUrl: 'partials/navigationDelete.html'
  }
})
.directive('propertyAddress', function() {
  return{
    restrict: 'E',
    templateUrl: 'partials/property-address.html'
  }
})
.directive('createForm', function() {
  return{
    restrict: 'E',
    templateUrl: 'partials/create-comp-form.html'
  }
})
.directive('deleteForm', function() {
  return{
    restrict: 'E',
    templateUrl: 'partials/delete-comp-form.html'
  }
})
.directive('compInfo', function() {
  return{
    restrict: 'E',
    templateUrl: 'partials/comp-info.html'
  }
})

.config(function($httpProvider){
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
