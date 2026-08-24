const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    if (
        texto.includes("vans") ||
        texto.includes("quiero las vans calzadisimo")
    ) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "vans",
            pedidoEnviado: false
        });

        return obtenerVariante("vans", usuario, {

            A: "Hola que talla buscas?",

            B: "🔥 Hola tenemos las Vans por *$85.000*.\n\n✅ Tallas disponibles del *21 al 44*.\n\n👟 *Escríbeme únicamente tu talla y te ayudo con el pedido.*",

            C: "🖤 Vans disponibles.\n\n💰 Valor: *$85.000*\n\n👟 ¿Qué talla buscas?",

            D: "🚀 Tenemos disponibles las Vans.\n\n💵 Valor: *$85.000*\n\n👟 *Envíame tu talla y te envío la información para recibirlas.*",

            E: "👋 ¡Hola! 😊\n\n¿En qué talla las necesitas?\n\n👟 Tenemos disponibles del *21 al 44*.\n💰 Precio: *$85.000*.",

            F: "✅ Sí están disponibles.\n\n🖤 Vans.\n💰 *$85.000*\n\n👟 *Dime tu talla y en unos minutos dejamos listo tu pedido.*"

        });

    }

    return null;

};