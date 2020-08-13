exports.list = (req, res, next) => {
    res.send('response with a source')
}

exports.login = (req, res, next) => {
    res.render('login')
}

exports.logout = (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
}

/*exports.authenticate = function (req, res, next) {
    if (!req.body.email || !req.body.password) {return res.render('login', {error: 'Please enter your email and password'})
    req.collection.users.findOne({
        email: req.body.email,
        password: req.body.password
    }, function(error, user) {
        if (error) return next(error)
        if (!user) return res.render('login', {error: 'Incorrect email&password combination.'})
        req.session.user = user
        req.session.admin = user.admin
        res.redirect('/admin')
    })
}
}*/
exports.authenticate = function (req, res, next) {
    if (!req.body.email || !req.body.password) { return res.render('login', {error: 'Please enter your email and password.'}) }
    req.collections.users.findOne({
      email: req.body.email,
      password: req.body.password
    }, function (error, user) {
      if (error) return next(error)
      if (!user) return res.render('login', {error: 'Incorrect email&password combination.'})
      req.session.user = user
      req.session.admin = user.admin
      res.redirect('/admin')
    })
  }