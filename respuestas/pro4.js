const { registrarProducto } = require("../estadisticas/hoy");
const { guardar } = require("../estado");

module.exports = function (texto, usuario) {

    texto = texto.toLowerCase().trim();

    if (
        texto.includes("audifonos con cancelacion de ruido") ||
        texto.includes("audífonos con cancelación de ruido")
    ) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "pro4",
            nombreProducto: "AirPods Pro",
            pedidoEnviado: false
        });

        return {
            mensajes: [
                {
                    foto: true,
                    producto: "pro4",
                    imagen: 1,
                    texto: "🎧 AirPods Pro 2"
                },
                {
                    foto: true,
                    producto: "pro4",
                    imagen: 2,
                    texto: "🎧 AirPods Pro 4"
                },
                {
                    texto: `Excelente 👍

Ya solo necesito estos datos para generar el envío:

📦 Nombre completo:
📍 Dirección exacta:
🏙️ Ciudad/Municipio:
📱 Número de contacto:

💰 Valor a pagar: $60.000 + envío
🚚 Pago contra entrega.

✅ ¿Te despacho los AirPods Pro 2 o los AirPods Pro 4?

Tu pedido llegará hoy mismo si estás en Palmira o entre 1 y 3 días hábiles si estás en otra ciudad.`
                }
            ]
        };
    }

    return null;
};