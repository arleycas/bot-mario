/* IMPORTE DE MODULOS */
const puppeteer = require('puppeteer');
const os = require('os');
const { exit } = require('process');
const fetch = require('node-fetch');
const HORA_INI_RANDOM = getHoraRandom(710, 724); // Default 701, 724
const USERS_JSON = {
  // @params [user, pass, celular, nombre]
  arl: ['1033780370', '1033780370', '573106542257', 'Arley'],
  cam: ['1019134827', '1019134827', '573194447056', 'Camilo'],
  die: ['1014238383', '!Qwerty28', '573003079207', 'Diego'],
  elk: ['1007514490', '1007514490', '573134814366', 'Elkin'],
  jua: ['1003479174', '1003479174', '573219906245', 'Juan'],
  jul: ['1032507144', '1032507144', '573152909024', 'Julian'],
  man: ['1018508863', '1018508863', '573137485133', 'Manuel'],
  mar: ['1014302229', '1014302229', '573006870762', 'Mario'],
  ste: ['1014296398', '1014296398', '573185303259', 'Stefanny'],
  jut: ['1033801722', '1033801722', '573195155990', 'Julieth'],
};
const DATA_LOGUEO = process.argv[2] === undefined ? 'arl' : process.argv[2]; //Si NO se manda el argumento inicia con mis datos
const USER_CRM = USERS_JSON[DATA_LOGUEO][0];
const PASS_CRM = USERS_JSON[DATA_LOGUEO][1];
const TEL_WP = USERS_JSON[DATA_LOGUEO][2];
const RUTA_CHROME_UBUNTU = '/usr/bin/google-chrome';
const RUTA_CHROME_WINDOWS = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
let isTarde = false;

/* EJECUCIÓN FUNCIÓN PRINCIPAL */
Main();

function Main() {
  hoy = new Date();
  hora = hoy.getHours();
  min = hoy.getMinutes();
  if (min.toString().length == 1) {
    min = `0${min}`;
  } //Si el minuto está entre 0 y 9 se le agrega un cero al principio
  seg = hoy.getSeconds();
  horaMinActual = parseInt(`${hora}${min}`);

  if (horaMinActual == HORA_INI_RANDOM.intVersion) {
    //1. Si la hora y min acutal coinciden con la hora random de logueo, se loguea
    console.log('>>> Logueando...');
    isTarde = false;
    runBot('login', `${hora}:${min}:${seg} a.m.`);
  } else {
    if (horaMinActual >= 1800) {
      //2. Si la hora y min actual es mayor a las 5pm se cierra turno
      console.log('>>> Cerrando turno...');
      runBot('logout', `${hora}:${min}:${seg} p.m.`);
    }

    if (horaMinActual > HORA_INI_RANDOM.intVersion && horaMinActual <= 730) {
      //3. Se logue de inmediato
      isTarde = false;
      runBot('login', `${hora}:${min}:${seg} a.m.`);
    }

    if (horaMinActual > 730 && horaMinActual < 1800) {
      //4. Si la hora y min actual es mayor a las 7:30am y menor a las 5pm, se loguea el bot de una vez
      console.log('>>> Llegando tarde prro? (︡❛ ͜ʖ❛︠). \n Relajao, ya logueando...');
      isTarde = true;
      runBot('login', `${hora}:${min}:${seg} a.m.`);
    }

    if (horaMinActual < HORA_INI_RANDOM.intVersion) {
      //5. Si nada se cumple es porque el bot queda a la espera de que sea la hora de logueo y se genera la función recursiva
      console.clear();
      console.log(`>>> 🕒 El bot iniciará sesión hasta las ${HORA_INI_RANDOM.strVersion} para ${USERS_JSON[DATA_LOGUEO][3]} <<< \n`);
      console.log(`[ Tiempo actual: ${hora}:${min}:${seg} ] Esperando...`);
      setTimeout(() => {
        Main();
      }, 2000);
    }
  }
}

function getRutaChrome() {
  if (os.platform == 'linux') {
    return RUTA_CHROME_UBUNTU;
  } else {
    return RUTA_CHROME_WINDOWS;
  }
}

