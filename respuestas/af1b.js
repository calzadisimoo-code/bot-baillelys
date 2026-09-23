const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");
const {
    registrarProducto
} = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

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

    if (
        texto.includes("air force") ||
        texto.includes("airforce") ||
        texto.includes("for 1") ||
        texto.includes("quiero las air force") ||
        texto.includes("quiero las air force blancas") ||
        texto.includes("force 1") ||
        texto.includes("af1")
    ) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "af1b",
            pedidoEnviado: false
        });

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

    }

    return null;

};