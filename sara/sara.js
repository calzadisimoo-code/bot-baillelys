const funciones = require("./funciones");

const MI_LID = "73023772213414@lid";

module.exports = async function responderSara(sock, msg, texto) {

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

            // Espera aleatoria entre 2 y 7 segundos
            await new Promise(resolve =>
                setTimeout(resolve, 2000 + Math.random() * 5000)
            );

            await sock.sendMessage(msg.key.remoteJid, {
                text: respuesta
            });

            return true;
        }

        await new Promise(resolve =>
            setTimeout(resolve, 2000 + Math.random() * 5000)
        );

        await sock.sendMessage(msg.key.remoteJid, {
            text: "🥺 Aún no sé responder eso, amor. Pero cada día aprendo cosas nuevas de nuestro negocio. ❤️"
        });

        return true;

    } catch (error) {

        console.error("❌ Error interno de Sara:", error);

        return false;
    }
};