var util  = require('util'),
    // exec = require('child_process').exec,
    process = require('child_process'),
    exec = process.exec
    spawn = process.spawn
var fs = require('fs')
var http = require('http')
var ytdl = 'youtube-dl'
var switches = ['https://www.youtube.com/watch?v=MZEQOoE3-u4'
                ,'-x'
                ,'--audio-format mp3'
                ,'--audio-quality 0'
              ]
var mainFormats = ['3gp','flv','m4a','mp4','webm']
var recodeFormats = ['flv','ogg','mkv','avi']
var audioFormats = ['mp3','aac','wav']



var download = function(id,opts,res){
  var vidId = opts.id
  var token = opts.token
  var type = opts.type || 'mp4'
  if(!id || !vidId || !res) return
  var dir = __dirname+'/tmp/downloads/'+id
  var video = escapeVideo('https://www.youtube.com/watch?v='+vidId)
  var command = 'youtube-dl '+video+' --restrict-filenames -o "' + dir +'/%(title)s.%(ext)s"'
  var conversionTypes = ['mp3','wav','aac']
  var standardTypes = ['mp4','webm','m4a']
  if(conversionTypes.indexOf(type) < 0 && standardTypes.indexOf(type) < 0)
    type = 'mp4'
  if(conversionTypes.indexOf(type) > -1)
    command += ' -x --audio-format ' + type +' --audio-quality 0'
  else if(standardTypes.indexOf(type) > -1)
    command += ' -f ' + type
  console.log(command)
  exec(command,function(e){
    exec(command+' --get-filename',function(e,filename){
      filename = filename.split('.')
      filename.pop()
      filename = filename.join('.') + '.' + type
      res.cookie(token,'1')
      res.download(filename)
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

function escapeVideo(video){
  if(!video) return
  var alrightCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890:/.?&=#%_-'
  var regex = new RegExp('[^' + alrightCharacters +']', 'g');
  return video.replace(regex,'')
}

var createId = function(callback){
  console.log(__dirname)
  var id = randomId()
  console.log(id)
  fs.mkdir(__dirname+'/tmp/downloads/'+id,function(e){
    console.log(e)
    if(!e) callback(id);
    else createId(callback);
  })
}

exports.download = function(opts,res){

  createId(function(id){
    download(id,opts,res)
  });
}

exports.getJson = function(video,fn){
  video = escapeVideo(video)
  var child = spawn('youtube-dl',[video,'--dump-json']);
  var stdout = "", stderr = "";
  console.log(video)
  child.stdout.on("data",function(data){
    if(data!==null) stdout += data;
  });
  child.stderr.on("data",function(data){
    if(data!==null) stderr += data;
  })
  child.on('close',function(code){
    console.log(stderr)
    console.log(code)
    if(code === 0){
      var info = JSON.parse(stdout)
      if(info.extractor == 'youtube'){
        info.formats = null
        fn(info)
      }
    }
    else fn({error:1})
  })
  // child.write(video + " --dump-json")
}