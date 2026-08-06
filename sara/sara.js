const funciones = require("./funciones");

const MI_LID = "73023772213414@lid";

module.exports = async function saranv(sock, msg, texto) {

    try {

        // Solo responder en tu chat
        if (msg.key.remoteJid !== MI_LID) {
            return false;
        }

        console.log("================================");
        console.log("SARA SE EJECUTÓ");
        console.log("Mensaje:", texto);
        console.log("================================");

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

        // Si Sara falla, el bot principal sigue funcionando
        return false;

    }

};