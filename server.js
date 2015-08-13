var http = require("http")
var express = require("express")
var helmet = require('helmet')
require('./gulpfile.js')
var app = express();
var youtube = require('./node/youtube.js')
var path = require('path')
var staticCache = require('express-static-cache')
var compression = require('compression')


var cookieParser = require('cookie-parser')
// app.use(staticCache(path.join(__dirname, 'dist'), {
//   maxAge: 365 * 24 * 60 * 60
// }))

app.use(compression())
app.use(express.static('./dist'))
app.use(helmet())
app.use(cookieParser())

app.get('/download',function(req,res){
  // res.setHeader('Content-disposition', 'attachment; filename="Sleepy_Tom_-_Pusher_feat._Anna_Lunoe_Branchez_Remix.webm"');
  // res.setHeader('Content-type', 'video/webm');
  var id = req.query.id
  var token = req.query.token
  youtube.download(id,token,res)
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
  console.log('Qualit.rip listening at http://localhost:%s', port)
})