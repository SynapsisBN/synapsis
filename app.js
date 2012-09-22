/***** Module Dependencies *****/
var express = require('express')
  , http = require('http')
  , path = require('path')
	, login = require('./routes/login')
	, register = require('./routes/register')
	, directory = require('./routes/directory')
	, guest = require('./routes/guest')
	, validate = require('./lib/middleware/validate')
	, page = require('./lib/middleware/page')
	, User = require('./models/user')
	, ensure = require('./lib/middleware/ensure')
	, user = require('./lib/middleware/user');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('s8f9wueb8321nif8sdf8'));
  app.use(express.cookieSession());
	app.use(user); //Checks if user is authenticated
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/****** Controller Logic *****/

//Guest Website
app.get('/', guest.home);
app.get('/about', guest.about);
app.get('/contact', guest.contact);

//Authentication
app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);
app.get('/register', register.form);
app.post('/register', register.submit);

//Directory
app.get('/directory', directory.list);
/*app.post('/upload'
  , validate.required('photo[name]')
  , validate.lengthAbove('photo[name]', 4)
  , photos.submit(app.get('photos')));*/

//Pagination
app.get('/:page?', page(User.count), User.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
