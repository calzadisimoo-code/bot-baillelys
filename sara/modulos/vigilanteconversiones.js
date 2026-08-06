const fs = require("fs");
const path = require("path");

module.exports = async function (texto) {

    texto = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    if (
        !texto.includes("revisa") &&
        !texto.includes("vigila") &&
        !texto.includes("conversion") &&
        !texto.includes("conversiones") &&
        !texto.includes("que debo cambiar") &&
        !texto.includes("que respuesta cambio") &&
        !texto.includes("hay respuestas malas")
    ) {
        return null;
    }

    const datos = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../../estadisticas/datos.json"),
            "utf8"
        )
    );

    let mensaje = "❤️ Amor, revisé todas las respuestas del negocio.\n\n";

    let encontro = false;

    for (const producto in datos) {

        const variantes = datos[producto];

        for (const letra in variantes) {

            const v = variantes[letra];

            if (!v.enviados) continue;

            const conversion =
                (v.respondieron / v.enviados) * 100;

            if (
                v.enviados >= 5 &&
                conversion < 20
            ) {

                encontro = true;

                mensaje +=
`🚨 ${producto.toUpperCase()} - ${letra}

📤 Enviados: ${v.enviados}
💬 Respondieron: ${v.respondieron}
📉 Conversión: ${conversion.toFixed(1)}%

💡 Yo cambiaría esta respuesta cuanto antes.

`;

            }

        }

    }

    if (!encontro) {

        return "🥰 Amor, revisé todas las respuestas y ninguna está por debajo del 20%. ¡Vamos muy bien! ❤️";

    }

    return mensaje;

};