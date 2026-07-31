const { obtenerVariante } = require("../estadisticas/ab");

module.exports = function (texto, usuario) {

    if (
        texto === "catalogo" ||
        texto.includes("catalogo") ||
        texto.includes("modelos")
    ) {

        return obtenerVariante("catalogo", usuario, {

            A: `🔥 ¡Aquí puedes ver todos nuestros modelos disponibles!

📲 https://wa.me/c/573217204017

Cuando veas el que más te guste, envíame una captura de pantalla o el nombre del modelo. 😊`,

            B: `👟 ¡Tenemos muchos modelos disponibles!

Míralos aquí:
https://wa.me/c/573217204017

📸 Envíame una captura del que te guste y te confirmo talla y disponibilidad.`,

            C: `😎 Nuestro catálogo completo está aquí:

https://wa.me/c/573217204017

Escríbeme cuál modelo te gustó y con gusto te ayudo con la talla.`,

            D: `✅ Aquí puedes ver todas las zapatillas disponibles:

https://wa.me/c/573217204017

Cuando elijas una, envíame una foto del modelo para confirmar disponibilidad.`,

            E: `🔥 Tenemos muchos estilos para escoger.

Catálogo:
https://wa.me/c/573217204017

¿Cuál te gustó? Envíame una captura y te ayudo enseguida. 👌`,

            F: `👋 ¡Claro!

Aquí está nuestro catálogo actualizado:
https://wa.me/c/573217204017

📷 Cuando encuentres el modelo que te guste, mándame una captura y te digo si está disponible en tu talla.`

        });

    }

    return null;

};