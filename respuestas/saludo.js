const { obtenerVariante } = require("../estadisticas/ab");

module.exports = function (texto, usuario) {

texto = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

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

// Evitar saludo cuando el cliente está preguntando por calidad
if (texto.includes("triple a")) {
    return null;
}

// Evitar conflicto con ubicación
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

if (!saludos.some(s => new RegExp(`\\b${s}\\b`).test(texto))) {
    return null;
}

const palabras = texto.split(" ");

if (palabras.length > 3) {
    return null;
}

const extras = [
    "desde",
    "quiero",
    "necesito",
    "busco",
    "tienen",
    "cuanto",
    "precio",
    "vale",
    "costo",
    "envio",
    "envío",
    "talla",
    "color",
    "para",
    "porque",
    "como"
];

if (extras.some(p => texto.includes(p))) {
    return null;
}

return obtenerVariante(
    "saludo",
    usuario,
    {

A: `${saludo}

💬 Dime qué producto buscas y te ayudo enseguida.`,

B: `👀 ¿Qué producto te interesa?`,

C: `${saludo} ¿Buscas tenis, sandalias, cargadores o algo diferente?`,

D: `${saludo}

¿Qué producto necesitas?`,

E: `📦 Cuéntame qué producto quieres y te envío la información completa.`,

F: `👟 Bienvenido a CALZADISIMO.

¿Qué producto te interesa? Te ayudo enseguida`

    }
);

};