const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    // Si el cliente habla de las importadas, este flow no responde
    if (
        texto.includes(".1") ||
        texto.includes("1.1") ||
        texto.includes("import") ||
        texto.includes("importada") ||
        texto.includes("importadas")
    ) {
        return null;
    }

if (
    texto.includes("air forces negras") ||
    texto.includes("air force negras") ||
    texto.includes("air force negra") ||
    texto.includes("quiero las air force negras") ||
    texto.includes("Air force negras")
) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "af1n",
            pedidoEnviado: false
        });

        return obtenerVariante("af1n", usuario, {

            A: "Hola que talla buscas?",

            B: "🔥 Hola tenemos las Air Force 1 negras por *$60.000*.\n\n✅ Tallas disponibles del *21 al 44*.\n\n👟 *Escríbeme únicamente tu talla y te ayudo con el pedido.*",

            C: "✨ Sí hay disponibilidad.\n\n🤍 Air Force 1 negras.\n💰 *$60.000*\n🚚 Envío rápido a toda Colombia.\n\n👟 *¿Cuál es tu talla? (21 al 44)*",

            D: "🚀 Tenemos disponibles las Air Force 1 negras.\n\n💵 Valor: *$60.000*\n\n👟 *Envíame tu talla y te envío la información para recibirlas.*",

            E: "👋 ¡Hola! 😊\n\n¿En qué talla las necesitas?\n\n👟 Tenemos disponibles del *21 al 44*.\n💰 Precio: *$60.000*.",

            F: "✅ Sí están disponibles.\n\n🤍 Air Force 1 negras.\n💰 *$60.000*\n\n👟 *Dime tu talla y en unos minutos dejamos listo tu pedido.*"

        });

    }

    return null;

};