import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import redirectSSL from 'heroku-ssl-redirect';
import helpers from './controller';
import routes from './routes';
import amazon from './amazon';
import mailer from './mail';
import hbs from './handlebars';

const app = express();

// Views init
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');
// Static files path
app.use(express.static(path.join(__dirname, '../public')));
// Favicon set
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

// Asignamos el logger
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(redirectSSL());

app.use(helmet({
  frameguard: {
    action: 'sameorigin'
  },
  hsts: {
    maxAge: 10886400,
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: {
    policy: 'same-origin'
  }
}));

// Middleware para pasar datos a las views
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  }
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404);
  res.json({ message: 'Resource not found' });
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000;

app.set('port', port);

const server = app.listen(port, () => {
  console.log('XAPPIA MAGIC HAPPENS AT: ' + server.address().port);
});