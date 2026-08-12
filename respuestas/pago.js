const { obtenerVariante } = require("../estadisticas/ab");

module.exports = function (texto, usuario) {

    texto = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (
        texto.includes("nequi") ||
        texto.includes("transferencia") ||
        texto.includes("consignar") ||
        texto.includes("datos de pago") ||
        texto.includes("numero para pagar") ||
        texto.includes("número para pagar") ||
        texto.includes("metodo de pago") ||
        texto.includes("método de pago") ||
        texto.includes("formas de pago") ||
        texto.includes("como pago") ||
        texto.includes("cómo pago") ||
        texto.includes("quiero pagar") ||
        texto.includes("realizar el pago") ||
        texto.includes("hacer el pago") ||
        texto.includes("donde pago") ||
		texto.includes("Que medios de pago reciben") ||
        texto.includes("dónde pago") ||
        texto.includes("pagar")
    ) {

        return obtenerVariante(
            "pago",
            usuario,
            {

A: `💳 Puedes realizar el pago por Nequi:

👤 *Juan Galarraga*
📱 *321 720 4017*

📸 Cuando realices el pago, envíame el comprobante y continuamos con el envío. 🚚`,

B: `💳 ¿Prefieres pagar por Nequi o pago contra entrega?

Si deseas pagar por Nequi, estos son los datos:

👤 *Juan Galarraga*
📱 *321 720 4017*`,

C: `✅ ¡Perfecto!

En cuanto envíes el comprobante dejaré tu pedido confirmado para despacho.

💳 Nequi

👤 *Juan Galarraga*
📱 *321 720 4017*`,

D: `🚚 Si realizas el pago ahora, tu pedido podrá prepararse de inmediato.

💳 Nequi

👤 *Juan Galarraga*
📱 *321 720 4017*

📸 Apenas reciba el comprobante seguimos con el envío.`,

E: `💳 Datos para el pago:

👤 *Juan Galarraga*
📱 *321 720 4017*

❓Si prefieres otro método de pago, dime cuál y con gusto te ayudo.`,

F: `🤝 Ya casi terminamos tu pedido.

Solo falta el pago para dejarlo confirmado.

💳 Nequi

👤 *Juan Galarraga*
📱 *321 720 4017*

📸 Envíame el comprobante y tu pedido quedará listo para despacho. 🚚`

            }
        );

    }

    return null;

};