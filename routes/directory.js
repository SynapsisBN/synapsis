
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
