exports.middlewareGlobal = (req, res, next) => {
  // Captura as mensagens flash de erros e sucesso e deixa disponíveis nas views
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  // Também deixa disponível o usuário logado na sessão, se houver
  res.locals.user = req.session.user;
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  if (err) {
    return res.render('404');
  }
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  // Disponibiliza o token CSRF para as views
  res.locals.csrfToken = req.csrfToken();
  next();
};

exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash('errors', 'Você precisa fazer login.');
    return req.session.save(() => {
      const backURL = req.get('Referrer') || '/';
      res.redirect(backURL);
    });
  }

  next();
}
