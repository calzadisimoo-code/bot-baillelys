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

    const tallas = texto.match(/\b(2[1-9]|3[0-9]|4[0-4])\b/g);

    if (!tallas || tallas.length === 0) {
        return null;
    }

    const talla = tallas.join(" o ");

    registrarTalla(usuario);

    guardar(usuario, {
        ...estado,
        talla
    });

    const respuesta = obtenerVariante(
        `${estado.producto}_talla`,
        usuario,
        {
            A: "🚚 ¡Claro! Envíanos tu dirección o barrio y ciudad para decirte el costo del envío",

            B: "📦 Con gusto. Escríbeme tu dirección completa y la ciudad para cotizar el envío de inmediato.",

            C: "✅ Sí hacemos envíos. ¿Me envías la dirección donde deseas recibir el pedido? Así te confirmo el valor del envío.",

            D: "🚚 Perfecto. Compárteme tu dirección y ciudad, y te indico cuánto cuesta el envío",

            E: "📍 Envíame la dirección de entrega y te cotizo el envío enseguida.",

            F: "📦 Para calcular el envío necesito la dirección donde deseas recibir el pedido. Envíamela y te doy el valor exacto."
        }
    );

    console.log(reporte(`${estado.producto}_talla`));

    return respuesta;
};