const { obtenerVariante } = require("../estadisticas/ab");
const {
    registrarDireccion
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    // El cliente está enviando su dirección
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

if (
    texto === "direccion" ||
    texto.includes("direccion") ||
    texto === "ubicacion" ||
    texto === "ubicados" ||

    texto.includes("punto fisico") ||
    texto.includes("direccion del local") ||
    texto.includes("ubicacion") ||
    texto.includes("direccion tienda fisica") ||
    texto.includes("direccion de la tienda") ||
    texto.includes("direccion del punto") ||
    texto.includes("direccion del punto fisico") ||

    texto.includes("ubicacion de la tienda") ||
    texto.includes("ubicacion del local") ||
    texto.includes("ubicacion del punto") ||

    texto.includes("donde estan") ||
    texto.includes("donde quedan") ||
    texto.includes("donde queda") ||
    texto.includes("ubicado") ||
    texto.includes("donde se ubican") ||
    texto.includes("donde esta la tienda") ||
    texto.includes("donde queda la tienda") ||
    texto.includes("como llego") ||

texto.includes("tienen local") ||
texto.includes("tiene local") ||
texto.includes("tienen tienda") ||
texto.includes("tiene tienda") ||
texto.includes("tienen punto") ||
texto.includes("tienen punto fisico") ||
texto.includes("tienen punto físico") ||
texto.includes("me encuentro en palmira") ||
texto.includes("estoy en palmira") ||
texto.includes("ando en palmira") ||
texto.includes("para probar") ||
texto.includes("probarme") ||
texto.includes("probar") ||
texto.includes("para medirmelos") ||
texto.includes("para medírmelos") ||
texto.includes("me los puedo medir") ||
texto.includes("me los puedo probar") ||
texto.includes("puedo probarmelos") ||

texto.includes("quiero probar") ||
texto.includes("probarlos") ||
texto.includes("probarlas") ||
texto.includes("medirmelos") ||
texto.includes("medírmelos") ||
texto.includes("me quedan bien") ||
texto.includes("ver si me quedan") ||
texto.includes("para ver si me quedan") ||
texto.includes("probar si me quedan") ||

    texto.includes("puedo recoger") ||
    texto.includes("quiero recoger") ||
    texto.includes("paso a recoger") ||
    texto.includes("recoger en tienda") ||
    texto.includes("recoger en el local") ||
    texto.includes("recoger personalmente") ||

    // Nuevas frases
    texto.includes("podria ir") ||
    texto.includes("podría ir") ||
    texto.includes("puedo ir") ||
    texto.includes("ir por ellas") ||
    texto.includes("ir por ellos") ||
    texto.includes("voy al local") ||
    texto.includes("voy por ellas") ||
    texto.includes("voy por ellos") ||
    texto.includes("pasar por ellas") ||
    texto.includes("pasar por ellos")
) {

        return obtenerVariante("ubicacion", usuario, {

A: `📍 Estamos ubicados en Palmira *Calle 29 #26-30*, entrada recomendada del Centro Comercial Villa de las Palmas.
ufvii
➡️ Dentro del centro comercial nos encuentras en el **Local 291 - CALZADISIMO**.

📌 Diagonal al Banco de Bogotá.
Preguntar por monica

🗺️ Google Maps:
https://maps.app.goo.gl/SuGbvW8j5TourCs9A

¿Prefieres pasar por el local o hacemos el envío?`,

B: `📍 ¡Sí tenemos punto físico en Palmira!

La entrada más fácil es por la *Calle 29 #26-30*, Centro Comercial Villa de las Palmas.

➡️ Estamos dentro del centro comercial en el **Local 291 - CALZADISIMO**.
Preguntar por monica

🗺️ Google Maps:
https://maps.app.goo.gl/SuGbvW8j5TourCs9A

¿Vas a pasar hoy o prefieres envío?`,

C: `📍 Puedes visitarnos en Palmira por la *Calle 29 #26-30*, Centro Comercial Villa de las Palmas.

➡️ Dentro del centro comercial estamos en el **Local 291 - CALZADISIMO**.
Preguntar por monica

🗺️ Google Maps:
https://maps.app.goo.gl/SuGbvW8j5TourCs9A

¿Vienes al local o prefieres domicilio?`,

D: `📍 Estamos en Palmira.

La entrada recomendada es por la *Calle 29 #26-30*, Centro Comercial Villa de las Palmas.

➡️ Dentro del centro comercial nos encuentras en el **Local 291 - CALZADISIMO**.
Preguntar por monica

🗺️ Google Maps:
https://maps.app.goo.gl/SuGbvW8j5TourCs9A

¿Te esperamos o hacemos el envío?`,

E: `📍 Nuestra tienda está dentro del Centro Comercial Villa de las Palmas - Palmira.

Ingresa por la *Calle 29 #26-30* y encontrarás el **Local 291 - CALZADISIMO**.
Preguntar por monica

🗺️ Google Maps:
https://maps.app.goo.gl/SuGbvW8j5TourCs9A

¿Qué prefieres, recoger en tienda o envío?`,

F: `📍 Dirección:

Palmira - *Calle 29 #26-30*
Centro Comercial Villa de las Palmas

➡️ **Local 291 - CALZADISIMO**

📌 Diagonal al Banco de Bogotá.

🗺️ Google Maps:
https://maps.app.goo.gl/SuGbvW8j5TourCs9A

¿Recoges en tienda o hacemos el envío?`,

        });

    }

registrarDireccion(usuario);

return null;

};