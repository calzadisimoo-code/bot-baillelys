module.exports = function (texto, usuario) {

const { obtenerVariante } = require("../estadisticas/ab");
const {
    obtener,
    guardar
} = require("../estado");
const estado = obtener(usuario);
const {
    registrarTalla
} = require("../estadisticas/hoy");

if (!estado?.producto) {
    return null;
}

const palabrasDireccion = [
    "calle",
    "cl",
    "carrera",
    "cra",
    "kr",
    "kra",
    "transversal",
    "tv",
    "diagonal",
    "dg",
    "#",
    "casa",
    "apartamento",
    "apto",
    "barrio",
    "manzana",
    "mz"
];

if (palabrasDireccion.some(p => texto.includes(p))) {
    return null;
}

const tallas = [];

for (let i = 21; i <= 44; i++) {
    tallas.push(i.toString());
}

    let talla = null;

    for (const t of tallas) {

        if (texto.includes(t)) {

            talla = t;
            break;

        }

    }

    if (!talla)
        return null;

     registrarTalla(usuario);
	 
	 guardar(usuario,{
    talla
});

    return obtenerVariante(
        "talla",
        texto,
        {

A: `🤍 ¡Sí! Tenemos disponible la talla *${talla}*.

🚚 ¿De qué barrio eres? Así te confirmo el costo del envío`,

B: `✅ Perfecto.

La talla *${talla}* está disponible.

🚚 ¿Me dices tu barrio para indicarte el envío?`,

C: `🔥 Excelente.

Sí tenemos la talla *${talla}*.

📍 ¿Cuál es tu barrio para decirte el valor del envío?`,

D: `👟 La talla *${talla}* está disponible.

🚚 ¿En qué barrio te encuentras?`,

E: `🤩 ¡Buenas noticias!

Tenemos disponible la talla *${talla}*.

📍 Dime tu barrio y te digo cómo te la hacemos llegar`,

F: `✅ Sí hay talla *${talla}*.

🚚 ¿Cuál es tu barrio? Así te digo el costo y el tiempo del envío`

        }

    );

};