exports.show = (req, res, next) => {
    if (!req.params.slug) return next(new Error('No article slug.'))
    req.models.Article.findOne({slug: req.params.slug},
        (error, article) => {
            if (error) return next(error)
            if (!article.published || !req.session.admin) return res.status(401).send('Articles is Unpublished')
            res.render('article', article)
        })

}

exports.list = (req, res, next) => {
    req.models.Article.list((error, articles) => {
        if (error) return next (error)
        res.send({articles: articles})
    })
}


exports.add = (req, res, next) => {
    if (!req.body.article) return next(new Error('No article payload.'))
    let article = req.body.article
    article.published = false
    req.models.Article.create(article, 
      (error, articleResponse) => {
        if (error) return next(error)
        res.send(articleResponse)
    })
  }

  exports.edit = (req, res, next) => {
    if (!req.params.id) return next(new Error('No article ID.'))
    req.models.Article.findById(req.params.id,(error, article) => {
        if (error) return next(error)
        article.set = req.body.article
        article.save((error, saveDoc) => {
          if (error) return next(error)
          res.send(saveDoc)
        })
    })
  }

  exports.del = (req, res, next) => {
    if (!req.params.id) return next(new Error('No article ID.'))
    req.modelss.Article.findById(req.params.id, (error, article) => {
      if (error) return next(error)
      if (!article) return next(new Error('Article not found'))
      article.remove((error, doc) => {
        if (error) return next(error)
        res.send(doc)
      })
    })
  }
  exports.post = (req, res, next) => {
    if (!req.body.title) { res.render('post') }
  }


  exports.postArticle = (req, res, next) => {
    if (!req.body.title || !req.body.slug || !req.body.text) {
      return res.render('post', {error: 'Fill title, slug and text.'})
    }
    const article = {
      title: req.body.title,
      slug: req.body.slug,
      text: req.body.text,
      published: false
    }
    req.models.Article.create(article, (error, articleResponse) => {
      if (error) return next(error)
      res.render('post', 
        {error: 'Article was added. Publish it on Admin page.'})
    })
  }

  exports.admin = (req, res, next) => {
    req.models.Article.list((error, articles) => {
      if (error) return next(error)
      res.render('admin', {articles: articles})
    })
  }

