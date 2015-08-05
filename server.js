var http = require("http")
var express = require("express")
var helmet = require('helmet')
require('./gulpfile.js')
var app = express();
var youtube = require('./node/youtube.js')


app.use(express.static('./dist'))
app.use(helmet())

app.get('/download',function(req,res){
  res.setHeader('Content-disposition', 'attachment; filename=dope.mp4');
  youtube.download(res)
})

var server = app.listen(3000, function(){
  var host = server.address().address
  var port = server.address().port
  console.log('example app listening at http://localhost:%s', port)
})