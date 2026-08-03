const funciones = require("./funciones");

module.exports = async function saranv(sock, msg, texto) {

    try {

        const respuesta = await funciones(texto, sock, msg);

        if (respuesta) {

            await sock.sendMessage(msg.key.remoteJid, {
                text: respuesta
            });

            return true;

        }

        await sock.sendMessage(msg.key.remoteJid, {
            text: "Estoy aprendiendo cosas nuevas para entenderte mejor, amor. ❤️"
        });

        return true;

    } catch (error) {

        console.error("❌ Error interno de Sara:", error);

        return false;

    }

};