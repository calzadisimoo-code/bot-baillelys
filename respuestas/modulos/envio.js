const { obtenerVariante } = require("../../estadisticas/ab");

module.exports = function (texto, usuario) {

    if (
        texto.includes("envio") ||
        texto.includes("envío") ||
        texto.includes("domicilio") ||
		texto.includes("domiclio") ||
        texto.includes("recibir")
    ) {

        return obtenerVariante("envio", usuario, {

            A: "🚚 ¡Claro! Envíanos tu dirección o barrio y ciudad para decirte el costo del envío y el tiempo de entrega.",

            B: "📦 Con gusto. Escríbeme tu dirección completa y la ciudad para cotizar el envío de inmediato.",

            C: "✅ Sí hacemos envíos. ¿Me envías la dirección donde deseas recibir el pedido? Así te confirmo el valor del envío.",

            D: "🚚 Perfecto. Compárteme tu dirección y ciudad, y te indico cuánto cuesta el envío y cuándo te llegaría.",

            E: "📍 Envíame la dirección de entrega y te cotizo el envío enseguida.",

            F: "📦 Para calcular el envío necesito la dirección donde deseas recibir el pedido. Envíamela y te doy el valor exacto."

        });

    }

    return null;

}