import mail from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';

const mailer = mail.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: 'xappiamaid@gmail.com',
    pass: 'zseqsc321'
  }
});

const options = {
  viewEngine: {
    extname: '.hbs',
    layoutsDir: path.join(__dirname, '../views/mail'),
    defaultLayout: 'template',
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