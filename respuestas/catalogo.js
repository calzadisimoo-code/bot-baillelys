const { obtenerVariante } = require("../estadisticas/ab");
const { registrarCatalogo } = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

if (
    texto === "catalogo" ||
    texto === "catalago" ||
    texto.includes("catalogo") ||
    texto.includes("catalago") ||
	texto.includes("tenis tiene") ||
    texto.includes("catalogo") ||
    texto.includes("catlogo") ||
	texto.includes("tienes diseños") ||
    texto.includes("de hombre y de mujer") ||
	texto.includes("zapatillas tiene") ||
	texto.includes("zapatos no tan") ||
	texto.includes("foto de el calzado") ||
	texto.includes("Solo tienen esos") ||
	texto.includes("calzado que tenga") || 
    texto.includes("modelos")
) {

        registrarCatalogo(usuario);

        return obtenerVariante("catalogo", usuario, {

            A: `👟 ¡Tenemos muchísimos modelos disponibles!

📲 Míralos aquí:
https://wa.me/c/573217204017

📸 Envíame una captura del que más te guste y te confirmo de inmediato la talla disponible y el precio. ✅`,

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