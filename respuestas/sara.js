module.exports = function (texto) {
	
texto = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

if (

    // Hasta qué hora
    /(hasta|asta).*(q|que|k).*(hora)/.test(texto) ||

    // A qué hora abren / cierran
    /(a).*(q|que|k).*(hora).*(abren|abre|cierran|atienden)/.test(texto) ||

    // Qué hora abren / cierran
    /(q|que|k).*(hora).*(abren|abre|cierran|atienden)/.test(texto) ||

    // Horarios
    texto.includes("horario") ||
    texto.includes("horarios") ||
    texto.includes("horario del local") ||
    texto.includes("horario de la tienda") ||
    texto.includes("horario de atencion") ||
    texto.includes("que horario manejan") ||

    // Abiertos
    texto.includes("abierto") ||
    texto.includes("abiertos") ||
    texto.includes("estan abiertos") ||
    texto.includes("estan abiertos hoy") ||
    texto.includes("abierto hoy") ||
    texto.includes("siguen abiertos") ||
    texto.includes("aun estan abiertos") ||
    texto.includes("todavia estan abiertos") ||
    texto.includes("estan atendiendo") ||

    // Hoy
    texto.includes("abren hoy") ||
    texto.includes("cierran hoy") ||
    texto.includes("atienden hoy") ||
    texto.includes("hoy atienden") ||

    // Domingo
    texto.includes("abren domingo") ||
    texto.includes("abren los domingos") ||
    texto.includes("atienden domingo") ||
    texto.includes("atienden los domingos") ||

    // Sábado
    texto.includes("abren sabado") ||
    texto.includes("abren sabados") ||
    texto.includes("atienden sabado") ||
    texto.includes("atienden sabados") ||

    // Festivos
    texto.includes("abren festivos") ||
    texto.includes("atienden festivos") ||
    texto.includes("Ustedes abren los sábados para pasar ese día y llevarlos en 200 los 2?") ||

    // Mañana
    texto.includes("abren manana") ||
    texto.includes("manana abren")

) {
    return `🕘 Estamos abiertos *todos los días de 9:00 a. m. a 7:00 p. m.*

📍 Visítanos en el *Local 291* del Centro Comercial Villa de las Palmas, Palmira.

👩 Pregunta por *Mónica*.

😊 ¡Te esperamos!`;
}
	
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

    if (texto === "gracias")
        return "Con mucho gusto 😊";

    if (texto === "adios")
        return "Hasta luego.";

    return null;

};