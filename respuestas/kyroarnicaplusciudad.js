const { obtener } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");

const PALABRAS_DIRECCION = [
    "calle",
    "cl ",
    "cra",
    "carrera",
    "kr",
    "kra",
    "transversal",
    "diagonal",
    "manzana",
    "apartamento",
    "apto",
    "barrio",
    "#"
];

const CIUDADES = new Set([
    "bogota",
    "medellin",
    "cali",
    "barranquilla",
    "cartagena",
    "bucaramanga",
    "cucuta",
    "pereira",
    "manizales",
    "armenia",
    "ibague",
    "neiva",
    "pasto",
    "villavicencio",
    "monteria",
    "valledupar",
    "sincelejo",
    "santa marta",
    "popayan",
    "tunja",
    "florencia",
    "yopal",
    "riohacha",
    "quibdo",
    "leticia",
    "san jose del guaviare",
    "mocoa",
    "puerto carreno",
    "bello",
    "itagui",
    "envigado",
    "soacha",
    "giron",
    "floridablanca",
    "piedecuesta",
    "dosquebradas",
    "soledad",
    "apartado",
    "turbo",
    "chia",
    "zipaquira",
    "funza",
    "mosquera",
    "facatativa",
    "fusagasuga",
    "girardot",
    "duitama",
    "sogamoso",
    "ipiales",
    "tumaco",
    "maicao",
    "ocana",
    "aguachica",
    "tulua",
    "buga",
    "cartago",
    "jamundi",
    "yumbo",
    "san gil",
    "pamplona",
    "giron",
    "malambo",
    "copacabana",
    "rionegro",
    "la ceja",
    "caucasia",
    "montenegro",
    "la dorada",
    "puerto boyaca",
    "el banco"
]);

function normalizar(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}

function pareceDireccion(texto) {

    texto = normalizar(texto);

    return PALABRAS_DIRECCION.some(p =>
        texto.includes(p)
    );

}

function pareceCiudad(texto) {

    texto = normalizar(texto);

    if (texto.length < 3) return false;

    if (texto.length > 40) return false;

    if (pareceDireccion(texto))
        return false;

    return CIUDADES.has(texto);

}

module.exports = function (texto, usuario) {

    const estado = obtener(usuario);

    if (
        !estado ||
        estado.producto !== "kyroarnicaplus" ||
        estado.pedidoEnviado === true
    ) {
        return null;
    }

    if (!pareceCiudad(texto)) {
        return null;
    }

    return obtenerVariante("kyroarnicaplusciudad", usuario, {

A: `Antes de despacharla, por favor envíame estos datos:

📦 Nombre completo:
📍 Dirección exacta:
🏙️ Ciudad/Municipio:
📱 Número de contacto:

La promoción de 2 unidad de Kyro Árnica Plus tiene un valor de $89.900 con pago contra entrega. 🚚

Una vez nos compartas los datos, programamos el envío. El tiempo de entrega es de 1 a 3 días hábiles.`,

B: `Perfecto. 👍

Antes de despacharla, por favor envíame estos datos:

📦 Nombre completo:
📍 Dirección exacta:
🏙️ Ciudad/Municipio:
📱 Número de contacto:

La promoción de 2 unidades de Kyro Árnica Plus tiene un valor de $89.900 con pago contra entrega. 🚚

Una vez nos compartas los datos, programamos el envío. El tiempo estimado de entrega es de 1 a 3 días hábiles.`,

C: `Perfecto 👌

Para dejar programado tu envío, envíame por favor:

📦 Nombre completo:
📍 Dirección exacta:
🏙️ Ciudad/Municipio:
📱 Número de contacto:

✅ Promoción activa:
2 Kyro Árnica Plus 250ML por $89.900

🚚 Pago contra entrega.

Entrega estimada de 1 a 3 días hábiles.`,

D: `Excelente 👍

Ya solo necesito estos datos para generar la guía de envío:

📦 Nombre completo:
📍 Dirección exacta:
🏙️ Ciudad/Municipio:
📱 Número de contacto:

💰 Total a pagar: $89.900
🚚 Pago contra entrega.

Tu pedido llegará aproximadamente entre 1 y 3 días hábiles.`

    });

};
