const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    if (
        texto.includes("air force") ||
        texto.includes("airforce") ||
		texto.includes("for 1") ||
		texto.includes("quiero las air force") ||
        texto.includes("force 1") ||
        texto.includes("af1")
    ) {

        // Evitar que las búsquedas de la importada entren aquí
        if (
            texto.includes(".1") ||
            texto.includes("importada") ||
            texto.includes("1.1")
        ) {
            return null;
        }

        registrarProducto(usuario);

guardar(usuario, {
    producto: "af1b",
    pedidoEnviado: false
});

        return obtenerVariante("af1b", usuario, {

            A: "🤍 ¡Sí tenemos disponibles las Air Force 1 blancas!\n\n💰 Precio: *$60.000*\n🚚 Envíos a toda Colombia.\n\n👟 *Responde con tu talla (21 al 44) y continuamos con tu pedido.*",

            B: "🔥 ¡Qué buena elección!\n\nTenemos las Air Force 1 blancas por *$60.000*.\n\n✅ Tallas disponibles del *21 al 44*.\n\n👟 *Escríbeme únicamente tu talla y te ayudo con el pedido.*",

            C: "✨ Sí hay disponibilidad.\n\n🤍 Air Force 1 blancas.\n💰 *$60.000*\n🚚 Envío rápido a toda Colombia.\n\n👟 *¿Cuál es tu talla? (21 al 44)*",

            D: "🚀 Tenemos disponibles las Air Force 1 blancas.\n\n💵 Valor: *$60.000*\n\n👟 *Envíame tu talla y te envío la información para recibirlas.*",

            E: "👋 ¡Hola! 😊\n\n¿En qué talla las necesitas?\n\n👟 Tenemos disponibles del *21 al 44*.\n💰 Precio: *$60.000*.",

            F: "✅ Sí están disponibles.\n\n🤍 Air Force 1 blancas.\n💰 *$60.000*\n\n👟 *Dime tu talla y en unos minutos dejamos listo tu pedido.*"

        });

    }

    return null;

};