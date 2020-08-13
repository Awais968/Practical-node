exports.list = (req, res, next) => {
    res.send('response with a source')
}

exports.login = (req, res, next) => {
    res.render('login')
}

exports.logout = (req, res, next) => {
    res.redirect('/')
}

exports.authenticate = (req, res, next) => {
    res.redirect('/admin')
  }