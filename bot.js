const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const config = require('./config.json');
const data = require('./data.json');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    const chat = await msg.getChat();

    if (msg.body.toLowerCase() === 'listahoy') {
        let response = 'Lista de hoy:\n';
        for (let i = 0; i < 35; i++) {
            if (data.todayList[i]) {
                response += `${i + 1} - ${data.todayList[i].number} [✅]\n`;
            } else {
                response += `${i + 1} - vacío [❌]\n`;
            }
        }
        chat.sendMessage(response);
    } else if (msg.body.toLowerCase() === 'listamñ') {
        if (data.tomorrowList.length >= 35) {
            chat.sendMessage('Se alcanzó el límite de personas para mañana.');
        } else {
            data.tomorrowList.push({ number: msg.from, timestamp: new Date().toISOString() });
            chat.sendMessage('Te has agregado a la lista para mañana.');
        }
        fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
    } else if (msg.body.toLowerCase() === 'menulista') {
        let response = `Hay ${data.todayList.length} personas en la lista de hoy:\n`;
        data.todayList.forEach((entry, index) => {
            response += `${index + 1} - ${entry.number} [✅]\n`;
        });
        response += `\nHay ${data.tomorrowList.length} personas en la lista de mañana:\n`;
        data.tomorrowList.forEach((entry, index) => {
            response += `${index + 1} - ${entry.number} [✅]\n`;
        });
        chat.sendMessage(response);
    } else if (msg.body.toLowerCase() === 'borrar lista') {
        if (msg.from === config.ownerNumber) {
            data.todayList = [];
            data.tomorrowList = [];
            fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
            chat.sendMessage('Las listas han sido borradas.');
        } else {
            chat.sendMessage('Solo mi creador puede ejecutar este comando [😡]');
        }
    } else if (msg.body.toLowerCase().startsWith('.unirmelista')) {
        const name = msg.body.split(' ')[1];
        if (name) {
            if (data.todayList.length >= 35) {
                chat.sendMessage('Se alcanzó el límite de personas para hoy. ¿Quieres apuntarte para mañana? Escribe listaMñ');
            } else {
                data.todayList.push({ number: msg.from, name, timestamp: new Date().toISOString() });
                chat.sendMessage(`Estás en la lista [✅] con el nombre ${name}.`);
                fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
            }
        } else {
            chat.sendMessage('Por favor, proporciona un nombre después de .unirmelista');
        }
    } else if (msg.body.toLowerCase() === 'menu') {
        let menu = 'Comandos disponibles:\n';
        menu += '1. listahoy - Muestra la lista de hoy\n';
        menu += '2. listamñ - Te agrega a la lista de mañana\n';
        menu += '3. menulista - Muestra el menú de listas\n';
        menu += '4. borrar lista - Borra las listas (solo creador)\n';
        menu += '5. .unirmelista [nombre] - Únete a la lista de hoy con un nombre\n';
        const media = MessageMedia.fromFilePath('./menu-image.jpg'); // Asegúrate de tener una imagen llamada 'menu-image.jpg' en el mismo directorio
        chat.sendMessage(media, { caption: menu });
    }
});

client.initialize();
