const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async logar() {
    this.valida();
    if (this.errors.length > 0) return;

    this.user = await LoginModel.findOne({ email: this.body.email });
    if (!this.user) {
      this.errors.push('Erro: Usuário não existe.');
      return;
    }

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Erro: Senha inválida.');
      this.user = null;
      return;
    }
  }

  async register() {
    this.valida();
    if (this.errors.length > 0) return;

    await this.userExists();
    if (this.errors.length > 0) return;

    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await LoginModel.create(this.body);
  }

  async userExists() {
    const user = await LoginModel.findOne({ email: this.body.email });
    if (user) this.errors.push('Erro: Usuário já existe.');
  }

  valida() {
    this.cleanUp();

    if (!validator.isEmail(this.body.email)) {
      this.errors.push('Erro: E-mail inválido.');
    }

    if (this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('Erro: A senha precisa ter entre 3 e 50 caracteres.');
    }
  }

  cleanUp() {
    for (const chave in this.body) {
      if (typeof this.body[chave] !== 'string') {
        this.body[chave] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    };
  }
}

module.exports = Login;
