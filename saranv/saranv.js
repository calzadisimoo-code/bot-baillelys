const funciones = require("./funciones");

const MI_NUMERO = "573183676163"; // Tu número

module.exports = async function saranv(sock, msg, texto) {

    const usuario = msg.key.remoteJid.replace("@s.whatsapp.net", "");

    // Solo responder a tu número
    if (usuario !== MI_NUMERO) {
        return false;
    }

    // Revisar si existe una función especial
    const respuesta = await funciones(texto, sock, msg);

    if (respuesta) {

        await sock.sendMessage(msg.key.remoteJid, {
            text: respuesta
        });

        return true;
    }

    // Respuesta por defecto
    await sock.sendMessage(msg.key.remoteJid, {
        text: "Estoy aprendiendo cosas nuevas para entenderte mejor, amor. ❤️ Todavía hay muchas cosas que no sé hacer, pero cada día aprenderé más para ayudarte."
    });

    return true;
};