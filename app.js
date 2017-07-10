var express = require('express');
var nunjucks = require('nunjucks');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var util = require('util');
var router = require('router');
var port = 4000;

var app = express();
app.use(express.static('public'));

function checkAuth (req, res, next) {
	console.log('checkAuth ' + req.url);

	// don't serve /secure to those not logged in
	// you should add to this list, for each and every secure url
	if ((req.url === '/secure' || req.url === '/welcome') && (!req.session || !req.session.authenticated)) {
		res.render('unauthorised.html', { status: 403 });
		return;
	}

	next();
}

nunjucks.configure('views', {
        autoescape: true,
        express: app
    });

 var urlencodedParser = bodyParser.urlencoded({ extended: false });
 	app.use(urlencodedParser)

	//app.use(express.cookieParser());
	app.use(session({ secret: 'example' }));
	//app.use(express.bodyParser());
	app.use(checkAuth);
	//app.use(router);
	app.set('view engine', 'nunjucks');
	app.set('view options', { layout: false });

require('./lib/routes.js')(app);

app.listen(port);
console.log('Node listening on port %s', port);
