module.exports = function (texto) {

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

    const respuestas = [

`🤍 ¡Sí! Tenemos disponible la talla *${talla}*.

🚚 ¿Te la envío por domicilio o prefieres recogerla?`,

`✅ Perfecto.

La talla *${talla}* está disponible.

📦 ¿La deseas por envío o prefieres recogerla?`,

`🔥 Sí tenemos disponible la talla *${talla}*.

¿Te la separo o prefieres que te la envíe?`

    ];

    const indice = Math.floor(
        Math.random() * respuestas.length
    );

    return respuestas[indice];

};