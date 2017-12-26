    // create the module and name it scotchApp
    var scotchApp = angular.module('scotchApp', ['ngRoute']);

    // configure our routes
    scotchApp.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'pages/login.html',
                controller  : 'mainController'
            })

            // route for the register page
            .when('/register', {
                templateUrl : 'pages/register.html',
                controller  : 'registerController'
            })

            // route for the lenderdashpoard page
            .when('/lenderdashboard', {
                templateUrl : 'pages/lenderDashboard.html',
                controller  : 'userController'
            })

            // route for the borrower dashpoard page
            .when('/borrowerdashboard', {
                templateUrl : 'pages/borrowerDashboard.html',
                controller  : 'userController'
            });
    });

    // create the controller and inject Angular's $scope
    scotchApp.controller('mainController', function($scope, $http, $rootScope,$window) {
        // create a message to display in our view  

        
            $scope.getLoginParameters = function(){
                    $http.post('/login',$scope.user).then(function(response){
                       console.log(response.data.result+": "+"Inside getLoginParameters()");
                       //console.log(response.data.result);

                       if(response.data.result==="success")   
                        {   console.log("redirecting to profile");
                            $http.get('/profile').then(function(res)
                            {   console.log(res.data);
                                if(res.data.result==="yes"){ 
                                    console.log("redirecting ")
                                    if($scope.user.role==="Borrower")
                                        $window.location.href="#borrowerdashboard";  
                                    else
                                        $window.location.href="#lenderdashboard";     
                                }                           
                            });                           
                        }
                    })                    
             };
         
             

             $scope.message = 'Everyone come and see how good I look!';
    });

    scotchApp.controller('registerController', function($scope, $http,$window ) {
        
             $scope.saveUser = function(){
                     $scope.user._id=null;
                    

                    $http.post('/register', $scope.user).then(function(response)
                    {   
                        //console.log(response.data.result+": "+"Inside saveUser()");
                        if(response.data.result==="success")     
                        {    $window.location.href="/";                                            
                        }
                    });
                    
             };


        $scope.message = 'Look! I am an about page.';
    });

    scotchApp.controller('userController', function($scope, $http,$window ) {
        
        $scope.requestAmount= function(){
                console.log($scope.user);
                $http.post('/newCreditRequest', $scope.user).then(function(response)
                    {   console.log(response);   
                    });
        }
        
        $scope.userRequests=function()
        {       $http.get('/userRequests').then(function(response)
                    {   $scope.requests=response.data;   
                    });
        }
        
        $scope.logout=function()
        {    $http.delete('/logout').then(function(response)
                    {   if(response.data.result==="success")     
                        {    $window.location.href="/";                                            
                        }  
                    });        
        }

        $scope.borrowers=function()
        {       $http.get('/borrowers').then(function(response)
                    {   $scope.details=response.data;
                    });
        }

        $scope.allRequests=function()
        {       $http.get('/allRequests').then(function(response)
                    {   $scope.result=response.data;    
                    });
        }

        $scope.pay=function(id)
        {       $http.put('/done/'+id).then(function(response)
                    {    $scope.result=response.data;
                    });
        }

        $scope.message = 'Contact us! JK. This is just a demo.';
    });