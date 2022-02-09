const express = require('express'); //import express from 'express'
const { spawn } = require('child_process');
const { Telegraf } = require('telegraf');

const bot = new Telegraf('5174089926:AAH1FzH8PAdkosH5i-5AIQ_tCvbcmIoEJqE');

const app = express();
app.use(express.json());

app.listen('3001', () => {
  console.log('\n>>> Conectado a puerto 3001 ʕᵔᴥᵔʔ <<<\n');
});

// Enviar mensaje WP
app.post('/tg/sendMessage', (req, res) => {
  // * aqui

  const tgid = req.body.tgid,
    msg = req.body.msg;

  bot.telegram.sendMessage(tgid, msg).catch((err) => {
    console.log('Error', err);
  });
});

bot
  .launch()
  .then(() => {
    console.log('Listo el servidor de telegram');
  })
  .catch((err) => console.log('Error', err));
