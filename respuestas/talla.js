const {
    obtenerVariante,
    reporte
} = require("../estadisticas/ab");

const {
    obtener,
    guardar
} = require("../estado");

const {
    registrarTalla
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    const estado = obtener(usuario);

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

    const textoLimpio = texto.trim();

    if (!/^\d{2}$/.test(textoLimpio)) {
        return null;
    }

    const talla = textoLimpio;

    if (Number(talla) < 21 || Number(talla) > 44) {
        return null;
    }

    registrarTalla(usuario);

    guardar(usuario, {
        talla
    });

    const respuesta = obtenerVariante(
        "talla",
        usuario,
        {

A: `🤍 ¡Sí! Tenemos disponible la talla *${talla}*.

🚚 ¿De qué barrio eres? Así te confirmo el costo del envío`,

B: `✅ Perfecto.

La talla *${talla}* está disponible.

🚚 ¿Me dices tu barrio para indicarte el envío?`,

C: `Perfecto

¿La recoges en el local o prefieres que te la enviemos?

📍 Dime tu barrio y te explico cómo te la hacemos llegar.`,

D: `Si claro para que direccion?`,

E: `Listo, prefieres recoger en el local o envio?.

📍 Dime tu barrio y te digo cómo te la hacemos llegar`,

F: `✅ Sí hay talla *${talla}*.

🚚 ¿Cuál es tu barrio? Así te digo el costo y el tiempo del envío`

        }
    );

    console.log(reporte("talla"));

    return respuesta;

};