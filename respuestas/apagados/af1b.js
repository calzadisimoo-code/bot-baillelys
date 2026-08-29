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

        return obtenerVariante("af1b", usuario, {

            A: "Hola que talla buscas?",

            B: "🔥 Hola tenemos las Air Force 1 blancas por *$60.000*.\n\n✅ Tallas disponibles del *21 al 44*.\n\n👟 *Escríbeme únicamente tu talla y te ayudo con el pedido.*",

            C: "🤍 Air Force 1 blancas disponibles.\n\n💰 Valor: *$60.000*\n\n👟 ¿Qué talla buscas?",

            D: "🚀 Tenemos disponibles las Air Force 1 blancas.\n\n💵 Valor: *$60.000*\n\n👟 *Envíame tu talla y te envío la información para recibirlas.*",

            E: "👋 ¡Hola! 😊\n\n¿En qué talla las necesitas?\n\n👟 Tenemos disponibles del *21 al 44*.\n💰 Precio: *$60.000*.",

            F: "✅ Sí están disponibles.\n\n🤍 Air Force 1 blancas.\n💰 *$60.000*\n\n👟 *Dime tu talla y en unos minutos dejamos listo tu pedido.*"

        });

    }

    return null;

};