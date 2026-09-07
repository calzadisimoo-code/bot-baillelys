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

A: `¡Hola! 👋

La promoción de *Kyro Árnica Plus* sigue disponible:

✅ 2 Frascos de 250ML por $89.900
✅ Pago contra entrega
✅ Envíos a todo el país

Está formulada con Árnica, Diclofenaco, Naproxeno y Lidocaína para ayudar a aliviar molestias musculares y articulares.

¿Para qué zona la necesitas principalmente?

1️⃣ Espalda
2️⃣ Rodillas
3️⃣ Cuello
4️⃣ Hombros
5️⃣ Articulaciones`,

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