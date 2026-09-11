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

B: `Perfecto 👌

La promoción de 2 Kyro Árnica Plus de 250ML está disponible por $89.900.

🚚 Pago contra entrega.

Para decirte cuándo te llega:

📍 ¿En qué ciudad te encuentras?`,

C: `Perfecto 👌

Aún tenemos disponible la promoción de 2 Kyro Árnica Plus de 250ML por $89.900.

🚚 Pago contra entrega.

📍 ¿En qué ciudad te encuentras para validar entrega?`,

D: `Perfecto 👌

Las 2 unidades de Kyro Árnica Plus 250ML te quedan en $89.900.

🚚 Pagas al recibir.

📍 Dime tu ciudad y te confirmo entrega.`,

E: `Perfecto 👌

La promoción de 2 Kyro Árnica Plus de 250ML por $89.900 sigue activa hoy.

🚚 Pago contra entrega.

📍 ¿En qué ciudad te encuentras?`

            })
        };

    }

    return null;

};