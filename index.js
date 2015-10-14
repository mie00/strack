var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

var app = express();

app.use(cookieParser('3zd1fahboojc4de579aoyaukch6ap2'))
app.use(bodyParser.urlencoded({
    extended: false
}))

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'tracking'
});

app.use(function(req,res,next){
	if (!req.cookies.id){
		var id = random_gen(20);
		res.cookie('id',id)
		req.cookies.id = id;
	}
	next();
})

connection.connect();
//CREATE TABLE IF NOT EXISTS list (id varchar(10) NOT NULL, secret varchar(20) NOT NULL, url text NOT NULL, PRIMARY KEY(id));
//CREATE TABLE IF NOT EXISTS counter ( _id int NOT NULL AUTO_INCREMENT, id varchar(10) NOT NULL ,ip varchar(31) NOT NULL,useragent varchar(255) NOT NULL, user varchar(31) NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(_id));
var chars = "abcdefghijklmnopqrstuvwxyz0123456789_"
var random_gen = function(len) {
    return Array.apply(null, {
        length: len
    }).map(function() {
        return chars[Math.floor(Math.random() * 37)]
    }).join('');
}
var normalize_url = function(url) {
    var a = ['http://', 'https://'].map(function(x) {
        return url.indexOf(x);
    })
    if (a[0] && a[1])
        url = 'http://' + url;
    return url;
}
app.get('/secret/:secret', function(req, res) {
    connection.query("SELECT c.* FROM counter c JOIN list l USING(id) WHERE secret = ?", [req.params.secret], function(err, result) {
        if (!err)
            res.json(result);
        else
            res.send('err');
    })
})
app.get('/', function(req, res) {
    res.send('<form method="post" action="/store"><input type="text" name="url" /><input type="submit" value="submit" /></form>')
});
app.post('/store', function(req, res) {
    var id = random_gen(10);
    var secret = random_gen(20);
    var criteria = {
        url: normalize_url(req.body.url),
        id: id,
        secret: secret
    }
    connection.query("INSERT INTO list(url,id,secret) VALUES (?,?,?)", [criteria.url, criteria.id, criteria.secret], function(err, result) {
        if (!err)
            res.send(([criteria.url,'/'+criteria.id,'/secret/'+criteria.secret]).map(function(x){
            	return "<a href='"+x+"'>"+x+"</a>"
            }).join('<br />'));
        else
            res.send('err');
    });
});
app.get('/:id', function(req, res) {
    connection.query("SELECT url FROM list WHERE id = ?", [req.params.id], function(err, result) {
        if (!err)
            res.redirect(result[0].url);
        else
            res.send('err');
    });
    connection.query("INSERT INTO counter(id,ip,useragent,user) VALUES (?,?,?,?)", [req.params.id, req.ip, req.headers['user-agent'], req.cookies.id], function(err, result) {
        if (err)
            console.log(err);
    });

});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
