module.exports = function (texto) {

    if (texto === "hola")
        return "Hola 👋 ¿En qué puedo ayudarte?";

    if (texto.includes("precio"))
        return "¿Qué producto te interesa?";

    if (
        texto.includes("nequi") ||
        texto.includes("transferencia") ||
        texto.includes("consignar") ||
        texto.includes("datos de pago") ||
        texto.includes("numero para pagar") ||
        texto.includes("pagar") ||
        texto.includes("realizar el pago") ||
        texto.includes("quiero pagar")
    )
        return `💳 Puedes realizar el pago por Nequi:

📱 *3217204017*
👤 *Juan Galarraga*

📸 Cuando realices el pago, envíame el comprobante y continuamos con el envío. 🚚`;

    if (texto === "gracias")
        return "Con mucho gusto 😊";

    if (texto === "adios")
        return "Hasta luego.";

    return null;

};