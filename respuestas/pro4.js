const { registrarProducto } = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    texto = texto.toLowerCase().trim();

    if (
        texto.includes("pro 4") ||
        texto.includes("pro4") ||
        texto.includes("airpods") ||
        texto.includes("airpods pro 4") ||
        texto.includes("airpod pro 4") ||
        texto.includes("audifonos pro 4") ||
        texto.includes("audífonos pro 4") ||
        texto.includes("audifonos con cancelacion de ruido") ||
        texto.includes("audífonos con cancelación de ruido")
    ) {

        registrarProducto(usuario);

        return `Excelente 👍

Ya solo necesito estos datos para generar el envío:

📦 Nombre completo:
📍 Dirección exacta:
🏙️ Ciudad/Municipio:
📱 Número de contacto:

💰 Valor a pagar: $60.000 + envio
🚚 Pago contra entrega.

Tu pedido llegará hoy mismo si estas en Palmira o entre 1 y 3 días hábiles si estas en otra ciudad.`;
    }

    return null;
};