const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    texto = texto.toLowerCase();

    if (
        texto.includes("$50") ||
        texto.includes("50mil") ||
        texto.includes("50 mil") ||
        texto.includes("50.000") ||
        texto.includes("50000")
    ) {
        return null;
    }

    // Si el cliente habla de las importadas, este flow no responde
    if (
        texto.includes(".1") ||
        texto.includes("1.1") ||
        texto.includes("import") ||
        texto.includes("importada") ||
        texto.includes("importadas")
    ) {
        return null;
    }

    const mencionaAF1 =
        texto.includes("air force") ||
        texto.includes("airforce") ||
        texto.includes("force 1") ||
        texto.includes("af1");

    if (!mencionaAF1) {
        return null;
    }

    // Cliente ya quiere comprar
    const intencionCompra =
        texto.includes("dame") ||
        texto.includes("quiero") ||
        texto.includes("me llevo") ||
        texto.includes("enviame") ||
        texto.includes("mandame") ||
        texto.includes("solo la") ||
        texto.includes("solo las") ||
        texto.includes("la negra") ||
        texto.includes("las negras") ||
        texto.includes("la blanca") ||
        texto.includes("las blancas") ||
        texto.includes("hazme el pedido") ||
        texto.includes("voy a pedir") ||
        texto.includes("para pedir");

    registrarProducto(usuario);

    guardar(usuario, {
        producto: "af1b",
        pedidoEnviado: false
    });

    if (intencionCompra) {
        return {
            foto: true,
            producto: "af1b",
            texto: "Perfecto. ¿Qué talla necesitas?"
        };
    }

    // Cliente solo está preguntando por el producto
    return {
        foto: true,
        producto: "af1b",
        texto: obtenerVariante("af1b", usuario, {

            A: "Hola, ¿en qué talla?",

            B: "¿Te interesa el modelo blanco o negro?",

            C: "¿Cuántos pares necesitas?",

            D: "¿Son para hombre o mujer?",

            E: "¿Desde qué barrio nos escribes?",

            F: "¿Es para ti o para regalo?",

            G: "¿Ya has usado Air Force 1 antes?"

        })
    };

};