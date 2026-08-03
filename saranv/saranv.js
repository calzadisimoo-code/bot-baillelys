const funciones = require("./funciones");

const MI_NUMERO = "573183676163";

module.exports = async function saranv(sock, msg, texto) {

    try {

        const usuario = msg.key.remoteJid.replace("@s.whatsapp.net", "");

        if (usuario !== MI_NUMERO) {
            return false;
        }

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

        // Ignorar el error y dejar que el bot principal siga funcionando
        return false;

    }

};