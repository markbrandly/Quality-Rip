var util  = require('util'),
    exec = require('child_process').exec
    // ls    = exec('ls', ['-lh', '/usr']);
var fs = require('fs')
var http = require('http')
var ytdl = 'youtube-dl'
var switches = ['https://www.youtube.com/watch?v=MZEQOoE3-u4'
                // '--dump-json'
                // ,'-f ogg '
                // , '-s'
                // ,'--all-formats'
                ,'-x'
                ,'--audio-format mp3'
                // ,'--recode-video avi'
                ,'--audio-quality 0'
              ]
var mainFormats = ['3gp','flv','m4a','mp4','webm']
var recodeFormats = ['flv','ogg','mkv','avi']
var audioFormats = ['mp3','aac','wav',]



var download = function(id,res){
  var dir = __dirname+'/tmp/downloads/'+id
  var command = 'youtube-dl https://www.youtube.com/watch?v=MZEQOoE3-u4 --restrict-filenames -o "' + dir +'/%(title)s.%(ext)s"'
  console.log(dir)
  exec(command,function(e){
    exec(command+' --get-filename',function(e,filename){
      res.download(filename.slice(0,-1)) //removes newline from end of filename
      exec('rm -rf -- '+dir)
    })
  })
}

var randomId = function(){
  var id = ''
  var hexChars = '0123456789abcdef'
  for(var i=0; i < 16; i++){
    id += hexChars.charAt(Math.floor(Math.random() * hexChars.length))
  }
  return id
}

var createId = function(callback,res){
  console.log(__dirname)
  var id = randomId()
  console.log(id)
  fs.mkdir(__dirname+'/tmp/downloads/'+id,function(e){
    console.log(e)
    if(!e) callback(id,res);
    else createId(callback,res);
  })
}

exports.download = function(res){
  createId(download,res);
}

exports.fileName = function(video){
  exec('')
}