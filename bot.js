const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

let listaHoy = [];
let listaManana = [];
const LIMITE_PERSONAS = 35;
const CREADOR = '18098781279'; // Reemplaza con tu número de WhatsApp

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('message', async msg => {
    const chat = await msg.getChat();
    
    if (msg.body.startsWith('listahoy')) {
        let response = 'Lista de hoy:\n';
        listaHoy.forEach((item, index) => {
            response += `${index + 1} - ${item.numero} [${item.confirmado ? '✅' : '❌'}]\n`;
        });
        response += `\nHay ${listaHoy.length} personas en la lista.`;
        chat.sendMessage(response);
    } else if (msg.body.startsWith('listaMñ')) {
        let response = 'Lista de mañana:\n';
        listaManana.forEach((item, index) => {
            response += `${index + 1} - ${item.numero} [${item.confirmado ? '✅' : '❌'}]\n`;
        });
        response += `\nHay ${listaManana.length} personas en la lista.`;
        chat.sendMessage(response);
    } else if (msg.body.startsWith('.unirmelista')) {
        if (listaHoy.length >= LIMITE_PERSONAS) {
            chat.sendMessage('Se logró el límite de personas para hoy. ¿Quieres apuntarte para mañana? Escribe listaMñ.');
        } else {
            const numero = msg.from;
            if (!listaHoy.some(item => item.numero === numero)) {
                listaHoy.push({ numero, confirmado: false });
                chat.sendMessage('Estás uniéndote a la lista. Agrega un nombre, y confirma con "confirmar nombre".');
            } else {
                chat.sendMessage('Ya estás en la lista de hoy.');
            }
        }
    } else if (msg.body.startsWith('confirmar nombre')) {
        const nombre = msg.body.split(' ').slice(2).join(' ');
        const item = listaHoy.find(item => item.numero === msg.from);
        if (item) {
            item.confirmado = true;
            item.nombre = nombre;
            chat.sendMessage(`Estás en la lista como ${nombre}. [✅]`);
        } else {
            chat.sendMessage('No estás en la lista. Usa ".unirmelista" para unirte.');
        }
    } else if (msg.body.startsWith('borrar lista')) {
        if (msg.from === CREADOR) {
            listaHoy = [];
            listaManana = [];
            chat.sendMessage('Lista borrada.');
        } else {
            chat.sendMessage('Solo mi creador puede ejecutar este comando [😡].');
        }
    }
});

client.initialize();
