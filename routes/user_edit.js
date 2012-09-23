
exports.show = function(req, res, next){
	res.render('directory/edit', {
    title: 'Edit',
    users: users
  });
}