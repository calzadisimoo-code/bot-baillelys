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

A: `Perfecto

Antes de despacharlas, por favor envíame estos datos:

📦 Nombre completo: 📍 Dirección exacta: 🏙️ Ciudad/Municipio: 📱 

La promoción de 2 unidad de Kyro Árnica Plus tiene un valor de $89.900 con pago contra entrega. 🚚

Una vez nos compartas los datos, programamos el envío. El tiempo de entrega es de 1 a 3 días hábiles.`,

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

C: `¡Hola! 👋

La promoción de *Kyro Árnica Plus x2* sigue activa por solo $89.900.

✅ 2 Frascos de 250ML
✅ Pago contra entrega
✅ Envío rápido

Muchas personas la solicitan para apoyar el alivio de dolores musculares y articulares y mejorar la sensación de movilidad.

Para verificar cobertura de entrega, dime por favor:

📍 ¿En qué ciudad te encuentras?`

            })
        };

    }

    return null;

};