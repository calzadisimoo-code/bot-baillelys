const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    const textoNormalizado = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (textoNormalizado !== "quiero las af1 blancas de $50") {
        return null;
    }

    registrarProducto(usuario);

    guardar(usuario, {
        producto: "af1b50",
        pedidoEnviado: false
    });

    return obtenerVariante("af1b50", usuario, {

        A: "🤍 ¡Sí tenemos disponibles las Air Force 1 blancas!\n\n💰 Precio: *$50.000*\n🚚 Envíos a toda Colombia.\n\n👟 *Responde con tu talla (21 al 44) y continuamos con tu pedido.*",

        B: "🔥 Sí, disponibles las Air Force 1 blancas por *$50.000*.\n\n👟 *¿Qué talla necesitas?*",

        C: "👟 Air Force 1 blancas $50.000\n\n✅ Tallas 21 al 44\n\n¿Qué talla buscas?",

        D: "Hola, que talla buscas?",

        E: "👋 ¡Hola! 😊\n\n¿En qué talla las necesitas?\n\n👟 Tenemos disponibles del *21 al 44*.\n💰 Precio: *$50.000*.",

        F: "Hola, Air Force 1 blancas 💰 *$50.000* 👟 Dime tu talla y te confirmo disponibilidad"

    });

};