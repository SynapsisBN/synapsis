
var User = require('../models/user');

exports.list = function(req, res, next){
	//var page = req.page;
  User.getRange(0, -1, function(err, users){
		console.log(users);
    if (err) return next(err);
    res.render('directory/index', {
      title: 'Companies',
      users: users
    });
	});
};

exports.view = function(req, res, next){
	var name = req.params.name;
	res.render('directory/view', {
    title: 'Company Profile',
    name: name
  });
}
