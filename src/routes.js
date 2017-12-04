'use strict';

import express from 'express';
import controller from './controller';
import multer from 'multer';

const upload = multer();
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/gif/:id', (req, res, next) => {
  res.locals.gif = req.params.id;
  res.render('gif');
});

router.get('/api/sign-s3', controller.signS3);
router.post('/api/email', controller.mail);

export default router;