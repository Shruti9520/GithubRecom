var myApp = angular.module('helloworld', ['satellizer','ui.router']);

/******** Routing starts here **************/

myApp.config(['$stateProvider', '$urlRouterProvider','$locationProvider',function($stateProvider, $urlRouterProvider,$locationProvider) {
  var helloState = {
    name: 'hello',
    url: '/hello',
    templateUrl: '/view/hello.html'
  }

  var aboutState = {
    name: 'about',
    url: '/about',
    template: '<h3>Its the UI-Router hello world app!</h3>'
  }
  
  var loginState = {
    name: 'login',
    url: '/login',
    templateUrl: '/view/login.html',
    controller: 'LoginCtrl'
  }

  var homeState = {
    name: 'home',
    url: '/home',
    templateUrl: '/view/home.html'
  }
  
  var mainState = {
    name: 'main',
    url: '/main',
    templateUrl: '/view/main.html'
  }
  
     
  $urlRouterProvider.otherwise('/home');

  $stateProvider.state(helloState);
  $stateProvider.state(aboutState);
  $stateProvider.state(loginState);
  $stateProvider.state(homeState);
  $stateProvider.state(mainState);
}]);

/************* Routing ends here **************/

/********** Satellizer Github Token ************/
 myApp.config(['$authProvider', function($authProvider) {

    $authProvider.github({
      clientId: "c915274b9f730289a5f0",
      redirectUri: "http://localhost:3000/",
      url: "http://localhost:3000/auth/github",
    });

    $authProvider.httpInterceptor = true;

  }]);

/********* Controller for login apage*************/
myApp.controller('LoginCtrl', ['$scope', '$auth', '$location', function($scope, $auth, $location) {
    $scope.authen = function() {
      	
      		$auth.authenticate('github')
		    	.then(function(response) {
                     console.log("Going to main page!");
		    		$location.path('/main'); 
		  		})
		  		.catch(function(response) {
		    	 alert("Authentication failed");
		  		});

		  };
  }])
  
