const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

if (
    texto.includes("kyro arnica plus") &&
    texto.includes("$89.900")
) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "kyroarnicaplus",
            nombreProducto: "Kyro Árnica Plus",
            pedidoEnviado: false
        });

        return {
            foto: true,
            producto: "kyroarnicaplus",
            texto: obtenerVariante("kyroarnicaplus", usuario, {

A: `Perfecto 👌

La promoción de 2 Kyro Árnica Plus de 250ML está disponible por solo $89.900.

🚚 Pago contra entrega.

Para verificar cobertura de entrega dime primero:

📍 ¿En qué ciudad te encuentras?`,

B: `¡Hola! 👋

Miles de personas buscan Kyro Árnica Plus para aliviar molestias en:

✅ Espalda
✅ Rodillas
✅ Cuello
✅ Hombros
✅ Articulaciones

🔥 Hoy tenemos promoción de 2 unidades de 250ML por solo $89.900.

🚚 Pago contra entrega.

¿En qué parte del cuerpo presentas la molestia para indicarte cómo usarla correctamente?`,

C: `🔥 Promoción activa:

✅ 2 Kyro Árnica Plus 250ML
💰 $89.900
🚚 Pago contra entrega

Para decirte cuándo te llega:

📍 ¿En qué ciudad te encuentras?`

            })
        };

    }

    return null;

};