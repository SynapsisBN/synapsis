
/*
 * GET home page.
 */

exports.home = function(req, res){
  res.render('guest/index', { title: 'MySynapsis.com' });
};

exports.about = function(req, res){
  res.render('guest/about', { title: 'About' });
};

exports.contact = function(req, res){
  res.render('guest/contact', { title: 'Contact' });
};