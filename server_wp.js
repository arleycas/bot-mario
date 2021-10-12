const express = require('express');  //import express from 'express'
const app = express()
// const router = express.Router()
// const wp = require('@adiwajshing/baileys') // import { WAConnection, MessageType } from '@adiwajshing/baileys'
const fs = require('fs'); // import * as fs from 'fs'
const { WAConnection, MessageType } = require('@adiwajshing/baileys');
let conn = '';

async function connectToWhatsApp() {
	conn = new WAConnection()
	// conn = new wp.WAConnection() //requiere el new para ser llamada

	if (fs.existsSync("auth_info.json")) {
			conn.loadAuthInfo('auth_info.json') // will load JSON credentials from file

	} else {
			conn.on('open', () => {
					// save credentials whenever updated
					console.log(`credentials updated!`)
					const authInfo = conn.base64EncodedAuthInfo() // get all the auth info we need to restore this session
					fs.writeFileSync('auth_info.json', JSON.stringify(authInfo, null, '\t')) // save this info to a file
			})

	}

	// Llamada cuando WA envía chats
	// ¡esto puede tardar unos minutos si tiene miles de conversaciones!
	conn.on('chats-received', async({ hasNewChats }) => {
					console.log(`you have ${conn.chats.length} chats, new chats available: ${hasNewChats}`)

					const unread = await conn.loadAllUnreadMessages()
					console.log("you have " + unread.length + " unread messages")
			})
			// Llamada cuando WA envía chats
			// ¡esto puede tardar unos minutos si tiene miles de conversaciones!
	conn.on('contacts-received', () => {
			console.log('you have ' + Object.keys(conn.contacts).length + ' contacts')
	})

	await conn.connect()
	conn.on('chat-update', async chatUpdate => {
			// `chatUpdate` es un objeto parcial, que contiene las propiedades actualizadas del chat
			// recibió un mensaje nuevo
			if (chatUpdate.messages && chatUpdate.count) {
					const message = chatUpdate.messages.all()[0]
					
					console.log(message);
					const chatId = message.key.remoteJid //Persona que me habla
					const msgCliente = message.message.conversation

					console.log('Me habla:',chatId);
					console.log('Mensaje:',msgCliente);
					let msgRes = ''

					if(msgCliente == '1') {
							msgRes = 'Que se dice sapo perro'
					}else if(msgCliente == '2') {
							msgRes = 'Aleta de aletas'
					}else if(msgCliente == '3') {
							msgRes = 'La banda de sarabanda'
					}else if(msgCliente == '4') {
							msgRes = 'Eso si jamassss'
					}else if(msgCliente == '5') {
							msgRes = 'Señora, su hijo está... *leyendo la biblia!!!!*'
					}else if(msgCliente == '6') {
							msgRes = 'Ojo con eso manito'
					}else if(msgCliente == '7') {
							msgRes = 'Soy de la banda de los nocopeo'
					}else if(msgCliente == '8') {
							msgRes = 'Atrapaadaaaaa'
					}else if(msgCliente == '9') {
							msgRes = 'La verdad es dura, pero mas dura la verdura'
					}else if(msgCliente == '0') {
							msgRes = 'No me confundan con un asesor'
					}

					//const id = '573053599685@s.whatsapp.net'
					//const sentMsg  = await conn.sendMessage (chatId, msgRes, MessageType.text)
			} else console.log(chatUpdate) // see updates (can be archived, pinned etc.)
	})

	/* Aquí funciona también */
	// const chatId = '573134814366@s.whatsapp.net'
	// const msgRes = 'Te hablo desde la prisión de node, Elkin Manyoma... no joda'
	// const sentMsg  = await conn.sendMessage (chatId, msgRes, MessageType.text)
}

// run in main file
// connectToWhatsApp()
// 	.catch(err => console.log("unexpected error: " + err)) // catch any errors

app.use(express.json())

// const whatsapp = import('./wpbot')

// * FUNCIÓM MAIN PARA QUE ARRANQUE SERVICIO DE WP
connectToWhatsApp()
	.catch(err => console.log("unexpected error: " + err)) // catch any errors

//Iniciar BOT WP
app.post('/wp/connect', (req, res) => {
	connectToWhatsApp()
	.catch(err => console.log("unexpected error: " + err)) // catch any errors

	res.send('Bot papitas a la escucha')
})

// Enviar mensaje WP
app.post('/wp/sendMessage', (req, res) => {
	console.log(req.body)
	const reqJSON = req.body

	const chatId = `${reqJSON.tel}@s.whatsapp.net`
	const msgRes = reqJSON.msg
	const sentMsg  = conn.sendMessage (chatId, msgRes, MessageType.text)

	res.json({msg: `Meensaje enviado a ${reqJSON.tel}`})
})
// app.post('/wp/sendMsg', conn.sendMessage(chatId, msgRes, MessageType.text))

app.listen('3001', () => {
	console.log('\n>>> Conectado a puerto 3001 ʕᵔᴥᵔʔ <<<\n');
})