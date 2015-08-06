!function(){
  var app = angular.module('yt-dl',['ngAnimate'])

  app.controller('ctrl',function($scope,$http,$sce){
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    $scope.resetData = function(){
      $scope.vidData = null
    }

    $scope.findVideo = function(){
      var url = $scope.search;
      $scope.loadVideo(url)
    }

    $scope.loadVideo = function(url){
      var req = {
        method: 'GET',
        url: 'http://localhost:3000/videoJson?url=' + url,
        headers:{},
      }
      $http(req)
        .success(function(data){
          $scope.vidData = data
          console.log(JSON.stringify(data,null,2))
        })
    }
  })
}()