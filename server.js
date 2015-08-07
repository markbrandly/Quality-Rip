var http = require("http")
var express = require("express")
var helmet = require('helmet')
require('./gulpfile.js')
var app = express();
var youtube = require('./node/youtube.js')
var path = require('path')
var staticCache = require('express-static-cache')
 
// app.use(staticCache(path.join(__dirname, 'dist'), {
//   maxAge: 365 * 24 * 60 * 60
// }))

app.use(express.static('./dist'))
app.use(helmet())

app.get('/download',function(req,res){
  // res.setHeader('Content-disposition', 'attachment; filename="Sleepy_Tom_-_Pusher_feat._Anna_Lunoe_Branchez_Remix.webm"');
  // res.setHeader('Content-type', 'video/webm');
  youtube.download(res)
})

app.get('/videoJson',function(req,res){
  video = req.query.url
  youtube.getJson(video, function(info){
    res.json(info)
  })
})

var server = app.listen(3000, function(){
  var host = server.address().address
  var port = server.address().port
  console.log('example app listening at http://localhost:%s', port)
})