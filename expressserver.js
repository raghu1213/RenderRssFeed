/**
 * Created by Rigz on 11/1/17.
 */
var express =require('express');
var FeedParser = require('feedparser');
var request = require('request');

var app = express();


app.get('/', function(req, res){
    res.send('Hello World')
});
app.get('/rssfeed', function(req, res){
    var req = request('http://portal.amfiindia.com/RssNAV.aspx?mf=53');
    var feedparser = new FeedParser();

    req.on('error', function(error){
        return 'Error reading response'
    });

    req.on('response', function(res) {
        var stream = this;

        if (res.statusCode != 200) {
            this.emit('error', new Error('Bad Status Code'));
        }
        else {
            stream.pipe(feedparser)
        }
    });

    feedparser.on('error', function (error) {
        res.send("Feed parser error")
    });
    var data = '';
    feedparser.on('readable', function () {
        // This is where the action is!
        var stream = this; // `this` is `feedparser`, which is a stream
       // var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
        var item;
        while(item = stream.read())
        {
           // console.log('while')
            data =  data + item.title + ':' + '\n' + item.summary + ':'  ;
        }
        //console.log(data);
        res.send( data);
        });



    });


app.listen(3000,function(){
    console.log('Listening')});