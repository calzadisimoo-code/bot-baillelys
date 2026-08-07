const { guardar } = require("../../estado");
const { obtenerVariante } = require("../../estadisticas/ab");
const {
    registrarProducto
} = require("../../estadisticas/hoy");

module.exports = function (texto, usuario) {

    if (
        texto.includes("retro 4") ||
        texto.includes("retro4") ||
        texto.includes("r4") ||
        texto.includes("r4 blanca") ||
        texto.includes("retro blanca") ||
        texto.includes("retro dorada") ||
        texto.includes("retro 4 blanca")
    ) {

        registrarProducto(usuario);

guardar(usuario, {
    producto: "r4bd",
    nombreProducto: "Retro 4 Blanca con Dorado",
    pedidoEnviado: false
});

        return obtenerVariante("r4bd", usuario, {

A: "🤍 ¡Sí tenemos disponibles las Retro 4 blancas con dorado!\n\n💰 Precio: *$84.900*\n🚚 Envíos a toda Colombia.\n\n👟 *Responde con tu talla (21 al 44) y continuamos con tu pedido.*",

B: "🔥 Hola, tenemos disponibles las Retro 4 blancas con dorado.\n\n💰 Solo *$84.900*.\n✅ Tallas del *21 al 44*.\n\n👟 *Escríbeme únicamente tu talla y te ayudo con el pedido.*",

C: "✨ Sí hay disponibilidad.\n\n🤍 Retro 4 blanca con dorado.\n💰 *$84.900*\n🚚 Envíos a toda Colombia.\n\n👟 *¿Qué talla necesitas? (21 al 44)*",

D: "🚀 Tenemos disponibles las Retro 4 blancas con dorado.\n\n💵 Valor: *$84.900*\n\n👟 *Envíame tu talla y te envío la información para recibirlas.*",

E: "👋 ¡Hola! 😊\n\n¿En qué talla las necesitas?\n\n👟 Tenemos disponibles del *21 al 44*.\n💰 Precio: *$84.900*.",

F: "✅ Sí están disponibles.\n\n🤍 Retro 4 blanca con dorado.\n💰 *$84.900*\n\n👟 *Dime tu talla y en unos minutos dejamos listo tu pedido.*"

        });

    }

    return null;

};