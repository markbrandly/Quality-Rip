!function(){

  var randomId = function(){
    var id = ''
    var hexChars = '0123456789abcdef'
    for(var i=0; i < 16; i++){
      id += hexChars.charAt(Math.floor(Math.random() * hexChars.length))
    }
    return id
  }
  var app = angular.module('yt-dl',['ngAnimate'])

  function removeElement(node) {
    node.parentNode.removeChild(node);
  }

  function getCookie(name) {
    var parts = document.cookie.split(name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
    return false;
  }

  function expireCookie( cName ) {
    document.cookie = 
      encodeURIComponent( cName ) +
      "=deleted; expires=" +
      new Date( 0 ).toUTCString();
  }


  function tokenListen(token,callback){
    // alert()
    if(getCookie(token)){
      callback()
    }
    else{
      setTimeout(function(){tokenListen(token,callback)},1000)
    }
  }

  app.controller('ctrl',function($scope,$http,$sce){
    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    $scope.download = function(id){
      var iFrame = document.createElement('iframe')
      var downloadToken = randomId();
      iFrame.setAttribute('class','hidden');
      iFrame.setAttribute('src','download?id='+id+'&token='+downloadToken);
      console.log(iFrame)
      document.body.appendChild(iFrame);
      tokenListen(downloadToken,function(){
        alert('ready to download');
        expireCookie(downloadToken)
        removeElement(iFrame)
      })
    }

    $scope.resetData = function(){
      $scope.vidData = null
    }

    $scope.findVideo = function(){
      var url = $scope.search;
      $scope.loadVideo(url)
    }

    $scope.loadVideo = function(url){
      $scope.loading = true;
      var req = {
        method: 'GET',
        url: 'http://localhost:3000/videoJson?url=' + url,
        headers:{},
      }
      $http(req)
        .success(function(data){
          $scope.loading=false;
          $scope.vidData = data
          console.log(JSON.stringify(data,null,2))
        })
    }
  })
}();