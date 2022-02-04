const express = require('express'); //import express from 'express'
const { Client, Buttons, MessageMedia, List } = require('whatsapp-web.js');
const { spawn } = require('child_process');

const app = express();
app.use(express.json());

const clientWP = new Client({
  puppeteer: {
    headless: false,
    executablePath: '/usr/bin/google-chrome',
  },
  clientId: 'mibotcrm',
});

clientWP.initialize();

// * ===============================================
// * ====== [ EVENTOS ]
// * ===============================================

// * --- se genera código qr
clientWP.on('qr', (qr) => {
  // qrcode.generate(qr, { small: true });
});

// * --- cliente listo
clientWP.on('ready', () => {
  console.log(`${getFechaActual()} ${getHoraActual()} READY (cliente listo)`);

  app.listen('3001', () => {
    console.log('\n>>> Conectado a puerto 3001 ʕᵔᴥᵔʔ <<<\n');
  });

  // Enviar mensaje WP
  app.post('/wp/sendMessage', (req, res) => {
    console.log(req.body);
    const reqJSON = req.body;

    const chatId = `${reqJSON.tel}@c.us`;
    const msgRes = reqJSON.msg;
    clientWP.sendMessage(chatId, msgRes);

    res.json({ msg: `Meensaje enviado a ${reqJSON.tel}` });
  });

  // ! SIRVE!! mejorarlo
  // const ls = spawn('node', ['app']);

  // ls.stdout.on('data', (data) => {
  //   console.log(`stdout: ${data}`);
  // });
});

// * --- sesión exitosa en wp web
clientWP.on('authenticated', () => {
  console.log(`${getFechaActual()} ${getHoraActual()} AUTHENTICATED (sesión exitosa)`);
});

// * --- sesión no exitosa en wp web
clientWP.on('auth_failure', (msg) => {
  // Fired if session restore was unsuccessfull
  console.error(`${getFechaActual()} ${getHoraActual()} AUTHENTICATION FAILURE (sesión no exitosa)`, msg);
});

// * --- persona escribe a chat de bot
clientWP.on('message', (objMsg) => {
  // console.log(objMsg);
  procesarMsgPersona(objMsg);
});

// * ===============================================
// * ====== [ FUNCIONES ] (propias)
// * ===============================================

function getHoraActual() {
  const HOY = new Date();
  const HORA = HOY.getHours();
  let MIN = HOY.getMinutes();
  MIN = MIN.toString().length === 1 ? `0${MIN}` : MIN;

  return `${HORA}:${MIN}`;
}

function getFechaActual() {
  const HOY = new Date();
  const ARR_MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const MES = ARR_MESES[HOY.getMonth()];
  const DIA_MES = HOY.getDate();

  return `${DIA_MES}/${MES}`;
}
