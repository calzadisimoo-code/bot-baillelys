module.exports = function (texto) {
	
texto = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
	
if (
    /\bcontra\s*-?\s*entrega\b/.test(texto) ||
    texto.includes("pago al recibir") ||
    texto.includes("pagar al recibir") ||
    texto.includes("recibir y pagar")
)
    return `✅ ¡Sí! Manejamos *pago contra entrega* en la mayoría de ciudades de Colombia.

📍 ¿A qué direccion sería el envío? Así te confirmo la disponibilidad, el valor del envío y el tiempo de entrega. 🚚`;

const saludos = [
    "hola",
    "holaaa",
    "holaaaa",
    "ola",
    "holi",
    "hey",
    "buenas",
    "bien dia",
    "buen dia",
    "buenos dias",
    "buenas tardes",
    "buenas noches",
    "buen diaa",
    "buen diaaa"
];

let saludo = "👋 ¡Hola!";

if (
    texto.includes("bien dia") ||
    texto.includes("buen dia")
) {
    saludo = "☀️ ¡Buen día!";
} else if (texto.includes("buenos dias")) {
    saludo = "☀️ ¡Buenos días!";
} else if (texto.includes("buenas tardes")) {
    saludo = "🌤️ ¡Buenas tardes!";
} else if (texto.includes("buenas noches")) {
    saludo = "🌙 ¡Buenas noches!";
} else if (texto.includes("buenas")) {
    saludo = "😊 ¡Buenas!";
}
if (
    texto.includes("local") ||
    texto.includes("direccion") ||
    texto.includes("dirección") ||
    texto.includes("ubicacion") ||
    texto.includes("ubicados") ||
    texto.includes("numero del local") ||
    texto.includes("número del local") ||
    texto.includes("numero de la tienda") ||
    texto.includes("número de la tienda") ||
    texto.includes("punto fisico") ||
    texto.includes("punto físico")
) {
    return null;
}

if (saludos.some(s => new RegExp(`\\b${s}\\b`).test(texto))) {
    return `${saludo} Bienvenido a CALZADISIMO.

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