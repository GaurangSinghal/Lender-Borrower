var express    = require('express');
var app        = express();
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var session    = require('express-session');
var routes     = require('./api/Routes/routes');
//var userModel  = require("./public/schema/users");
//var creditModel= require("./public/schema/creditRequest");

mongoose.connect('mongodb://localhost/transaction', {useMongoClient: true} , function(err)
{	if(err)
		console.log("Not Connected "+ err);		
	else
		console.log("Connected Successfully");		
});

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session(
	{	secret: 'helloworld', 
		resave: false, 
		saveUninitialized: false
	}));
app.use('/',routes);

app.listen(process.env.PORT || 3000);
console.log("server listening at 3000");