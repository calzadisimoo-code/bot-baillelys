module.exports = function (texto) {

    texto = texto.toLowerCase();

const saludos = [
    "hola",
    "holaaa",
    "holaaaa",
    "ola",
    "holi",
    "hey",
    "buenas",
    "buen dia",
    "buen día",
    "buenos dias",
    "buenos días",
    "buenas tardes",
    "buenas noches"
];

if (saludos.some(s => texto.includes(s))) {
    return `👋 ¡Hola! Bienvenido a CALZADISIMO.

👟 Tenemos Air Force 1, Paris, sandalias, cargadores y más.

🚚 Hacemos envíos a toda Colombia.

¿Qué producto estás buscando?`;
}

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