const { obtenerVariante } = require("../../estadisticas/ab");

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

return obtenerVariante(
    "saludo",
    usuario,
    {

A: `${saludo} Bienvenido a CALZADISIMO.

👟 Tenemos Air Force 1, Paris, sandalias, cargadores y muchos productos más.

😊 ¿Qué producto estás buscando?`,

B: `${saludo}

🚚 Hacemos envíos a toda Colombia y también contamos con tienda física en Palmira.

👟 ¿Qué producto te interesa?`,

C: `${saludo} 😊

👟 Cuéntame qué producto estás buscando y con gusto te envío toda la información.`,

D: `${saludo}

Estoy aquí para ayudarte a encontrar el producto que buscas. 🤝

📦 ¿Qué producto te interesa hoy?`,

E: `${saludo} ¡Qué gusto saludarte! ❤️

👟 Tenemos varios modelos disponibles.

✨ ¿Cuál estás buscando?`,

F: `${saludo}

✅ Enviamos a toda Colombia y respondemos lo más rápido posible.

👟 ¿Qué producto te gustaría ver?`

    }

);

};