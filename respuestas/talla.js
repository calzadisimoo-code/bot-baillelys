module.exports = function (texto, usuario) {

const { obtenerVariante } = require("../estadisticas/ab");
const { obtener } = require("../estado");
const estado = obtener(usuario);

if (!estado?.producto) {
    return null;
}

    const tallas = [
        "35",
        "36",
        "37",
        "38",
        "39",
        "40"
    ];

    let talla = null;

    for (const t of tallas) {

        if (texto.includes(t)) {

            talla = t;
            break;

        }

    }

    if (!talla)
        return null;

    return obtenerVariante(
        "talla",
        texto,
        {

A: `🤍 ¡Sí! Tenemos disponible la talla *${talla}*.

🚚 ¿Te la envío por domicilio o prefieres recogerla?`,

B: `✅ Perfecto.

La talla *${talla}* está disponible.

📦 ¿La deseas por envío o prefieres recogerla?`,

C: `🔥 Sí tenemos disponible la talla *${talla}*.

¿Te la separo o prefieres que te la envíe?`,

D: `👟 ¡Claro! Sí manejamos la talla *${talla}*.

🚀 ¿Prefieres recibirla por envío o pasar a recogerla?`,

E: `✅ Tenemos disponible la talla *${talla}*.

📍 Puedes recogerla o también hacemos envíos.

¿Cuál prefieres?`,

F: `🤩 Excelente, la talla *${talla}* sí está disponible.

🚚 ¿La enviamos a tu dirección o prefieres visitarnos para probártela?`

        }

    );

};