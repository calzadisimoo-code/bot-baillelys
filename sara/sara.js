```js
const funciones = require("./funciones");

const MI_LID = "73023772213414@lid";

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function calcularEspera(respuesta) {

    const longitud = respuesta.length;

    let minimo;
    let maximo;

    if (longitud < 40) {
        // Respuesta corta
        minimo = 2000;
        maximo = 4000;

    } else if (longitud < 120) {
        // Respuesta normal
        minimo = 3500;
        maximo = 7000;

    } else {
        // Respuesta larga
        minimo = 6000;
        maximo = 11000;
    }

    // Variación aleatoria
    return Math.floor(
        Math.random() * (maximo - minimo + 1)
    ) + minimo;
}

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

            // Calcular espera variable
            const espera = calcularEspera(respuesta);

            console.log(
                `⏳ Sara responderá en ${(espera / 1000).toFixed(1)} segundos`
            );

            // Mostrar "escribiendo..."
            await sock.sendPresenceUpdate(
                "composing",
                msg.key.remoteJid
            );

            // Esperar
            await esperar(espera);

            // Dejar de escribir
            await sock.sendPresenceUpdate(
                "paused",
                msg.key.remoteJid
            );

            // Enviar respuesta
            await sock.sendMessage(msg.key.remoteJid, {
                text: respuesta
            });

            return true;
        }

        const respuestaDefault =
            "🥺 Aún no sé responder eso, amor. Pero cada día aprendo cosas nuevas de nuestro negocio. ❤️";

        const espera = calcularEspera(respuestaDefault);

        await sock.sendPresenceUpdate(
            "composing",
            msg.key.remoteJid
        );

        await esperar(espera);

        await sock.sendPresenceUpdate(
            "paused",
            msg.key.remoteJid
        );

        await sock.sendMessage(msg.key.remoteJid, {
            text: respuestaDefault
        });

        return true;

    } catch (error) {

        console.error("❌ Error interno de Sara:", error);

        return false;
    }
};
```