function enviarMsgWP(tel, msg) {
  /* Identifica el so para poder encontrar luego la IP local (ya que el servidor que se crea es local)*/
  // ! Si se usa wifi, se caga todo, el objeto de donde se encuentra la ip cambia
  // !  reformular como se obtiene la ip
  let param,
    index = null;
  if (os.platform == 'linux') {
    param = 'eno1';
    index = 0;
  } else {
    param = 'Ethernet';
    index = 1;
  }

  const networkInterfaces = os.networkInterfaces();
  const localip = networkInterfaces[param][index].address;
  const bodyWP = { tel, msg };

  // Envia el mensaje por petición post
  fetch(`http://${localip}:3001/wp/sendMessage`, {
    method: 'post',
    body: JSON.stringify(bodyWP),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((json) => {
      console.log(json, bodyWP.msg);
    });
}

function runBot(accionBot, horaAccion) {
  (async () => {
    const browser = await puppeteer.launch({
      headless: false, //true para que el navegador no se muestre
      executablePath: getRutaChrome(), //Para que se ejecute en chrome y no en chromium (que es el de por defecto)
    });
    const page = await browser.newPage();
    await page.goto('http://appmaster.groupcos.com/appmaster/?crm=11&CIU', { waitUntil: 'load', timeout: 300000 }); //Tiempo de espera maximo de carga de la página: 5 minutos

    const crmUser = 'body > div.row > div > div > form > div:nth-child(1) > input';
    const crmPass = 'body > div.row > div > div > form > div:nth-child(2) > input';
    await page.type(crmUser, USER_CRM);
    await page.type(crmPass, PASS_CRM);
    await (await page.$(crmPass)).press('Enter'); // Enter Key

    await page.waitForSelector('.icono-modulo'); //Contenedor del icono reloj CIU, para comprobar que ya está dentro de la página

    await page.goto('http://appmaster.groupcos.com/appmaster/?crm=11&CIU');

    const NOMBRE_USER = await page.evaluate(() => document.querySelector('#user_header').innerText); //Nombre usuario CRM

    /* Comprobar si el usuario ya se logueó o no */
    // ? - Si contiene la clase 'modulo_disabled' significa que ya se deslogueó
    let isDisabledBtnCIU = await page.evaluate(() => document.querySelector('#m11 > div.icono-modulo > img').classList.contains('modulo_disabled'));

    if (isDisabledBtnCIU) {
      await enviarMsgWP(TEL_WP, `🤖🔔 Ya te habías deslogueado hoy *${NOMBRE_USER} - ${USER_CRM}*`);
    } else {
      await page.waitForSelector('.iframe_sitio');

      const srcIframe = await page.$$eval('.iframe_sitio', (el) => el.map((x) => x.getAttribute('src'))); //Retorna un Array con el valor de src del iframe

      //Puppiter prepara a la pagina para cuando aparezca un "window.alert", darle aceptar, Se pone antes de cargar la página/hacer un goto (no se x q)
      page.on('dialog', async (dialog) => {
        await dialog.accept();
      });

      /*En vez de joder con intentar manipular el iframe dentro del la página principal, más bien vamos directamente a la página del iframe*/
      await page.goto(`http://appmaster.groupcos.com/appmaster/${srcIframe[0]}`);

      /* Verifica si es iniciar turno o finalizar turno */
      if (accionBot === 'login') {
        //await page.click('button#break_ini')  //btn break

        await page.waitForTimeout(1000); //Timer
        const isDiabledBtnIni = await page.evaluate(() => document.querySelector('button#turno_ini').disabled);
        const isDiabledBtnFin = await page.evaluate(() => document.querySelector('button#turno_fin').disabled);

        if (isDiabledBtnIni == true && isDiabledBtnFin == false) {
          const HORA_LOG_CRM = await page.evaluate(() => document.querySelector('label#txt_state1').innerText); // ? - Hora de logueo que aparece en la pagina del CRM
          await enviarMsgWP(TEL_WP, `🤖🔔 Ya te habías logueado a las ${HORA_LOG_CRM} *${NOMBRE_USER} - ${USER_CRM}*`);
        } else {
          await page.click('button#turno_ini'); //btn iniciar turno

          await page.waitForTimeout(3000); //Timer
          await page.goto(`http://appmaster.groupcos.com/appmaster/${srcIframe[0]}`);
          const HORA_LOG_CRM = await page.evaluate(() => document.querySelector('label#txt_state1').innerText); // ? - Hora de logueo que aparece en la pagina del CRM

          if (isTarde) {
            await enviarMsgWP(TEL_WP, `🤖✅⚠️ Login tarde a las ${HORA_LOG_CRM} para el usuario *${NOMBRE_USER} - ${USER_CRM}*`);
            // await enviarMsgWP(TEL_WP, `🤖✅⚠️ Login tarde a las ${horaAccion} para el usuario *${NOMBRE_USER} - ${USER_CRM}*`)
          } else {
            await enviarMsgWP(TEL_WP, `🤖✅ Login a las ${HORA_LOG_CRM} para el usuario *${NOMBRE_USER} - ${USER_CRM}*`);
            // await enviarMsgWP(TEL_WP, `🤖✅ Login a las ${HORA_INI_RANDOM.strVersion} para el usuario *${NOMBRE_USER} - ${USER_CRM}*`)
          }
        }
      } else if (accionBot === 'logout') {
        await page.click('button#turno_fin'); //btn cerrar turno

        await page.waitForSelector('.swal2-shown'); //espera por swal de confirmación
        await page.click('body > div.swal2-container.swal2-center.swal2-fade.swal2-shown > div > div.swal2-actions > button.swal2-confirm.btn.btn-success'); //click swal de confirmación
        await page.waitForTimeout(2000); //Timer

        await page.goto('http://appmaster.groupcos.com/appmaster/?crm=11&CIU');

        //// No supe como hacer para convertirla en una función arriba y volverla a llamar aqui abajo, me jode lo de async await
        isDisabledBtnCIU = await page.evaluate(() => document.querySelector('#m11 > div.icono-modulo > img').classList.contains('modulo_disabled'));

        if (isDisabledBtnCIU) {
          await enviarMsgWP(TEL_WP, `🤖👋 Logout a las ${horaAccion} para el usuario *${NOMBRE_USER} - ${USER_CRM}*`);
        } else {
          await enviarMsgWP(TEL_WP, `🤖⚠️ Al parecer NO se pudo hacer Logout para el usuario *${NOMBRE_USER} - ${USER_CRM}* (revisar manualmente => http://appmaster.groupcos.com/appmaster/?crm=11&CIU)`);
        }
      } else {
        console.log('>>> ❌ No se le envió ninguna acción al robot');
      }
    }

    //await page.screenshot({ path: 'example.png' });
    await browser.close(); //Cierra navegador

    console.log('Marioneta finalizada!');

    await page.waitForTimeout(2000); //Timer

    exit();
  })();
}

function getHoraRandom(min = 701, max = 724) {
  min = Math.ceil(min);
  max = Math.floor(max);

  //Versión Integer
  intVersion = Math.floor(Math.random() * (max - min + 1)) + min;
  //Versión String
  strVersion = intVersion.toString();
  strVersion = `${strVersion[0]}:${strVersion[1]}${strVersion[2]} a.m.`;

  return { intVersion, strVersion };
}
