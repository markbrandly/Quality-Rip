!function(){
  function getDataFromUrl(url){
    splitUrl = url.split('?')
    if(splitUrl.length>1){
      var dataObj = {}
      var dataPh
      data = splitUrl[1]
      data = data.split('&')
      for(var i = 0; i < data.length; i++){
        var dataPh = data[i].split('=')
        dataObj[dataPh[0]] = dataPh[1]
      }
      return dataObj
    }
    return false;
  }
  var app = angular.module('yt-dl',[])

  app.controller('ctrl',function($scope,$http,$sce){

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  $scope.resetData = function(){
    $scope.vidData = null
    $scope.videoId = null
  }

    $scope.findVideo = function(){
      var urlData = getDataFromUrl($scope.search)
      if(urlData && urlData.v){
        $scope.videoId = urlData.v
        $scope.loadVideo($scope.videoId,$http)
      }
      else{
        $scope.videoId = ''
      }
    }

    $scope.loadVideo = function(id,$http){
      var req = {
        method: 'GET',
        url: 'https://zazkov-youtube-grabber-v1.p.mashape.com/download.video.php?id='+id,
        headers:{},
      }
      req.headers['X-Mashape-Key'] = 'guvF5ja5DpmshEL6WyA5hFQWU22lp16Ij2ljsnHcwxUeIKvhOs'
      $http(req)
        .success(function(data){
          $scope.vidData = data
          console.log(JSON.stringify(data,null,2))
        })
        .error(function(){

        })
    }
  })

}()