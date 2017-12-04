import mail from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

const mailer = mail.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

const options = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '../views/mail'),
    defaultLayout: false,
    partialsDir: path.join(__dirname, '../views/mail')
  },
  viewPath: path.join(__dirname, '../views/mail'),
  extName: '.hbs'
};

mailer.use('compile', hbs(options));

mailer.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

export default mailer;