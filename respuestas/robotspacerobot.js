const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    if (
        texto.includes("robot space calzadisimo") ||
        texto.includes("robotspace") ||
        texto.includes("robot space robot") ||
        texto.includes("robot calzadisimo")
    ) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "robotspacerobot",
            pedidoEnviado: false
        });

        return obtenerVariante("robotspacerobot", usuario, {

            A: `🤖🔥 ¡Perfecto! Te puedo separar el Robot Space Robot ahora mismo.
💰 $179.900 con envío GRATIS a toda Colombia.
📦 Te llega en 1 a 3 días y puedes pagar al recibir.
⚡ Tenemos unidades limitadas, así que te recomiendo separarlo de una vez.

📍 ¿A qué dirección completa te lo envío para dejarte el pedido programado?`

        });

    }

    return null;

};