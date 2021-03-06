!function(){

  // var ytApiLoaded = false
  var player

  var randomId = function(){
    var id = ''
    var hexChars = '0123456789abcdef'
    for(var i=0; i < 16; i++){
      id += hexChars.charAt(Math.floor(Math.random() * hexChars.length))
    }
    return id
  }
  
  function className(selector){
    var items = document.getElementsByClassName(selector)
    return {
      items: items,
      click: function(callback){
        for (var i = this.items.length - 1; i >= 0; i--) {
          this.items[i].onclick = callback
        };
      }
    }
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

  function setSearchHistory(array){
    localStorage.setItem('searchHistory',JSON.stringify(array))
  }

  function getSearchHistory(){
    var history = localStorage.searchHistory
    if (history)
      return JSON.parse(localStorage.searchHistory)
    return false
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
      name: "webm",
      type: "video"
    },
    {
      name:"mp3",
      type:"audio"
    },
    {
      name: "m4a",
      type: "audio"
    },
    {
      name: "wav",
      type: "audio"
    },
    {
      name: "aac",
      type: "audio"
    }]

    $scope.searchHistory = getSearchHistory() || [];

    function appendHistory(id){
      var index = $scope.searchHistory.indexOf(id)
      if(index > -1) $scope.searchHistory.splice(index,1)
      $scope.searchHistory.unshift(id)
      $scope.searchHistory = $scope.searchHistory.splice(0,5)
      setSearchHistory($scope.searchHistory)
    }

    $scope.download = function(id,type){
      var iFrame = document.createElement('iframe')
      var downloadToken = randomId();
      iFrame.setAttribute('class','hidden');
      iFrame.setAttribute('src','download?id='+id+'&token='+downloadToken+'&type='+type);
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
          if($scope.vidData && $scope.vidData.display_id === data.display_id) return
          $scope.vidData = data
          console.log(JSON.stringify(data,null,2))
          if(data['webpage_url']){
            $scope.search = data['webpage_url']
            appendHistory(data['display_id'])
            updateUrl();
            $timeout(updateVideo)
            $timeout(updateClipboard)
          }
        })
    }

    $scope.clearHistory = function(){
      $scope.searchHistory = []
      setSearchHistory([])
    }

    function updateVideo(){
      if(!$scope.vidData || !$scope.vidData.display_id) return
      var videoHolder = document.getElementsByClassName('video-wrapper')[0]
      videoHolder.removeChild(document.getElementById('ytplayer'))
      var ytPlayer = document.createElement('div')
      ytPlayer.id = 'ytplayer'
      videoHolder.appendChild(ytPlayer)
      player = new YT.Player('ytplayer',{
        videoId: $scope.vidData.display_id,
        playerVars:{
          autoplay:1,
          controls:0,
          showinfo:0,
          modestbranding:1,
          loop:1
        },
        events: {
          'onReady': function(){
            player.mute()
          }
        }
      })

      // var url = $scope.trustSrc('https://www.youtube.com/embed/'+$scope.vidData.display_id+'?autoplay=1&controls=0&showinfo=0&modestbranding=1&enablejsapi=1');
      // var player = document.createElement('iframe')
      // player.src = url
      // player.setAttribute('frameborder',0)
      // console.log(player)
      // player.mute()
      // var html = '<iframe src="'+url+'" frameborder="0" allowfullscreen></iframe>';
      // var video = document.getElementsByClassName('video-wrapper')[0]
      // if(video) video.appendChild(player)
    }

    function updateClipboard(){
      document.getElementsByClassName("copy-button")[0].setAttribute('data-clipboard-text','http://quality.rip/?v=' + $scope.vidData.display_id)
    }

    function initialVideo(){
      var urlData = getUrlData(location.href);
      if(urlData.v){
        $scope.setVideo(urlData.v)
      }
    }

    $scope.setVideo = function(id){
      if(!id) return
      $scope.search = "https://www.youtube.com/watch?v=" + id
      $scope.findVideo()
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

    className('embed').click(function(e){
      var element = e.path[0]
      element.select()
    })

    var client = new ZeroClipboard( document.getElementsByClassName("copy-button")[0] );

  })

//youtube player api https://www.youtube.com/player_api

}();

if (!window['YT']) {var YT = {loading: 0,loaded: 0,queue:0};}if (!window['YTConfig']) {var YTConfig = {'host': 'http://www.youtube.com'};}if (!YT.loading) {YT.loading = 1;(function(){var l = [];YT.ready = function(f) {if (YT.loaded) {f();} else {l.push(f);}};window.onYTReady = function() {YT.loaded = 1;for (var i = 0; i < l.length; i++) {try {l[i]();} catch (e) {}}};YT.setConfig = function(c) {for (var k in c) {if (c.hasOwnProperty(k)) {YTConfig[k] = c[k];}}};var a = document.createElement('script');a.type = 'text/javascript';a.id = 'www-widgetapi-script';a.src = 'https:' + '//s.ytimg.com/yts/jsbin/www-widgetapi-vflR1icA5/www-widgetapi.js';a.async = true;var b = document.getElementsByTagName('script')[0];b.parentNode.insertBefore(a, b);})();}