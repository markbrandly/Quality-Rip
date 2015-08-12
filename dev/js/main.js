!function(){


  var randomId = function(){
    var id = ''
    var hexChars = '0123456789abcdef'
    for(var i=0; i < 16; i++){
      id += hexChars.charAt(Math.floor(Math.random() * hexChars.length))
    }
    return id
  }
  

  function removeElement(node) {
    node.parentNode.removeChild(node);
  }

  function getCookie(name) {
    var parts = document.cookie.split(name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
    return false;
  }

  function expireCookie(name) {
    document.cookie = 
      encodeURIComponent( name ) +
      "=deleted; expires=" +
      new Date( 0 ).toUTCString();
  }

  function getUrlData(url){
    if(!url) return
    var dataSegment = url.split('?')[1] || ''
    var dataSplit = dataSegment.split('&')
    var dataObj = {}
    var dataHolder
    for (var i = dataSplit.length - 1; i >= 0; i--) {
      dataHolder = dataSplit[i].split('=')
      dataObj[dataHolder[0]] = dataHolder[1]
    }
    return dataObj
  }

  function tokenListen(token,callback){
    if(getCookie(token)){
      callback()
    }
    else{
      setTimeout(function(){tokenListen(token,callback)},1000)
    }
  }

  var app = angular.module('yt-dl',['ngAnimate'])

  app.controller('ctrl',function($scope,$http,$sce,$timeout){

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src)
    }



    $scope.fileTypes = [{
      name:"mp4",
      type:"video"
    },
    {
      name:"ogg",
      type:"video"
    },
    {
      name:"mp3",
      type:"audio"
    }]

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

    function updateUrl(){
      if(!$scope.vidData) return
      var urlData = getUrlData(location.href)
      var fn
      if(urlData.v !== $scope.vidData.id)
        history.pushState({state:1},'','?v='+$scope.vidData.id)
      else history.replaceState({state:1},'','?v='+$scope.vidData.id)
      console.log('updating')
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
          if(data['webpage_url']){
            $scope.search = data['webpage_url']
            updateUrl();
            $timeout(updateVideo)
          }
        })
    }



    function updateVideo(){
      if(!$scope.vidData || !$scope.vidData.display_id) return
      var url = $scope.trustSrc('https://www.youtube.com/embed/'+$scope.vidData.display_id);
      var html = '<iframe src="'+url+'" frameborder="0" allowfullscreen></iframe>';
      var video = document.getElementsByClassName('video-wrapper')[0]
      if(video) video.innerHTML = html
    }

    function initialVideo(){
      var urlData = getUrlData(location.href);
      if(urlData.v){
        $scope.search = "https://www.youtube.com/watch?v=" +urlData.v
        $scope.findVideo()
      }
    }

    initialVideo();

    window.onpopstate = function(e){
      if(e.state.state){
        console.log('dasd')
        initialVideo();
      }
      console.log(e)
      console.log(e.state.state)
    }


  })
}();