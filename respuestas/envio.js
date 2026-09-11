const { obtenerVariante } = require("../estadisticas/ab");

module.exports = function (texto, usuario) {

if (

    texto === "envio" ||
    texto === "envío" ||
    texto === "domicilio" ||

    texto.includes("hacen envios") ||
    texto.includes("hacen envíos") ||
    texto.includes("realizan envios") ||
    texto.includes("realizan envíos") ||

    texto.includes("quiero envio") ||
    texto.includes("quiero envío") ||

    texto.includes("necesito envio") ||
    texto.includes("necesito envío") ||

    texto.includes("cuanto cuesta el envio") ||
    texto.includes("cuanto cuesta el envío") ||

    texto.includes("valor del envio") ||
    texto.includes("valor del envío") ||

    texto.includes("costo del envio") ||
    texto.includes("costo del envío")

) {

        return obtenerVariante("envio", usuario, {

            A: "🚚 ¡Claro! Envíanos tu dirección o barrio y ciudad para decirte el costo del envío",

            B: "📦 Con gusto. Escríbeme tu dirección completa para cotizar el envío de inmediato", //1 VENTA

            C: "✅ Sí hacemos envíos. ¿Me envías la dirección donde deseas recibir el pedido? Así te confirmo el valor del envío.",

            D: "🚚 Perfecto. Compárteme tu dirección y ciudad, y te indico cuánto cuesta el envío",

            E: "📍 Envíame la dirección de entrega y te cotizo el envío enseguida.",

            F: "📦 Para calcular el envío necesito la dirección donde deseas recibir el pedido. Envíamela y te doy el valor exacto."

        });

    }

    return null;

}