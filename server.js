require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const routes = require('./routes/routes');
const path = require('path');
// const helmet = require('helmet'); // Desabilitado para localhost sem SSL
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

// Conexão com banco - sem opções que estão deprecadas
mongoose.connect(process.env.CONNECTIONSTRING)
  .then(() => {
    app.emit('pronto');
  })
  .catch(e => console.error('Erro na conexão com MongoDB:', e));

// Middleware de segurança (habilite em produção com SSL)
// app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

// Configuração da sessão
const sessionOptions = session({
  secret: process.env.CHAVESECRETA,
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
    httpOnly: true,
  },
});
app.use(sessionOptions);

// Flash messages
app.use(flash());

// View engine
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Proteção CSRF
app.use(csrf());

// Middlewares próprios
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);

// Rotas
app.use(routes);

// Inicializa o servidor quando o banco estiver conectado
app.on('pronto', () => {
  const porta = 3001;
  app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
  });
});
