const redis = require('redis');
var express = require("express");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();
var RedisStore = require('connect-redis')(session);
let client = redis.createClient()

app.use(cookieParser());
app.use(session({
	store: new RedisStore({ client }),
	secret: 'hello',
	resave: true,
	saveUninitialized: true
}));

app.get("/", function(req,res){
	if ( req.session && req.session.no){
		req.session.no = req.session.no + 1;
	} else {
		req.session.no = 1;
	}
	res.send("No: " + req.session.no);
});

app.listen(5000);
