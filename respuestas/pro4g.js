const { registrarProducto } = require("../estadisticas/hoy");
const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");

module.exports = function (texto, usuario) {

    texto = texto.toLowerCase().trim();

    if (
        texto.includes("Quiero los AirPods de 4 Generacion en $60.000.")
    ) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "pro4g",
            nombreProducto: "AirPods Pro",
            pedidoEnviado: false
        });

        return obtenerVariante("pro4g", usuario, {

            A: {
                mensajes: [
                    {
                        foto: true,
                        producto: "pro4g",
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
            },

            B: {
                mensajes: [
                    {
                        foto: true,
                        producto: "pro4g",
                        imagen: 2,
                        texto: "🎧 AirPods Pro 4"
                    },
                    {
                        texto: `🚚 Disponibles para entrega inmediata.

💰 Valor: $60.000 + envío
💵 Pago contra entrega.

Para despacharlos hoy mismo envíame:

📦 Nombre completo:
📍 Dirección exacta:
🏙️ Ciudad/Municipio:
📱 Número de contacto:

1️⃣ AirPods Pro 2
2️⃣ AirPods Pro 4

✅ ¿Cuál prefieres?`
                    }
                ]
            },

            C: {
                mensajes: [
                    {
                        foto: true,
                        producto: "pro4g",
                        imagen: 2,
                        texto: "🎧 AirPods Pro 4"
                    },
                    {
                        texto: `¿En que barrio te encuentras?`
                    }
                ]
            }

        });

    }

    return null;

};