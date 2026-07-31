const { obtenerVariante } = require("../estadisticas/ab");

module.exports = function (texto, usuario) {

    // El cliente está enviando su dirección
    if (
if (
    texto.includes("calle") ||
    texto.includes("carrera") ||
    texto.includes("cra") ||
    texto.includes("cl ") ||
    texto.includes("barrio") ||
    texto.includes("manzana") ||
    texto.includes("mz") ||
    texto.includes("casa") ||
    texto.includes("apartamento") ||
    texto.includes("apto") ||
    texto.includes("torre") ||
    texto.includes("bloque") ||
    texto.includes("#")
) {
    return null;
}
    ) {
        return null;
    }

    if (
texto === "direccion" ||
texto === "ubicacion" ||
texto === "ubicados" ||
texto === "punto fisico" ||
texto.includes("donde estan") ||
texto.includes("donde quedan") ||
texto.includes("ubicados") ||
texto.includes("direccion del local") ||
texto.includes("donde se ubican") ||
texto.includes("puedo recoger") ||
texto.includes("quiero recoger")
    ) {

        return obtenerVariante("ubicacion", usuario, {

            A: `📍 Estamos ubicados en la Calle 29 #27-34, Centro Comercial Villa de las Palmas, *Local 291, CALZADISIMO*, en Palmira.

Estamos diagonal al Banco de Bogotá.

¿Prefieres pasar o te lo enviamos?`,

            B: `📍 Sí tenemos punto físico.

Nos encuentras en la Calle 29 #27-34, Centro Comercial Villa de las Palmas, Local 291, Palmira.

Estamos diagonal al Banco de Bogotá.

¿Vas a pasar hoy o prefieres envío?`,

            C: `📍 Puedes visitarnos en el Centro Comercial Villa de las Palmas, Local 291, Palmira.

Si deseas, puedes ver el producto antes de comprar.

¿Vienes al local o prefieres domicilio?`,

            D: `📍 Estamos en Palmira, Calle 29 #27-34, Centro Comercial Villa de las Palmas, Local 291.

Es muy fácil ubicarnos, estamos diagonal al Banco de Bogotá.

¿Te esperamos o hacemos el envío?`,

            E: `📍 Nuestra tienda está ubicada en el Centro Comercial Villa de las Palmas, Local 291, Palmira.

Si estás en Palmira también podemos enviártelo rápidamente.

¿Qué prefieres?`,

            F: `📍 Dirección:
Calle 29 #27-34
Centro Comercial Villa de las Palmas
Local 291 - CALZADISIMO

📌 Diagonal al Banco de Bogotá.

¿Recoges en tienda o hacemos el envío?`

        });

    }

    return null;

}