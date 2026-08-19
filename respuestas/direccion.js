const {
    registrarDireccion
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    texto = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    // El cliente está enviando su dirección.
    // No responder aquí porque debe continuar el flujo de pedido.
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
        texto === "ubicacion" ||

        (
            texto.includes("direccion") &&
            !texto.includes("no me se la direccion") &&
            !texto.includes("no me sé la direccion") &&
            !texto.includes("no se la direccion") &&
            !texto.includes("no sé la direccion") &&
            !texto.includes("no tengo la direccion") &&
            !texto.includes("no conozco la direccion")
        ) ||

        texto.includes("ubicacion") ||
        texto.includes("ubicados") ||
        texto.includes("ubicado") ||

        texto.includes("punto fisico") ||
        texto.includes("direccion del local") ||
        texto.includes("direccion de la tienda") ||
        texto.includes("direccion del punto") ||
        texto.includes("direccion del punto fisico") ||
        texto.includes("direccion tienda fisica") ||
        texto.includes("en que parte de palmira estan") ||

        texto.includes("ubicacion del local") ||
        texto.includes("ubicacion de la tienda") ||
        texto.includes("ubicacion del punto") ||
        texto.includes("me regalas la ubicacion") ||
        texto.includes("me compartes la ubicacion") ||
        texto.includes("comparteme la ubicacion") ||
        texto.includes("ubicacion exacta") ||
        texto.includes("direccion exacta") ||

        texto.includes("donde los encuentro") ||
        texto.includes("donde los consigo") ||
        texto.includes("en donde estan") ||
        texto.includes("en donde queda") ||

        texto.includes("numero del local") ||
        texto.includes("numero de local") ||
        texto.includes("numero de la tienda") ||
        texto.includes("numero del punto") ||
        texto.includes("me regalas el numero del local") ||
        texto.includes("cual es el local") ||
        texto.includes("que local es") ||
        texto.includes("en que local estan") ||
        texto.includes("local 291") ||
        texto.includes("local porfa") ||

        texto.includes("donde estan") ||
        texto.includes("donde queda") ||
        texto.includes("donde quedan") ||
        texto.includes("donde quesa") ||
        texto.includes("donde se ubican") ||
        texto.includes("donde esta la tienda") ||
        texto.includes("donde queda la tienda") ||
        texto.includes("como llego") ||
        texto.includes("como llegar") ||

        texto.includes("tienen local") ||
        texto.includes("tiene local") ||
        texto.includes("tienen tienda") ||
        texto.includes("tiene tienda") ||
        texto.includes("tienen punto") ||
        texto.includes("tienen punto fisico") ||

        texto.includes("me encuentro en palmira") ||
        texto.includes("estoy en palmira") ||
        texto.includes("ando en palmira") ||

        texto.includes("para probar") ||
        texto.includes("probarme") ||
        texto.includes("probar") ||
        texto.includes("probarlos") ||
        texto.includes("probarlas") ||
        texto.includes("para medirmelos") ||
        texto.includes("medirmelos") ||
        texto.includes("me los puedo medir") ||
        texto.includes("me los puedo probar") ||
        texto.includes("puedo probarmelos") ||
        texto.includes("quiero probar") ||
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

        texto.includes("me regalas la direccion") ||
        texto.includes("me envia la direccion") ||
        texto.includes("mandame la direccion") ||
        texto.includes("enviame la ubicacion") ||
        texto.includes("pasame la ubicacion") ||
        texto.includes("pasame la direccion") ||

        texto.includes("como los encuentro") ||
        texto.includes("como los encuentro alla") ||
        texto.includes("como llego al local") ||
        texto.includes("como llego a la tienda") ||

        texto.includes("podria ir") ||
        texto.includes("puedo ir") ||
        texto.includes("ir por ellas") ||
        texto.includes("ir por ellos") ||
        texto.includes("voy al local") ||
        texto.includes("voy por ellas") ||
        texto.includes("voy por ellos") ||
        texto.includes("pasar por ellas") ||
        texto.includes("pasar por ellos")
    ) {

        registrarDireccion(usuario);

        // TEMPORAL:
        // No mostrar dirección del local.
        // No usar A/B/C/D/E/F.
        // Se recomienda envío debido a los cierres de las vías.

        return `📦 Por los cierres de las vías hacia el centro comercial, te recomendamos pedirlo por envío a domicilio.

📸 Si quieres, te enviamos fotos del producto para que tengas mayor confianza.

🚚 Te lo enviamos directamente a tu dirección. ¿En qué barrio estás?`;
    }

    return null;

};