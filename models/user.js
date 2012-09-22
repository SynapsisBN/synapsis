var redis = require('redis')
  , bcrypt = require('bcrypt')
  , db = redis.createClient(); // create long-running redis connection

module.exports = User;

function User(obj) {
  for (var key in obj) { // iterate keys in the object passed
    this[key] = obj[key]; // merge values
  }
}

User.prototype.save = function(fn){
  if (this.id) {
    this.update(fn);
  } else {
    var self = this;
    db.incr('user:ids', function(err, id){
      if (err) return fn(err);
      self.id = id;
			db.zadd('users', id, id);
      self.hashPassword(function(err){
				if (err) return fn(err);
					self.update(fn);
      });
}); }
};

User.prototype.update = function(fn){
  db.set('user:id:' + this.name, this.id);
  db.hmset('user:' + this.id, this, fn);
};

User.prototype.hashPassword = function(fn){
  var self = this;
  bcrypt.genSalt(12, function(err, salt){
    if (err) return fn(err);
    self.salt = salt;
    bcrypt.hash(self.pass, salt, function(err, hash){
      if (err) return fn(err);
      self.pass = hash;
      fn();
		}) 
	});
};

User.prototype.toJSON = function(){
  return {
		id: this.id,
    name: this.name
  }
};

User.getByName = function(name, fn){
  User.getId(name, function(err, id){
    if (err) return fn(err);
    User.get(id, fn);
  });
};

User.getId = function(name, fn){
  db.get('user:id:' + name, fn); //Get value from key "user:id:name"
};

User.get = function(id, fn){
  db.hgetall('user:' + id, function(err, user){
    if (err) return fn(err);
    fn(null, new User(user));
  });
};

User.count = function(fn) {
	db.zcard('user:', fn);
}

User.getRange = function(from, to, fn){
  db.zrange('users', from, to, function(err, ids){
		console.log(ids);
    if (err) return fn(err);
    var pending = ids.length
      , users = []
      , done;

    if (!pending) {
			console.log("There are no ids");
			return fn(null, []);
		}

    ids.forEach(function(id){
      User.get(id, function(err, user){
        if (done) return;
        if (err) {
          done = true;
          return fn(err);
				}
        users.push(user);
        --pending || fn(null, users);
      });
		}); 
	});
};

User.authenticate = function(name, pass, fn){
  User.getByName(name, function(err, user){
    if (err) return fn(err);
    if (!user.id) return fn();
    bcrypt.hash(pass, user.salt, function(err, hash){
      if (err) return fn(err);
      if (hash == user.pass) return fn(null, user);
      fn();
		}); 
	});
};