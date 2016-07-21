var express = require('express');
var router = express.Router();
var passport = require('passport');

require('..//modules/passport-strategies.js')(passport);


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/api/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {

    console.log(err);
    console.log(user);
    console.log(info);

    var invalidUsernameOrPassword = 'Invalid username or password';

    if (err) { res.status(401); return res.send({ success : false, message : 'an error has occurred'  }); }
    if (!user) { res.status(401); return res.send({ success : false, message : invalidUsernameOrPassword }); }

    req.logIn(user, function(err) {
      if (err) { return next(err); }

      return return res.send({ success : true, sessionKey: 'todo'});
    });
  })(req, res, next);
});

module.exports = router;