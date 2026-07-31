module.exports = function (texto) {

    const tallas = [

        "35",
        "36",
        "37",
        "38",
        "39",
        "40"

    ];

    if (!tallas.includes(texto))
        return null;

    const respuestas = [

`🤍 ¡Sí! Tenemos disponible la talla *${texto}*.

🚚 ¿Te la envío por domicilio o prefieres recogerla?`,

`✅ Perfecto.

La talla *${texto}* está disponible.

📦 ¿La deseas por envío o prefieres recogerla?`,

`🔥 Sí tenemos disponible la talla *${texto}*.

¿Te la separo o prefieres que te la envíe?`

    ];

    const indice = Math.floor(
        Math.random() * respuestas.length
    );

    return respuestas[indice];

};