angular.module('propertySearchApp', [])

.controller('propertyCtrl',['$scope', '$http', function($scope, $http){

  $scope.searchError = false;
  $scope.errorMessage = "";

  $scope.showDetails = false;
  $scope.activeProperty = null;

  $scope.showZestimate = false;
  $scope.showRent = false;

  $scope.demographics = null;
  $scope.showDemographics = false;

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
    address = property.streetAddress.concat(", ").concat(property.city).concat(", ").concat(property.state).concat(" ").concat(property.zipCode);
    console.log("Built address: " + address);
  }
    return address;
  }

  $scope.formatUseCode = function(useCode){
    return useCode.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
  }

  var getDemographics = function(){
    if($scope.showDetails){
      var url = buildDemographicsRequest();
      $http.get(url)
      .success(function(data) {
          $scope.demographics = data;
          if($scope.demographics.length < 1){
            $scope.searchError = true;
            $scope.errorMessage = "Sorry, you're search did not return any demographics data.";
          }
      })
      .error(function(){
        $scope.searchError = true;
        $scope.errorMessage = "Sorry, it seems an error occured when processing your search for demographic info :(";
      });
    }
  }

  var buildDemographicsRequest = function(){
    var baseUrl = "/apis/demographics?zip=";
    return baseUrl.concat($scope.activeProperty.zipCode);
  }

  $scope.setActiveProperty = function(propertyIndex){
    $scope.activeProperty = $scope.properties[propertyIndex];
    $scope.showDetails = true;
    getDemographics();
  }

  $scope.resetActiveProperty = function(){
    $scope.activeProperty = false;
    $scope.showDetails = false;
    $scope.showZestimate = false;
  }

  $scope.toggleZestimate = function(){
    $scope.showZestimate = !$scope.showZestimate;
    $scope.showRent = false;
    if($scope.showZestimate && !angular.isUndefined($scope.activeProperty)){
      $scope.showRent = $scope.activeProperty.rentZestimate > 0;
    }
  }

  $scope.toggleDemographics = function(){
    $scope.showDemographics = !$scope.showDemographics;
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
.directive('propertyDetails', function() {
  return{
    restrict: 'E',
    templateUrl: 'partials/property-details.html'
  }
})
.directive('navigation', function() {
  return{
    restrict: 'E',
    templateUrl: 'partials/navigationSearch.html'
  }
})

.config(function($httpProvider){
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
