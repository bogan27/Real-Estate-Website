angular.module('updateZestimateApp', [])

.controller('zestimateCtrl',['$scope', '$http', function($scope, $http){

  $scope.searchError = false;
  $scope.errorMessage = "";

  $scope.showDetails = false;
  $scope.activeProperty = null;
  $scope.showZestimate = false;


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

  $scope.updateZestimate = function(){
    if(!angular.isUndefined($scope.updatedValue)){
      callUpdateValue();
    }
    if(!angular.isUndefined($scope.updatedValue)){
      callUpdateRent();
    }
    console.log("Should zestimate be shown: " + $scope.showZestimate);
  }

  var callUpdateValue = function(){
    var url = buildUpdateValueUrl();
    $http.get(url)
    .success(function(data) {
      $scope.updateError = false;
        $scope.zestimate = data;
        $scope.showZestimate = true;
        if(!$scope.zestimate){
          $scope.searchError = true;
          $scope.errorMessage = "Sorry, something went wrong when updating the property value.";
          // $scope.showZestimate = false;
        }
    })
    .error(function(){
      $scope.searchError = true;
      $scope.errorMessage = "Sorry, something went wrong when updating the property value. :(";
      // $scope.showZestimate = false;
    });
  }

  var callUpdateRent = function(){
    var url = buildUpdateRentUrl();
    $http.get(url)
    .success(function(data) {
      $scope.updateError = false;
        $scope.zestimate = data;
        $scope.showZestimate = true;
        if(!$scope.zestimate){
          $scope.searchError = true;
          $scope.errorMessage = "Sorry, something went wrong when updating the property rent.";
          // $scope.showZestimate = false;
        }
    })
    .error(function(){
      $scope.searchError = true;
      $scope.errorMessage = "Sorry, something went wrong when updating the property rent. :(";
      // $scope.showZestimate = false;
    });
  }

  var buildUpdateValueUrl = function(){
      var param1 = $scope.activeProperty.streetAddress;
      var param2 = $scope.activeProperty.zipCode;
      var param3 = $scope.updatedValue;
      var baseUrl = "/apis/zestimate/update/value?";
      var requestUrl = baseUrl.concat("address=").concat(param1)
        .concat("&zip=").concat(param2)
        .concat("&valuation=").concat(param3);
      return requestUrl;
  }

  var buildUpdateRentUrl = function(){
      var param1 = $scope.activeProperty.streetAddress;
      var param2 = $scope.activeProperty.zipCode;
      var param3 = $scope.updatedRent;
      var baseUrl = "/apis/zestimate/update/rent?";
      var requestUrl = baseUrl.concat("address=").concat(param1)
        .concat("&zip=").concat(param2)
        .concat("&rent=").concat(param3);
      return requestUrl;
  }

}])

///////////////////////////////////////
// DIRECTIVES //
///////////////////////////////////////
.directive('propertyAddress', function() {
  return{
    restrict: 'E',
    templateUrl: 'partials/property-address.html'
  }
})
.directive('navigation', function() {
  return{
    restrict: 'E',
    templateUrl: 'partials/navigationUpdateZestimate.html'
  }
})
.directive('updateZestimate', function() {
  return{
    restrict: 'E',
    templateUrl: 'partials/update-zestimate-form.html'
  }
})
.directive('zestimateInfo', function(){
  return{
    restrict: 'E',
    templateUrl: 'partials/zestimate-info.html'
  }
})
.config(function($httpProvider){
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
