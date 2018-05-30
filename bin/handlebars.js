'use strict';

import hbs from 'hbs';
import path from 'path';
import fs from 'fs';

/* Registramos los partials */

/* Registramos los helpers */
hbs.registerHelper('random', () => Math.floor(Math.random() * 99999 + 1));
hbs.registerHelper('incremented', index => ++index);

hbs.registerHelper('multiply', (index, number) => ++index * number);

hbs.registerHelper('for', (n, block) => {
  let finalblock = '';
  for (let i = 0; i < n; ++i) finalblock += block.fn(i);
  return finalblock;
});

hbs.registerHelper('upperCase', text => text.toUpperCase());

hbs.registerHelper('date-format-dmy', date => moment(date).utcOffset(0).format('DD-MM-YYYY'));

hbs.registerHelper('date-format-dmyhms', date => moment(date).utcOffset(0).format('DD-MM-YYYY [a las] h:mm:ss a'));

hbs.registerHelper('desde', inicio => {
  const now = moment();
  const inicioInscripcion = moment(inicio);
  return now.isSameOrAfter(inicioInscripcion);
});

hbs.registerHelper('hasta', fin => {
  const now = moment();
  const finInscripcion = moment(fin);
  return now.isSameOrBefore(finInscripcion);
});

hbs.registerHelper('isFinished', fecha => {
  const now = moment();
  fecha = moment(fecha);
  return now.isSameOrAfter(fecha);
});

hbs.registerHelper('displayName', (name, lastname) => {
  const nombre = name.split(' ')[0];
  const apellido = lastname.split(' ');

  return `${nombre} ${apellido[0]} ${apellido[1] ? apellido[1] : ''}`;
});

hbs.registerHelper('fill', text => text || '---');

hbs.registerHelper('cumplida', etapa => etapa === 'Cumplida');

export default hbs;

function addPartial(dir, name) {
  try {
    hbs.registerPartial(name, fs.readFileSync(path.join(__dirname, `../views/${dir}/${name}.hbs`), 'utf-8'));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}