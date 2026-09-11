const { guardar } = require("../estado");
const { obtenerVariante } = require("../estadisticas/ab");
const { registrarProducto } = require("../estadisticas/hoy");

module.exports = function (texto, usuario) {

    texto = texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (
        (
            texto.includes("air force") ||
            texto.includes("airforce") ||
            texto.includes("force 1") ||
            texto.includes("quiero las air force importadas") ||
            texto.includes("af1")
        ) &&
        (
            texto.includes(".1") ||
            texto.includes("1.1") ||
            texto.includes("import") ||
            texto.includes("importada") ||
            texto.includes("importadas")
        )
    ) {

        registrarProducto(usuario);

        guardar(usuario, {
            producto: "af1bi",
            pedidoEnviado: false
        });

        return obtenerVariante("af1bi", usuario, {

            A: `¿Las buscas para hombre o mujer?`,

            B: `📍 ¿Desde qué ciudad nos escribes?`,

            C: `💰 Las Air Force 1 importadas están en *$100.000*.

👟 ¿Qué talla necesitas?`,

            D: `🔥 Son calidad importada.

👟 ¿Qué talla buscas?`,

            E: `Hola 👋

¿En qué talla las necesitas?`,

            F: `📦 ¿Serían para ti o para un regalo?`,

            G: `🤍 Air Force 1 blancas importadas disponibles.

¿Te interesa pago contra entrega o Nequi?`

        });

    }

    return null;

};