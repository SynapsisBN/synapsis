
var User = require('../models/user');

exports.form = function(req, res){
  res.render('user/login', { title: 'Login' });
};

exports.submit = function(req, res, next){
  var data = req.body.user;
  User.authenticate(data.name, data.pass, function(err, user){
		if (err) return next(err);
    if (user) {
      req.session.uid = user.id;
			//res.locals.user = user.name;
			//console.log(res.locals.user);
      res.redirect('/');
			/*(function(req, res){
			  res.render('index', { title: 'Express', user: { name: user.name } });
			})(req, res);*/
    } else {
      res.locals.error = 'Sorry! invalid credentials.';
      exports.form(req, res);
    }
	}); 
};

exports.logout = function(req, res){
  req.session = null;
  res.redirect('/');
};