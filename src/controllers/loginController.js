const Login = require('../models/LoginModel');

exports.index = (req, res) => {
  if(req.session.user) return res.render('login-logado')
  return res.render('login');
};

exports.register = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.register();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(() => {
        const backURL = req.get('Referrer') || '/';
        res.redirect(backURL);
      });
      return;
    }

    req.flash('success', 'Seu usuário foi criado com sucesso.');
    req.session.save(() => {
      const backURL = req.get('Referrer') || '/';
      res.redirect(backURL);
    });
  } catch (e) {
    console.error(e);
    return res.render('404');
  }
};

exports.login = async function(req, res) {
  try {
    const login = new Login(req.body);
    await login.logar();

    if (login.errors.length > 0) {
      req.flash('errors', login.errors);
      return req.session.save(() => {
        const backURL = req.get('Referrer') || '/';
        res.redirect(backURL);
      });
    }

    req.flash('success', 'Você entrou no sistema.');
    req.session.user = login.user;
    return req.session.save(() => {
      const backURL = req.get('Referrer') || '/';
      res.redirect(backURL);
    });

  } catch (e) {
    console.error('Erro no login:', e);
    return res.render('404');
  }
};

exports.logout = function(req, res){
  req.session.destroy();
  res.redirect('/');
}