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

        return {
            foto: true,
            producto: "vans",
            texto: obtenerVariante("vans", usuario, {

A: "Hola 👋\n\n¿Qué talla buscas?",

B: "🔥 Tenemos disponibles las Vans.\n\n💰 *$85.000*\n✅ Tallas del *21 al 44*\n\n👟 Escríbeme tu talla y te confirmo disponibilidad.",

C: "🖤 Vans disponibles.\n\n💰 *$85.000*\n\n👟 ¿Qué talla necesitas?",

D: "🚀 Sí tenemos disponibles las Vans.\n\n💰 *$85.000*\n\n👟 Dime tu talla y te ayudo a dejar listo tu pedido.",

E: "👋 Hola.\n\n🖤 Vans disponibles del *21 al 44*.\n💰 *$85.000*\n\n👟 ¿En qué talla las necesitas?",

F: "✅ Sí están disponibles.\n\n🖤 Vans\n💰 *$85.000*\n\n👟 Dime tu talla y en unos minutos dejamos listo tu pedido. 🚚"

            })
        };

    }

    return null;

};